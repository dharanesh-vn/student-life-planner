const Note = require('../models/Note');
const axios = require('axios');

const callHuggingFaceAI = async (modelUrl, prompt) => {
  const apiKey = process.env.HUGGING_FACE_API_KEY;
  if (!apiKey) {
    throw new Error('HUGGING_FACE_API_KEY is not set in .env file.');
  }

  try {
    const response = await axios.post(
      modelUrl,
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      // Handles responses from BART (summarization) and Keyphrase models
      return response.data[0].summary_text || response.data[0].generated_text || JSON.stringify(response.data);
    } else {
      throw new Error('Invalid response structure from Hugging Face.');
    }
  } catch (error) {
    console.error(`Axios error calling ${modelUrl}:`, error.response ? error.response.data : error.message);
    const errorMessage = error.response?.data?.error || 'Failed to fetch from Hugging Face API.';
    if (typeof errorMessage === 'string' && errorMessage.includes('is currently loading')) {
      throw new Error('The AI model is warming up. Please try again in 20-30 seconds.');
    }
    throw new Error(errorMessage);
  }
};

// ===================================================================================
// MAIN CONTROLLER - USES ONLY THE PROVEN, WORKING MODELS
// ===================================================================================
exports.processNotesWithAI = async (req, res) => {
  try {
    const { courseId, action } = req.body;
    if (!courseId || !action) {
      return res.status(400).json({ message: 'Course ID and action are required.' });
    }

    const notes = await Note.find({ user: req.user.id, course: courseId });
    if (notes.length === 0) {
      return res.status(404).json({ message: 'No notes found for this course to process.' });
    }
    const notesText = notes.map(note => `Note Title: ${note.title}\n\n${note.content}`).join('\n\n---\n\n');

    let modelEndpoint = '';
    let prompt = notesText;

    // FINAL MODEL STRATEGY:
    switch (action) {
      case 'summarize':
        // USE THE PROVEN SUMMARIZER
        modelEndpoint = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
        prompt = notesText;
        break;
      
      case 'key-concepts':
        // USE THE PROVEN KEYPHRASE EXTRACTOR
        modelEndpoint = 'https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-distilbert-inspec';
        prompt = notesText;
        break;

      case 'quiz':
        // USE THE WORKING SUMMARIZER with a specific prompt
        modelEndpoint = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
        // We trick the summarizer by asking it to "summarize" in the form of a quiz
        prompt = `Based on the following text, create a 3-question multiple-choice quiz with answers. Text: ${notesText}`;
        break;
      
      case 'flashcards':
        // USE THE WORKING SUMMARIZER with a specific prompt
        modelEndpoint = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
        // We ask it to "summarize" in the format of flashcards
        prompt = `Generate 5 flashcards with a "Front:" and a "Back:" from the following text. Text: ${notesText}`;
        break;

      default:
        return res.status(400).json({ message: 'Invalid action specified.' });
    }

    const aiResult = await callHuggingFaceAI(modelEndpoint, prompt);
    
    let formattedResult = aiResult;
    // Format the key-concepts result as it returns a JSON string
    if (action === 'key-concepts' && typeof aiResult === 'string' && aiResult.startsWith('[')) {
        try {
            const concepts = JSON.parse(aiResult);
            if (Array.isArray(concepts)) {
              // Just show the word, which is what this model is good at
              formattedResult = concepts.map((item) => `- **${item.word}**`).join('\n');
            }
        } catch(e) { /* Fallback to raw text if JSON parsing fails */ }
    }

    res.status(200).json({ result: formattedResult });

  } catch (error) {
    console.error("AI processing error in controller:", error.message);
    res.status(500).json({ message: error.message || 'An error occurred while communicating with the AI service.' });
  }
};