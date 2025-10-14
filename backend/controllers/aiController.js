// ===================================================================
// AI CONTROLLER - Google AI Studio REST API Integration
// This uses direct HTTP requests instead of SDK for better compatibility
// ===================================================================

const Note = require('../models/Note');
const axios = require('axios');

// ===================================================================
// HELPER FUNCTION: Call Google AI using REST API
// ===================================================================
const callGeminiAI = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Validate API key exists
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is not set in the .env file.');
    throw new Error('AI service is not configured. Please contact the administrator.');
  }

  // List of models to try (v1 and v1beta endpoints)
  const modelsToTry = [
    { endpoint: 'v1', model: 'gemini-2.5-flash' },
    { endpoint: 'v1beta', model: 'gemini-2.5-flash' },
    { endpoint: 'v1', model: 'gemini-1.5-flash' },
    { endpoint: 'v1beta', model: 'gemini-1.5-flash' },
    { endpoint: 'v1', model: 'gemini-1.5-pro' },
    { endpoint: 'v1beta', model: 'gemini-1.5-pro' },
  ];

  let lastError = null;

  for (const { endpoint, model } of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/${endpoint}/models/${model}:generateContent?key=${apiKey}`;
      
      console.log(`📤 Trying: ${endpoint}/${model}`);

      const response = await axios.post(
        url,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 second timeout
        }
      );

      // Extract text from response
      if (response.data && response.data.candidates && response.data.candidates[0]) {
        const text = response.data.candidates[0].content.parts[0].text;
        console.log(`✅ Success with ${endpoint}/${model}`);
        return text;
      } else {
        throw new Error('Invalid response format from AI');
      }

    } catch (error) {
      console.log(`⚠️ ${endpoint}/${model} failed:`, error.response?.data?.error?.message || error.message);
      lastError = error;
      continue; // Try next model
    }
  }

  // If we get here, all models failed
  console.error("❌ All models failed. Last error:", lastError?.response?.data || lastError?.message);
  
  // Provide helpful error message
  if (lastError?.response?.status === 400) {
    throw new Error('Invalid API key or request format. Please check your GEMINI_API_KEY.');
  } else if (lastError?.response?.status === 403) {
    throw new Error('API key does not have permission. Please enable the Generative Language API in Google Cloud Console.');
  } else if (lastError?.response?.status === 404) {
    throw new Error('API endpoint not found. Your API key may need to be regenerated in Google AI Studio.');
  } else if (lastError?.response?.status === 429) {
    throw new Error('API quota exceeded. Please try again later or upgrade your quota.');
  } else {
    throw new Error(`AI service error: ${lastError?.message || 'Unknown error'}`);
  }
};

// ===================================================================
// HELPER FUNCTION: Build prompts based on action type
// ===================================================================
const buildPrompt = (action, notesText) => {
  switch (action) {
    case 'summarize':
      return `You are an expert academic assistant. Summarize the following student notes in a clear, concise, and well-structured manner. Focus on the main points and key information. Use bullet points for clarity.

Notes:
${notesText}

Please provide a comprehensive summary:`;

    case 'key-concepts':
      return `You are an expert academic assistant. Extract and explain the key concepts and important terms from the following student notes. For each concept, provide:
- The concept name (bold)
- A clear, brief explanation
- Why it's important (if relevant)

Notes:
${notesText}

Please list the key concepts:`;

    case 'quiz':
      return `You are an expert academic quiz creator. Based on the following student notes, create a 5-question multiple-choice quiz to test understanding. 

Requirements:
- Each question should test comprehension, not just memorization
- Provide 4 options (A, B, C, D) for each question
- Clearly indicate the correct answer after each question
- Include a brief explanation for why the answer is correct

Notes:
${notesText}

Please create the quiz:`;

    case 'flashcards':
      return `You are an expert academic study assistant. Generate 8 effective flashcards from the following student notes. 

Format each flashcard EXACTLY as:
Front: [Question, term, or concept]
Back: [Answer, definition, or explanation]
---

Make the flashcards focused and useful for studying.

Notes:
${notesText}

Please generate the flashcards:`;

    default:
      return notesText;
  }
};

// ===================================================================
// MAIN CONTROLLER: Process Notes with AI
// ===================================================================
exports.processNotesWithAI = async (req, res) => {
  console.log('\n=== 🚀 AI Processing Request Started ===');
  console.log('📋 Action:', req.body.action);
  console.log('👤 User ID:', req.user?.id);
  console.log('📚 Course ID:', req.body.courseId);

  try {
    const { courseId, action } = req.body;

    // Validate required fields
    if (!courseId || !action) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        message: 'Course ID and action are required.' 
      });
    }

    // Validate action type
    const validActions = ['summarize', 'key-concepts', 'quiz', 'flashcards'];
    if (!validActions.includes(action)) {
      console.log('❌ Invalid action:', action);
      return res.status(400).json({ 
        message: `Invalid action. Must be one of: ${validActions.join(', ')}` 
      });
    }

    // Fetch notes from database
    console.log('🔍 Fetching notes from database...');
    const notes = await Note.find({ 
      user: req.user.id, 
      course: courseId 
    }).sort({ createdAt: -1 });
    
    console.log(`📝 Found ${notes.length} notes`);

    // Check if notes exist
    if (notes.length === 0) {
      console.log('⚠️ No notes found for this course');
      return res.status(404).json({ 
        message: 'No notes found for this course. Please create some notes first.' 
      });
    }

    // Combine all notes into a single text
    const notesText = notes
      .map((note, index) => {
        return `[Note ${index + 1}] ${note.title}\n\n${note.content}`;
      })
      .join('\n\n---\n\n');

    // Truncate if too long
    const maxLength = 25000;
    let processedText = notesText;
    
    if (notesText.length > maxLength) {
      processedText = notesText.substring(0, maxLength) + '\n\n[Content truncated due to length...]';
      console.warn(`⚠️ Notes truncated from ${notesText.length} to ${maxLength} chars`);
    }

    console.log(`📊 Processing ${processedText.length} characters with AI...`);

    // Build the prompt and call AI
    const prompt = buildPrompt(action, processedText);
    const aiResult = await callGeminiAI(prompt);

    console.log('=== ✅ AI Processing Completed Successfully ===\n');
    
    // Send successful response
    res.status(200).json({
      success: true,
      action: action,
      result: aiResult.trim(),
      notesProcessed: notes.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("\n=== ❌ AI Processing Error ===");
    console.error("Error:", error.message);
    console.error("=== End Error Log ===\n");

    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while processing your notes with AI.'
    });
  }
};

// ===================================================================
// ADDITIONAL CONTROLLER: Get AI Status (health check)
// ===================================================================
exports.checkAIStatus = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(503).json({
        status: 'unavailable',
        message: 'AI service is not configured'
      });
    }

    // Try a simple test with the most common model
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await axios.post(
      url,
      {
        contents: [{
          parts: [{
            text: "Hello"
          }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );

    if (response.data && response.data.candidates) {
      res.status(200).json({
        status: 'operational',
        message: 'AI service is ready',
        model: 'gemini-1.5-flash'
      });
    } else {
      res.status(503).json({
        status: 'error',
        message: 'Unexpected response from AI service'
      });
    }

  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'AI service is experiencing issues',
      error: error.message
    });
  }
};

// ===================================================================
// Export all controller functions
// ===================================================================
module.exports = {
  processNotesWithAI: exports.processNotesWithAI,
  checkAIStatus: exports.checkAIStatus
};