const Note = require('../models/Note');
const OpenAI = require('openai');

// Initialize the OpenAI client with the API key from the .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// This helper function builds the specific instruction (prompt) for the AI model.
const buildPrompt = (action, notesText) => {
  switch (action) {
    case 'summarize':
      return `
        You are an expert academic assistant. Your task is to create a concise, high-level summary from the following student's notes.
        Generate a summary that covers the main topics and key arguments. Use bullet points and markdown for clarity.
        The notes are:\n\n---\n\n${notesText}
      `;
    case 'key-concepts':
      return `
        You are a highly efficient study guide creator. Your task is to analyze the following notes and identify the 10 most important key concepts, terms, or names. 
        For each concept, provide a brief, one-sentence definition. Present the output as a clean list with the concept in bold markdown. Example: "**Photosynthesis:** The process by which green plants use sunlight to synthesize foods."
        The notes are:\n\n---\n\n${notesText}
      `;
    case 'quiz':
      return `
        You are a helpful teaching assistant creating a practice quiz. Your task is to generate a 5-question multiple-choice quiz based on the provided notes.
        Each question should have four possible answers (A, B, C, D), and you MUST indicate the correct answer by adding "**Correct Answer:**" followed by the correct letter after the options. Use markdown for formatting.
        The notes are:\n\n---\n\n${notesText}
      `;
    case 'flashcards':
      return `
        You are a flashcard generation tool. Your task is to read the following notes and create a list of 10 flashcards.
        For each flashcard, provide a "Front" (a term or question) and a "Back" (the definition or answer). Format the output clearly for each card using markdown's horizontal rule (---) to separate them. Example:
        **Front:** Photosynthesis
        **Back:** The process by which green plants use sunlight to synthesize foods from carbon dioxide and water.
        ---
        The notes are:\n\n---\n\n${notesText}
      `;
    default:
      // This should ideally not be reached if the frontend sends a valid action
      return `Please process the following text: ${notesText}`;
  }
};

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

    const prompt = buildPrompt(action, notesText);

    // Call the OpenAI API using the installed library
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo", // A powerful and cost-effective model that is reliably available
    });

    // Extract the AI's response text from the correct location in the response object
    const aiText = completion.choices[0].message.content;

    if (!aiText) {
      throw new Error("AI returned an empty or invalid response.");
    }

    res.status(200).json({ result: aiText });

  } catch (error) {
    console.error("AI processing error:", error);
    res.status(500).json({ message: 'An error occurred while communicating with the AI service.' });
  }
};