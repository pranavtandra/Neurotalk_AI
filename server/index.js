const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const imageGenerationRoutes = require('./routes/imageGeneration');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Debug: Log environment variables (remove sensitive data in production)
console.log('Environment check:');
console.log('- OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');

// Middleware
app.use(cors());
app.use(express.json());

// Check if API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not configured in .env file');
  process.exit(1);
} else {
  console.log('OPENAI_API_KEY is configured');
}

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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'
});

// Rate limiting handling
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callOpenAIWithRetry = async (prompt, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });
      return completion.choices[0].message.content;
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries) {
        console.log(`Rate limited. Attempt ${attempt} of ${maxRetries}. Waiting before retry...`);
        await sleep(25000); // Wait 25 seconds before retrying
        continue;
      }
      throw error;
    }
  }
};

// Process communication intent
app.post('/api/communicate', async (req, res) => {
  try {
    const { selections, targetLanguage } = req.body;
    
    console.log('Received request:', { selections, targetLanguage });
    
    if (!selections || !Array.isArray(selections) || selections.length === 0) {
      console.error('Invalid selections:', selections);
      return res.status(400).json({ 
        error: 'Invalid selections. Please provide an array of selected words.' 
      });
    }

    // Create a prompt based on user selections
    const prompt = `
      A person with communication difficulties has selected the following symbols/options: 
      ${selections.join(', ')}
      
      Please interpret this as a natural language statement or question that expresses their intent.
      Response should be concise and clear, appropriate for daily conversation.
      Do not include phrases like "likely,probably", seems like", orappears to be".
      Just provide the direct statement or question.
      ${targetLanguage && targetLanguage !== 'en' ? `Respond ONLY in ${targetLanguage}. Do not include any English text.` : 'Respond in English.'}
    `;
    
    console.log('Generated prompt:', prompt);
    
    const text = await callOpenAIWithRetry(prompt);
    console.log('Extracted text:', text);
    
    res.json({ 
      interpreted: text,
      originalSelections: selections
    });
  } catch (error) {
    console.error('Error processing communication:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    let errorMessage = 'Failed to process communication';
    if (error.status === 429) {
      errorMessage = 'API rate limit reached. Please try again in a few moments.';
    }
    
    res.status(error.status || 500).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
});

// Generate image using Gemini
app.post('/api/generate-image', async (req, res) => {
  try {
    const { words, language } = req.body;
    
    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid words. Please provide an array of words.' 
      });
    }

    console.log('Processing image generation request:', { words, language });
    
    const prompt = `
      Create a simple, clear visual representation for the following communication:
      ${words.join(', ')}
      
      The image should be:
      - Easy to understand
      - Suitable for people with communication difficulties
      - Clear and uncluttered
      - Culturally appropriate
      ${language && language !== 'en' ? `Consider cultural context for ${language} speakers.` : ''}
    `;
    
    console.log('Generated image prompt:', prompt);
    
    // For image generation, we'll use the dedicated DALL·E endpoint
    res.json({ 
      error: 'Use /api/generate-image-imagen endpoint for image generation'
    });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ 
      error: 'Failed to generate image',
      details: error.message 
    });
  }
});

// Generate visual aid
app.post('/api/generate-visual', async (req, res) => {
  try {
    const { message } = req.body;
    
    const prompt = `
      Generate a brief description of a simple visual aid or picture that would help 
      illustrate this message: "${message}"
      
      The description should be clear and concise, focusing on key visual elements 
      that would help someone understand the message.
      
      Respond in the same language as the message. If the message is not in English, 
      respond in that language. Do not mix languages.
    `;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });
    const visualDescription = completion.choices[0].message.content;
    
    res.json({ visualDescription });
  } catch (error) {
    console.error('Error generating visual aid:', error);
    res.status(500).json({ error: 'Failed to generate visual aid' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    apiKeyConfigured: hasApiKey,
    timestamp: new Date().toISOString()
  });
});

// Image generation routes
app.use('/api', imageGenerationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
});