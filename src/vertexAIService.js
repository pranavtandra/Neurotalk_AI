// vertexAIService.js - Updated for Imagen 4 via Gemini API

/**
 * This service uses Google's Imagen 4 model for image generation
 * through the Gemini API (requires backend implementation)
 */

/**
 * Generates an image using Google's Imagen 4 model via Gemini API
 * @param {Array} selectedItems - Array of selected word texts
 * @param {string} language - The output language
 * @returns {Promise<{url: string, description: string}>} - Image URL and description
 */
export const generateImageWithImagen = async (selectedItems, language) => {
  try {
    // Create a detailed prompt from the selected items
    const prompt = buildImagePrompt(selectedItems, language);
    
    console.log('Generating image with DALL·E for prompt:', prompt, 'language:', language);
    
    // Call your backend API that handles DALL·E
    const response = await fetch('http://localhost:5000/api/generate-image-imagen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        aspectRatio: '1:1',
        numberOfImages: 1,
        language: language
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.images && data.images.length > 0) {
      // Handle the image response from backend
      const imageData = data.images[0];
      
      // If it's base64 encoded
      if (imageData.bytesBase64Encoded) {
        const imageUrl = `data:${imageData.mimeType || 'image/png'};base64,${imageData.bytesBase64Encoded}`;
        return {
          url: imageUrl,
          description: imageData.description || `Generated image for: ${selectedItems.join(", ")}`
        };
      }
      
      // If it's a URL
      if (imageData.url) {
        return {
          url: imageData.url,
          description: imageData.description || `Generated image for: ${selectedItems.join(", ")}`
        };
      }
    }
    
    throw new Error(data.error || "No image generated");
    
  } catch (error) {
    console.error("Error generating image:", error);
    
    // Fallback to placeholder if real generation fails
    const placeholderUrl = `https://via.placeholder.com/512x512/4A90E2/FFFFFF?text=${encodeURIComponent(selectedItems.join('+'))}`;
    
    return {
      url: placeholderUrl,
      description: `Placeholder for: ${selectedItems.join(", ")} (Image generation failed: ${error.message})`
    };
  }
};

/**
 * Alternative method using Vertex AI directly (for more control)
 */
export const generateImageWithVertexAI = async (selectedItems, language) => {
  try {
    const prompt = buildImagePrompt(selectedItems, language);
    
    console.log('Attempting to generate image with prompt:', prompt);
    console.log('Calling backend endpoint: /api/generate-image-vertex');
    
    // Call backend endpoint for Vertex AI Imagen
    const response = await fetch('http://localhost:5000/api/generate-image-vertex', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        aspectRatio: '1:1',
        numberOfImages: 1,
        safetyFilterLevel: 'block_some'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.success && data.images) {
      const imageData = data.images[0];
      console.log('Image data received:', imageData);
      const imageUrl = `data:${imageData.mimeType};base64,${imageData.bytesBase64Encoded}`;
      
      return {
        url: imageUrl,
        description: `Generated image for: ${selectedItems.join(", ")}`
      };
    }
    
    console.error('No successful image data in response:', data);
    throw new Error(data.error || "No image generated");
    
  } catch (error) {
    console.error("Error generating image with Vertex AI:", error);
    console.error("Full error details:", error);
    return {
      url: null,
      description: `Unable to generate image: ${error.message}`
    };
  }
};

/**
 * Build a detailed prompt for the image generation
 * @param {Array} selectedItems - Selected words
 * @param {string} language - Target language
 * @returns {string} - Detailed prompt
 */
const buildImagePrompt = (selectedItems, language) => {
  // Basic prompt starting point
  let prompt = `Create a clear, simple image showing: ${selectedItems.join(", ")}. `;
  
  // Categorize items for better context
  const emotions = selectedItems.filter(item => 
    ["Happy", "Sad", "Angry", "Scared", "Pain", "Excited", "Confused"].includes(item)
  );
  
  const needs = selectedItems.filter(item => 
    ["Hungry", "Thirsty", "Tired", "Bathroom", "Hot", "Cold"].includes(item)
  );
  
  const activities = selectedItems.filter(item =>
    ["Play", "Read", "Walk", "Sleep", "Eat", "Drink"].includes(item)
  );
  
  // Add context based on categories
  if (emotions.length > 0) {
    prompt += `Show a person expressing ${emotions.join(" and ")}. `;
  }
  
  if (needs.length > 0) {
    prompt += `Include visual representations of ${needs.join(" and ")}. `;
  }
  
  if (activities.length > 0) {
    prompt += `Show someone ${activities.join(" and ")}. `;
  }
  
  // Add style guidelines for AAC-friendly images
  prompt += "Make the image simple, clear, and suitable for AAC (Augmentative and Alternative Communication). Use bright colors, clear outlines, and minimize background details. The image should be easily recognizable and understandable. Style: cartoon illustration, simple graphics, clean design.";
  
  return prompt;
};

/**
 * Test function to check if backend is working
 */
export const testImageGeneration = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error("Backend not available:", error);
    return false;
  }
};

/**
 * Get available image generation models
 */
export const getAvailableModels = () => {
  return [
    {
      name: 'Imagen 4',
      id: 'imagen-4',
      description: 'Latest Google image generation model via Gemini API',
      recommended: true
    },
    {
      name: 'Imagen 2',
      id: 'imagen-2',
      description: 'Previous generation via Vertex AI',
      recommended: false
    }
  ];
};