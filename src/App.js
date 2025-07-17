import React, { useState, useEffect } from 'react';
import WordLibrary, { supportedLanguages, wordCategories, uiTranslations, wordTranslations } from './components/WordLibrary';
import { generateImageWithImagen } from './vertexAIService';
import './App.css';

// Text-to-speech functionality
const speakText = (text, language = 'en') => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language for proper pronunciation
    utterance.lang = language;
    
    // Get all available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Better voice selection logic
    let selectedVoice = null;
    
    // First, try to find a high-quality voice for the target language
    selectedVoice = voices.find(voice => 
      voice.lang.startsWith(language) && 
      voice.localService && 
      (voice.name.includes('Premium') || voice.name.includes('Enhanced') || voice.name.includes('Natural'))
    );
    
    // If no premium voice, try any local service voice for the language
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith(language) && voice.localService
      );
    }
    
    // If no local service, try any voice for the language
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith(language)
      );
    }
    
    // If still no voice found, try to find a similar language family
    if (!selectedVoice) {
      const languageFamily = language.split('-')[0];
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith(languageFamily) && voice.localService
      );
    }
    
    // Last resort: use the default system voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.default) || voices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang}) for language: ${language}`);
    }
    
    // Adjust speech settings for better quality
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    // Add error handling
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };
    
    utterance.onend = () => {
      console.log('Speech synthesis completed');
    };
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported in this browser');
  }
};

// Helper function to get emoji by word ID
const getWordEmojiById = (wordId, wordCategories) => {
  console.log('getWordEmojiById called with wordId:', wordId);
  
  // Check built-in words
  for (const categoryId in wordCategories) {
    const word = wordCategories[categoryId].words.find(w => w.id === wordId);
    if (word) {
      console.log('Found built-in word:', word);
      return word.symbol;
    }
  }
  
  console.log('No word found for ID:', wordId, 'returning fallback emoji');
  return '📝';
};

// Helper function to get translated text by word ID
const getTranslatedText = (wordId, language, wordCategories, wordTranslations) => {
  // Check built-in words
  for (const categoryId in wordCategories) {
    const word = wordCategories[categoryId].words.find(w => w.id === wordId);
    if (word) {
      return wordTranslations[wordId]?.[language] || wordTranslations[wordId]?.['en'] || wordId;
    }
  }
  return wordId;
};

// SelectionBar component
const SelectionBar = ({ selectedWords, onWordSelect, language, getWordEmojiById, getTranslatedText, onClearAll }) => {
  if (!selectedWords || selectedWords.length === 0) return null;
  
  const cleanSelectedWords = selectedWords.filter(id => id !== undefined && id !== null);
  if (cleanSelectedWords.length === 0) return null;
  
  const handleRemoveWord = (wordIdToRemove) => {
    const updatedSelection = cleanSelectedWords.filter(id => id !== wordIdToRemove);
    onWordSelect(updatedSelection);
  };
  
  const handleClearAll = () => {
    onWordSelect([]);
    if (onClearAll) onClearAll();
  };
  
  return (
    <div className="selection-bar">
      <div className="selection-bar-content">
        <div className="selection-label">
          {uiTranslations.selectedWords?.[language] || 'Selected:'}    </div>
        <div className="selected-words-list">
          {cleanSelectedWords.map((wordId, index) => {
            const emoji = getWordEmojiById(wordId);
            const text = getTranslatedText(wordId); // Always use this for label
            return (
              <div key={index} className="selected-word-chip">
                <span className="selected-word-emoji" style={{ marginRight: '6px' }}>{emoji}</span>
                <span className="selected-word-text">{text}</span>
                <button
                  className="remove-word-btn"
                  onClick={() => handleRemoveWord(wordId)}
                  aria-label="Remove word"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
        <button
          className="clear-all-btn"
          onClick={handleClearAll}
        >
          {uiTranslations.clearAll?.[language] || 'Clear All'}
        </button>
      </div>
    </div>
  );
};

function App() {
  const [selectedWords, setSelectedWords] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [interpretedText, setInterpretedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');
  const [generateImage, setGenerateImage] = useState(true);
  const [showVisualAid, setShowVisualAid] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  // LIFTED STATE
  const [customWords, setCustomWords] = useState({});
  const [customCategories, setCustomCategories] = useState([]);

  // Helper to build a word map from built-in and custom words
  const buildWordMap = () => {
    const map = {};
    for (const categoryId in wordCategories) {
      for (const word of wordCategories[categoryId].words) {
        map[word.id] = word;
      }
    }
    for (const categoryId in customWords) {
      for (const word of customWords[categoryId] || []) {
        map[word.id] = word;
      }
    }
    return map;
  };
  const wordMap = buildWordMap();

  // Updated emoji/text lookup to use wordMap
  const getWordEmojiById = (wordId) => {
    const word = wordMap[wordId];
    if (word && word.emoji) return word.emoji;
    if (word && word.symbol) return word.symbol;
    return '📝';
  };
  const getTranslatedText = (wordId) => {
    const word = wordMap[wordId];
    if (word && word.word) {
      if (typeof word.word === 'object') {
        return word.word[selectedLanguage] || word.word['en'];
      } else if (typeof word.word === 'string') {
        return word.word;
      }
    }
    if (word && word.text) return word.text;
    return wordTranslations[wordId]?.[selectedLanguage] || wordTranslations[wordId]?.['en'] || wordId;
  };

  // Helper function to get translated UI text
  const getUIText = (key) => {
    return uiTranslations[key]?.[selectedLanguage] || uiTranslations[key]?.['en'] || key;
  };

  // Function to clear all interpreted data
  const handleClearAll = () => {
    setInterpretedText('');
    setImageUrl('');
    setImageDescription('');
    setImageError(null);
    setError(null);
  };

  useEffect(() => {
    checkServerStatus();
    
    // Set initial document direction
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    if (rtlLanguages.includes(selectedLanguage)) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      
      if (response.ok && data.apiKeyConfigured) {
        setServerStatus('ok');
      } else {
        setServerStatus('error');
        setError('Server is not properly configured. Please check the API key.');
      }
    } catch (err) {
      setServerStatus('error');
      setError('Cannot connect to server. Please make sure the server is running.');
    }
  };

  const handleWordSelect = (wordIds) => {
    // wordIds is now an array of word IDs from WordLibrary.js
    setSelectedWords(wordIds);
    // Clear any previous errors when selecting new words
    setError(null);
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    
    // Set document direction for RTL languages
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    if (rtlLanguages.includes(newLanguage)) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    
    // Clear interpreted message and related data when changing language
    setInterpretedText('');
    setImageUrl('');
    setImageDescription('');
    setImageError(null);
    setSelectedWords([]);
    setError(null);
  };

  const getSelectedWordsText = () => {
    return selectedWords.map(id => {
      // Find the word in all categories
      for (const category of Object.values(wordCategories)) {
        const word = category.words.find(w => w.id === id);
        if (word) return word.text;
      }
      return id;
    });
  };

  const handleInterpret = async () => {
    console.log('handleInterpret called');
    console.log('generateImage checkbox state:', generateImage);
    console.log('selectedWords:', selectedWords);
    
    if (selectedWords.length === 0) {
      setError('Please select at least one word to interpret.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setImageUrl('');
    setImageDescription('');
    setImageError(null);
    
    try {
      const wordTexts = getSelectedWordsText();
      console.log('Sending words for interpretation:', wordTexts);
      
      const response = await fetch('http://localhost:5000/api/communicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selections: wordTexts,
          targetLanguage: selectedLanguage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to interpret selection');
      }

      if (!data.interpreted) {
        throw new Error('No interpretation received from server');
      }

      setInterpretedText(data.interpreted);
      console.log('Interpretation successful, now checking image generation...');
      
      // Gemini image generation
      if (generateImage) {
        console.log('Image generation is enabled, calling generateImageWithImagen...');
        setImageLoading(true);
        try {
          const imagenResult = await generateImageWithImagen(wordTexts, selectedLanguage);
          console.log('Image generation result:', imagenResult);
          setImageUrl(imagenResult.url);
          setImageDescription(imagenResult.description);
        } catch (imgErr) {
          console.error('Image generation error:', imgErr);
          setImageError('Failed to generate image with Imagen 4.');
          setImageUrl('');
          setImageDescription('');
        } finally {
          setImageLoading(false);
        }
      } else {
        console.log('Image generation is disabled');
      }
    } catch (err) {
      console.error('Error in interpretation:', err);
      setError(err.message || 'Failed to interpret selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (serverStatus === 'checking') {
    return (
      <div className="app">
        <div className="loading-message">Checking server status...</div>
      </div>
    );
  }

  if (serverStatus === 'error') {
    return (
      <div className="app">
        <div className="error-message">
          <h2>Server Connection Error</h2>
          <p>{error}</p>
          <button onClick={checkServerStatus} className="retry-button">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>NeuroTalk AI</h1>
        <div className="language-selector">
          <label htmlFor="language">Select Language:</label>
          <select 
            id="language" 
            value={selectedLanguage} 
            onChange={handleLanguageChange}
          >
            {supportedLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Selection bar at the top, outside the card */}
      <SelectionBar
        selectedWords={selectedWords}
        onWordSelect={handleWordSelect}
        language={selectedLanguage}
        getWordEmojiById={getWordEmojiById}
        getTranslatedText={getTranslatedText}
        onClearAll={handleClearAll}
      />

      <main className="app-main">
        <section className="word-selection">
          <WordLibrary 
            onWordSelect={handleWordSelect}
            selectedWords={selectedWords}
            language={selectedLanguage}
            customWords={customWords}
            setCustomWords={setCustomWords}
            customCategories={customCategories}
            setCustomCategories={setCustomCategories}
          />
        </section>

        <section className="interpretation">
          <button 
            onClick={handleInterpret}
            disabled={loading || selectedWords.length === 0}
            className="interpret-button"
          >
            {loading ? getUIText('processing') : getUIText('interpretSelection')}
          </button>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5em', margin: '1em 0' }}>
           <label style={{ userSelect: 'none' }}>
             <input
               type="checkbox"
               checked={generateImage}
               onChange={e => setGenerateImage(e.target.checked)}
               style={{ marginRight: '0.5em' }}
             />
             {getUIText('generateImage')}
           </label>
           <label style={{ userSelect: 'none' }}>
             <input
               type="checkbox"
               checked={showVisualAid}
               onChange={e => setShowVisualAid(e.target.checked)}
               style={{ marginRight: '0.5em' }}
             />
             {getUIText('showVisualAid')}
           </label>
         </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {interpretedText && (
            <div className="interpreted-text">
              <h3>{getUIText('interpretedMessage')}</h3>
              <p 
                onClick={() => speakText(interpretedText, selectedLanguage)}
                className="clickable-message"
                title="Click to hear this message spoken aloud"
              >
                🔊 {interpretedText}
              </p>
              {generateImage && (
                <div className="generated-image" style={{ marginTop: '1em' }}>
                  {imageLoading && <div>{getUIText('generatingImage')}</div>}
                  {imageError && <div style={{ color: 'red' }}>{imageError}</div>}
                  {imageUrl && !imageLoading && (
                    <img 
                      src={imageUrl} 
                      alt={getUIText('generatedVisualAid')}
                      className="visual-aid"
                      style={{ maxWidth: '100%', borderRadius: '8px' }}
                    />
                  )}
                  {showVisualAid && imageDescription && !imageLoading && (
                    <div className="visual-aid-description" style={{ marginTop: '1em' }}>
                      <h4>{getUIText('visualAid')}</h4>
                      <p>{imageDescription}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;