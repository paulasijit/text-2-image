// Prompt.js
import React, { useState } from 'react';
import './Prompt.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Prompt = ({ onGenerate, selectedFeature, isLoading }) => {
  // const [selectedFeature, setSelectedFeature] = useState('semanticAnalysis'); // Default feature

  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [isNegativePromptActive, setIsNegativePromptActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeInput, setActiveInput] = useState(null); // 'prompt' or 'negativePrompt'

  const handleGenerateClick = () => {
    if (isLoading) return;
    if (typeof onGenerate === 'function') {
      if (selectedFeature === 'imageGenerator')
        onGenerate(prompt, isNegativePromptActive ? negativePrompt : '');
        else if (selectedFeature === 'semanticAnalysis')
          onGenerate(prompt);
        else if (selectedFeature === 'contentAnalysis')
          onGenerate(prompt);
        else
        onGenerate(prompt, isNegativePromptActive ? negativePrompt : '');
      }
  };

  const handleToggleChange = (event) => {
    setIsNegativePromptActive(event.target.checked);
  };

  // Function to start speech recognition
  const startListening = (inputName) => {
    setActiveInput(inputName); // Set which input is active
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      
      recognition.onresult = function(event) {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        if (activeInput === 'prompt') {
          setPrompt(transcript);
        } else if (activeInput === 'negativePrompt') {
          setNegativePrompt(transcript);
        }
        
        recognition.stop();
      };
      
      recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
        recognition.stop();
      };
      
      setIsListening(true);
      recognition.onend = () => setIsListening(false);
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  };


  return (
    <header className="header">
      <div className="prompts">
        <div className="prompt-container">
          <label className="prompt-label">Prompt</label>
          <textarea
    placeholder="Enter a description of what you want the AI to create"
    className="search-bar"
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    rows="1" // Start with a single line
    style={{ resize: 'vertical' }} // Allows the user to resize vertically
  />
<button className="voice-button" onClick={() => startListening('prompt')} disabled={isListening}>
  <FontAwesomeIcon icon={isListening && activeInput === 'prompt' ? faMicrophoneSlash : faMicrophone} />
</button>
        </div>
        
        <div className="prompt-container negative-prompt-container">
          <h3 className="filter-subtitle">Negative Prompt</h3>
          <label className="switch">
            <input type="checkbox" onChange={handleToggleChange} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      
      <div className="generate">
        {isNegativePromptActive && (
          <div className="prompt-container">
            <label className="prompt-label">Negative Prompt</label>
            <textarea
              placeholder="Enter a description of what not to be present in the image"
              className="search-bar"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              rows="1" // Start with a single line
              style={{ resize: 'vertical' }} // Allows the user to resize vertically
            />
             <button className="voice-button" onClick={() => startListening('negativePrompt')} disabled={isListening}>
      <FontAwesomeIcon icon={isListening && activeInput === 'negativePrompt' ? faMicrophoneSlash : faMicrophone} />
    </button>
          </div>
        )}

<button className="generate-button" onClick={handleGenerateClick} disabled={isLoading}>
  {isLoading ? (
    <>
      <FontAwesomeIcon icon={faSpinner} spin />
      <span>  Generating...</span>
    </>
  ) : (
    'Generate'
  )}
</button>
      </div>
    </header>
  
  );
};

export default Prompt;