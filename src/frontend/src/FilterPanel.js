import React, { useState } from 'react';
import './FilterPanel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const FilterPanel = ({ selectedImageCount, setSelectedImageCount, imageQuality, setImageQuality,
  selectedArtStyle, setSelectedArtStyle, selectedThemeGenre, setSelectedThemeGenre,
  selectedLocation, setSelectedLocation, selectedWeather, setSelectedWeather,
  selectedTechnique, setSelectedTechnique

}) => {
  // const [selectedEngine, setSelectedEngine] = useState('DreamyEngine v5.2');
  // const [selectedImageCount, setSelectedImageCount] = useState(3);
  // const [selectedArtStyle, setSelectedArtStyle] = useState('');
  // const [selectedThemeGenre, setSelectedThemeGenre] = useState('');
  // const [selectedImageQuality, setSelectedImageQuality] = useState('');
  // const [selectedLocation, setSelectedLocation] = useState('');
  // const [selectedWeather, setSelectedWeather] = useState('');
  // const [selectedTechnique, setSelectedTechnique] = useState('');
  //const [imageCount, setImageCount] = useState(2);

  // const engineOptions = ['DreamyEngine v5.2', 'MysticEngine v3.0', 'FantasyEngine v1.5', 'OtherEngine v2.7'];
  const artStyles = ['Real life HD', 'Painting', 'Digital Art', 'Cartoon','3D Rendering', 'Vintage', 'Anime / Manga','Graffiti / Street Art'];
  const themeGenre = ['Romantic', 'Adventure', 'Thriller', 'Comedy', 'Fantasy', 'Sci-Fi', 'Horror', 'Drama', 'Detective/Mystery'];
  const imageQualities = ['Standard', 'HD', 'Genius (Ultra-HD)'];
  
  const location = ['Urban/Cityscape', 'Rural Countryside', 'Mountainous', 'Forests', 'Desert', 'Tropical Beach', 'Oceanic/Aquatic'];
  const weather = ['Sunny', 'Overcast', 'Rain', 'Snow'];
  const technique = ['DSLR', 'Cinematic', 'HDR Imaging', 'Long Exposure', 'Pano', 'Portrait'];
  // const handleEngineChange = (event) => {
  //   setSelectedEngine(event.target.value);
  // };

  // const handleImageCountChange = (number) => {
  //   setSelectedImageCount(number);
  // };

  // Function to increment the image count
  const incrementCount = () => {
    if (selectedImageCount < 10) {
      setSelectedImageCount(selectedImageCount + 1);
    }
  };

   // Function to decrement the image count
   const decrementCount = () => {
    if (selectedImageCount > 1) {
      setSelectedImageCount(selectedImageCount - 1);
    }
  };

   // Handle direct input change with validation
   const handleInputChange = (event) => {
    const value = Math.max(1, Math.min(10, Number(event.target.value)));
    setSelectedImageCount(value);
  };

  const handleArtStyle = (style) => {
    setSelectedArtStyle(style);
  };

  const handleThemeGenre = (genre) => {
    setSelectedThemeGenre(genre);
  };

  // const handleImageQuality = (quality) => {
  //   setSelectedImageQuality(quality);
  // };

   // Function to handle image quality selection
   const handleImageQualityChange = (quality) => {
    setImageQuality(quality);
  };

  const handleLocation = (location) => {
    setSelectedLocation(location);
  };

  const handleWeather = (weather) => {
    setSelectedWeather(weather);
  };

  const handleTechnique = (technique) => {
    setSelectedTechnique(technique);
  };

  

  return (
    <aside className="filter-panel">
      <h2 className="filter-title">Filter</h2>
      {/* <div className="filter-section">
        <h3 className="filter-subtitle">Generating Engine</h3>
        <select value={selectedEngine} onChange={handleEngineChange}>
          {engineOptions.map((engine, index) => (
            <option key={index} value={engine}>{engine}</option>
          ))}
        </select>
      </div> */}
      {/* <div className="filter-section">
        <h3 className="filter-subtitle">Number of Images</h3>
        <div className="number-buttons">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((number) => (
            <button key={number} className={`number-button ${number === selectedImageCount ? 'selected' : ''}`} onClick={() => setSelectedImageCount(number)}>{number}</button>
          ))}
        </div>
      </div> */}
       <div className="filter-section">
        <h3 className="filter-subtitle">Number of Images</h3>
        <div className="image-count-input">
          <button onClick={decrementCount} className="icon-button">
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <input
            type="number"
            className="image-count-textbox"
            value={selectedImageCount}
            onChange={handleInputChange}
            min="1"
            max="10"
          />
          <button onClick={incrementCount} className="icon-button">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
      <div className="filter-section">
        <h3 className="filter-subtitle">Image Quality</h3>
        <div className="image-type-buttons">
          {imageQualities.map((quality, index) => (
            <button
              key={index}
              className={`number-button ${imageQuality === quality ? 'selected' : ''}`}
              onClick={() => handleImageQualityChange(quality)}
            >
              {quality}
            </button>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <h3 className="filter-subtitle">Art Style</h3>
        <div className="image-type-buttons">
        {artStyles.map((style, index) => (
      <button
        key={index}
        className={`number-button ${selectedArtStyle === style ? 'selected' : ''}`}
        onClick={() => handleArtStyle(style)}
      >
        {style}
      </button>
    ))}
        </div>
      </div>
      <div className="filter-section">
        <h3 className="filter-subtitle">Theme / Genre</h3>
        <div className="image-type-buttons">
          {themeGenre.map((genre, index) => (
            <button
              key={index}
              className={`number-button ${selectedThemeGenre === genre ? 'selected' : ''}`}
              onClick={() => handleThemeGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-subtitle">Location / Setting</h3>
        <div className="image-type-buttons">
          {location.map((location, index) => (
            <button
              key={index}
              className={`number-button ${selectedLocation === location ? 'selected' : ''}`}
              onClick={() => handleLocation(location)}
            >
              {location}
            </button>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <h3 className="filter-subtitle">Weather Conditions</h3>
        <div className="image-type-buttons">
          {weather.map((weather, index) => (
            <button
              key={index}
              className={`number-button ${selectedWeather === weather ? 'selected' : ''}`}
              onClick={() => handleWeather(weather)}
            >
              {weather}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h3 className="filter-subtitle">Photography Technique</h3>
        <div className="image-type-buttons">
          {technique.map((tech, index) => (
            <button
              key={index}
              className={`number-button ${selectedTechnique === tech ? 'selected' : ''}`}
              onClick={() => handleTechnique(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
      
    </aside>
  );
};

export default FilterPanel;
