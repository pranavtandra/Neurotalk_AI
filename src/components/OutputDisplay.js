import React, { useState } from 'react';

const OutputDisplay = ({ interpretedText, visualAid, language, imageUrl, showImageBelowText }) => {
  // showVisualAid is now controlled by parent

  return (
    <div className="output-container">
      <h3>Interpreted Communication ({language}):</h3>
      <div className="message-bubble">
        {interpretedText}
      </div>
      {showImageBelowText && imageUrl && (
        <div className="visual-aid-image" style={{ margin: '1em 0' }}>
          <img 
            src={imageUrl} 
            alt={visualAid || 'Generated visual aid'}
            className="generated-image" 
            style={{ maxWidth: '100%', maxHeight: 200 }}
          />
        </div>
      )}
      {visualAid && (
        <div className="visual-aid-section">
          {showVisualAid && (
            <div className="visual-aid-content">
              <h4>Visual Aid:</h4>
              <div className="visual-aid-description">
                <p>{visualAid}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OutputDisplay;