import React, { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import OutputDisplay from './OutputDisplay';
import PictogramGrid from './PictogramGrid';
import ImageGenerator from './ImageGenerator';

const CommunicationApp = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedItems, setSelectedItems] = useState([]);
  const [interpretedText, setInterpretedText] = useState('');
  const [visualAid, setVisualAid] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiSentence, setAiSentence] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [generateImage, setGenerateImage] = useState(true);
  const [showVisualAid, setShowVisualAid] = useState(true);

  const translations = {
    English: {
      want: "want",
      need: "need",
      go: "go to",
      is: "is",
      feel: "feel",
      pronouns: { me: "I", you: "you" }
    },
    Spanish: {
      want: "quiero",
      need: "necesito",
      go: "ir a",
      is: "es",
      feel: "siento",
      pronouns: { me: "yo", you: "tú" }
    },
    French: {
      want: "veux",
      need: "besoin de",
      go: "aller à",
      is: "est",
      feel: "sens",
      pronouns: { me: "je", you: "tu" }
    },
    Chinese: {
      want: "想要",
      need: "需要",
      go: "去",
      is: "是",
      feel: "感觉",
      pronouns: { me: "我", you: "你" }
    },
    Arabic: {
      want: "أريد",
      need: "أحتاج",
      go: "اذهب إلى",
      is: "هو",
      feel: "أشعر",
      pronouns: { me: "أنا", you: "أنت" }
    },
    Russian: {
      want: "хочу",
      need: "нуждаюсь",
      go: "идти в",
      is: "есть",
      feel: "чувствую",
      pronouns: { me: "я", you: "ты" }
    },
    Japanese: {
      want: "欲しい",
      need: "必要",
      go: "行く",
      is: "です",
      feel: "感じる",
      pronouns: { me: "私", you: "あなた" }
    },
    German: {
      want: "möchte",
      need: "brauche",
      go: "gehen zu",
      is: "ist",
      feel: "fühle",
      pronouns: { me: "ich", you: "du" }
    }
  };

  const commonWords = {
    Food: {
      English: "food",
      Spanish: "comida",
      French: "nourriture",
      Chinese: "食物",
      Arabic: "طعام",
      Russian: "еда",
      Japanese: "食べ物",
      German: "Essen"
    },
    Water: {
      English: "water",
      Spanish: "agua",
      French: "eau",
      Chinese: "水",
      Arabic: "ماء",
      Russian: "вода",
      Japanese: "水",
      German: "Wasser"
    },
    Bathroom: {
      English: "bathroom",
      Spanish: "baño",
      French: "salle de bain",
      Chinese: "浴室",
      Arabic: "حمام",
      Russian: "ванная",
      Japanese: "お手洗い",
      German: "Badezimmer"
    },
    Sleep: {
      English: "sleep",
      Spanish: "dormir",
      French: "dormir",
      Chinese: "睡觉",
      Arabic: "نوم",
      Russian: "спать",
      Japanese: "寝る",
      German: "schlafen"
    },
    Medicine: {
      English: "medicine",
      Spanish: "medicina",
      French: "médicament",
      Chinese: "药物",
      Arabic: "دواء",
      Russian: "лекарство",
      Japanese: "薬",
      German: "Medikament"
    },
    Happy: {
      English: "happy",
      Spanish: "feliz",
      French: "heureux",
      Chinese: "快乐",
      Arabic: "سعيد",
      Russian: "счастливый",
      Japanese: "幸せ",
      German: "glücklich"
    },
    Sad: {
      English: "sad",
      Spanish: "triste",
      French: "triste",
      Chinese: "悲伤",
      Arabic: "حزين",
      Russian: "грустный",
      Japanese: "悲しい",
      German: "traurig"
    },
    Angry: {
      English: "angry",
      Spanish: "enojado",
      French: "en colère",
      Chinese: "生气",
      Arabic: "غاضب",
      Russian: "сердитый",
      Japanese: "怒っている",
      German: "wütend"
    },
    Scared: {
      English: "scared",
      Spanish: "asustado",
      French: "effrayé",
      Chinese: "害怕",
      Arabic: "خائف",
      Russian: "испуганный",
      Japanese: "怖い",
      German: "verängstigt"
    },
    Pain: {
      English: "pain",
      Spanish: "dolor",
      French: "douleur",
      Chinese: "疼痛",
      Arabic: "ألم",
      Russian: "боль",
      Japanese: "痛み",
      German: "Schmerz"
    },
    Home: {
      English: "home",
      Spanish: "casa",
      French: "maison",
      Chinese: "家",
      Arabic: "منزل",
      Russian: "дом",
      Japanese: "家",
      German: "Zuhause"
    },
    School: {
      English: "school",
      Spanish: "escuela",
      French: "école",
      Chinese: "学校",
      Arabic: "مدرسة",
      Russian: "школа",
      Japanese: "学校",
      German: "Schule"
    },
    Park: {
      English: "park",
      Spanish: "parque",
      French: "parc",
      Chinese: "公园",
      Arabic: "حديقة",
      Russian: "парк",
      Japanese: "公園",
      German: "Park"
    },
    Store: {
      English: "store",
      Spanish: "tienda",
      French: "magasin",
      Chinese: "商店",
      Arabic: "متجر",
      Russian: "магазин",
      Japanese: "店",
      German: "Geschäft"
    },
    Hospital: {
      English: "hospital",
      Spanish: "hospital",
      French: "hôpital",
      Chinese: "医院",
      Arabic: "مستشفى",
      Russian: "больница",
      Japanese: "病院",
      German: "Krankenhaus"
    }
  };

  const interpretPictograms = () => {
    if (selectedItems.length === 0) return "";
    const lang = selectedLanguage;
    let sentence = "";
    if (selectedItems.includes("Me") && selectedItems.includes("Want")) {
      const object = selectedItems.find(item => !["Me", "Want"].includes(item));
      if (object) {
        const translatedObject = commonWords[object] ? commonWords[object][lang] : object.toLowerCase();
        sentence = `${translations[lang].pronouns.me} ${translations[lang].want} ${translatedObject}`;
      }
    } else if (selectedItems.includes("Me") && selectedItems.includes("Feel")) {
      const feeling = selectedItems.find(item => !["Me", "Feel"].includes(item));
      if (feeling) {
        sentence = `${translations[lang].pronouns.me} ${translations[lang].feel} ${feeling.toLowerCase()}`;
      }
    } else if (selectedItems.includes("Go")) {
      const place = selectedItems.find(item => item !== "Go" && ["Home", "School", "Park", "Store", "Hospital"].includes(item));
      if (place) {
        sentence = `${translations[lang].go} ${place.toLowerCase()}`;
      }
    } else {
      sentence = selectedItems.join(" ").toLowerCase();
    }
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  };

  const handleSelectPictogram = (item) => {
    setSelectedItems(prev => [...prev, item]);
  };

  const handleClear = () => {
    setSelectedItems([]);
    setInterpretedText('');
    setVisualAid('');
    setAiSentence('');
    setImageUrl('');
  };

  const handleInterpret = async () => {
    const text = interpretPictograms();
    setInterpretedText(text);
    if (generateImage) {
      await generateVisualAid();
    } else {
      setVisualAid("");
      setImageUrl("");
    }
  };

  useEffect(() => {
    if (interpretedText) {
      setInterpretedText(interpretPictograms());
    }
  }, [selectedLanguage]);

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = selectedLanguage === 'English' ? 'en-US' : selectedLanguage;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>AAC Communication Tool</h1>
        <p>Select pictograms to express yourself</p>
      </div>
      <LanguageSelector selectedLanguage={selectedLanguage} onSelectLanguage={setSelectedLanguage} />
      <PictogramGrid onSelect={handleSelectPictogram} selectedLanguage={selectedLanguage} />
      <div className="selection-container">
        <h2>Your Selection:</h2>
        <div className="selected-items">
          {selectedItems.map((item, index) => (
            <span key={index} className="selected-item">
              {item}
              <button onClick={() => playAudio(item)} aria-label={`Play ${item}`}>🔊</button>
            </span>
          ))}
        </div>
        <div style={{ background: '#f8f8f8', border: '1px solid #ccc', padding: '0.5em', borderRadius: '6px', marginBottom: '1em' }}>
          <label style={{ userSelect: 'none', marginRight: '1.5em' }}>
            <input
              type="checkbox"
              checked={generateImage}
              onChange={e => setGenerateImage(e.target.checked)}
              style={{ marginRight: '0.5em' }}
            />
            Generate Image
          </label>
          <label style={{ userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={showVisualAid}
              onChange={e => setShowVisualAid(e.target.checked)}
              style={{ marginRight: '0.5em' }}
            />
            Show Visual Aid Description
          </label>
        </div>
        <button
          onClick={handleInterpret}
          disabled={selectedItems.length === 0 || loading}
          style={{ minWidth: 200 }}
        >
          {loading ? 'Processing...' : 'Interpret Selection'}
        </button>
        <button onClick={handleClear}>Clear All</button>
      </div>
      {(interpretedText || aiSentence) && (
        <OutputDisplay 
          interpretedText={aiSentence || interpretedText}
          visualAid={visualAid}
          language={selectedLanguage}
          imageUrl={generateImage ? imageUrl : ''}
          showImageBelowText={true}
          showVisualAid={showVisualAid}
        />
      )}
    </div>
  );
};

export default CommunicationApp;