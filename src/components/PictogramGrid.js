import React from 'react';

const PictogramGrid = ({ onSelect, selectedLanguage, translateText }) => {
  // These would ideally be replaced with actual pictogram images
  const basePictograms = {
    needs: ['Food', 'Water', 'Bathroom', 'Sleep', 'Medicine'],
    feelings: ['Happy', 'Sad', 'Angry', 'Scared', 'Pain'],
    actions: ['Go', 'Stop', 'Help', 'Play', 'Work'],
    people: ['Me', 'You', 'Friend', 'Family', 'Doctor'],
    places: ['Home', 'School', 'Park', 'Store', 'Hospital'],
    time: ['Now', 'Later', 'Morning', 'Night', 'Wait'],
    questions: ['What?', 'Where?', 'When?', 'Why?', 'How?'],
    objects: ['Phone', 'Book', 'Toy', 'Car', 'Computer']
  };

  // Helper to get a placeholder image for each pictogram
  const getPlaceholderImage = (item) =>
    `https://via.placeholder.com/64?text=${encodeURIComponent(item)}`;

  // Helper to translate a label (async, but for now just use the original)
  // In a real app, you might want to prefetch translations

  return (
    <div className="pictogram-container">
      {Object.entries(basePictograms).map(([category, items]) => (
        <div key={category} className="category-group">
          <h3>{category}</h3>
          <div className="pictogram-grid">
            {items.map((item) => (
              <button 
                key={item} 
                className="pictogram-item"
                onClick={() => onSelect(item)}
              >
                <img src={getPlaceholderImage(item)} alt={item} style={{ width: 40, height: 40, display: 'block', margin: '0 auto 4px' }} />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PictogramGrid;