import React from 'react';

const LanguageSelector = ({ selectedLanguage, onSelectLanguage }) => {
  const languages = [
    'English', 'Spanish', 'French', 'Chinese', 
    'Arabic', 'Russian', 'Japanese', 'German'
  ];

  return (
    <div className="language-selector">
      <label htmlFor="language-select">Output Language: </label>
      <select 
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => onSelectLanguage(e.target.value)}
      >
        {languages.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;