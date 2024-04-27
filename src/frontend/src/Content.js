// Content.js
import React, { useState, useEffect } from "react";
import FilterPanel from "./FilterPanel";
import Prompt from "./Prompt";
import SemanticAnalysisGraph from "./SemanticAnalysisGraph"; // Import the new component
import FiltrationScoresGraph from "./FiltrationScoresGraph";
import Carousel from "./Carousel";
import "./Content.css";

const Content = ({ selectedFeature }) => {
  // const [selectedFeature, setSelectedFeature] = useState('semanticAnalysis'); // Default feature
  const [selectedImageCount, setSelectedImageCount] = useState(2); // Default to 2 or any number
  const [imageQuality, setImageQuality] = useState("HD");
  const [selectedArtStyle, setSelectedArtStyle] = useState("");
  const [selectedThemeGenre, setSelectedThemeGenre] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedWeather, setSelectedWeather] = useState("");
  const [selectedTechnique, setSelectedTechnique] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [sentimentData, setSentimentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");

  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [translatedNegativeText, setTranslatedNegativeText] = useState("");

  const [filtrationScores, setFiltrationScores] = useState([]);

  const baseURL = "http://127.0.0.1:80";
  // Placeholder for the image source
  // Update this path to your image's location
  const generateImage = async (text, negativeText) => {
    // Update the API call logic as necessary, using `text` and `negativeText`
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseURL}/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `${text}`,
          negative_prompt: `${negativeText}`,
        }), // Concatenate image type with text
      });

      if (!response.ok) {
        throw new Error("Response not OK");
      }

      const data = await response.json();
      setImageUrl(`data:image/png;base64,${data.image}`);
    } catch (error) {
      console.error(error);
      setError("Error generating image");
    } finally {
      setIsLoading(false);
    }
  };

  const generateImages = async (text, negativeText) => {
    setIsLoading(true);
    setError(null);
    let newImageUrls = [];
    let num_inference_steps;

    switch (imageQuality) {
      case "HD":
        num_inference_steps = 4;
        break;
      case "Genius (Ultra-HD)":
        num_inference_steps = 8;
        break;
      case "Standard":
      default:
        num_inference_steps = 2;
    }

    // Concatenate the selected options with the original text prompt
    const selections = [
      selectedArtStyle,
      selectedThemeGenre,
      selectedLocation,
      selectedWeather,
      selectedTechnique,
    ]
      .filter(Boolean)
      .join(", "); // Filters out any empty selections and joins the rest with a comma

    // Create the full prompt, only adding a comma if selections are not empty
    const fullPrompt = selections.length > 0 ? `${text}, ${selections}` : text;
    try {
      // Use selectedImageCount to determine the number of API calls
      for (let i = 0; i < selectedImageCount; i++) {
        // Loop to call the API four times
        const response = await fetch(`${baseURL}/text2image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: fullPrompt,
            format: "png",
            cfg_scale: 7,
            style_preset: "cinematic",
            steps: 30,
            num_inference_steps: num_inference_steps,
          }),
        });

        if (!response.ok) {
          throw new Error("Response not OK");
        }

        const data = await response.json();
        newImageUrls.push(`data:image/png;base64,${data.image}`);
      }

      setImageUrls(newImageUrls); // Set the array of image URLs
    } catch (error) {
      console.error(error);
      setError("Error generating images");
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder function for generating semantic analysis data
  const fetchSentimentData = async (text) => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching sentiment data...");
    try {
      const response = await fetch(`${baseURL}/sentiment-scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: `${text}` }),
      });
      console.log("Response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);

      if (
        data &&
        data.sentiment_scores &&
        Array.isArray(data.sentiment_scores[0])
      ) {
        // Update sentimentData state with the array of sentiment score objects
        setSentimentData(data.sentiment_scores[0]);
        console.log("Sentiment data set:", data.sentiment_scores[0]);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching sentiment scores: ", error);
      setError("Error fetching sentiment scores: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to call translation API
  const translateText = async (text, negativeText) => {
    setIsLoading(true);
    setIsTranslating(true);

    try {
      const response = await fetch(`${baseURL}/translation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: `${text}` }),
      });

      if (!response.ok) {
        throw new Error("Translation API response not OK");
      }

      const data = await response.json();
      setTranslatedText(data.translated_text);

      const sec_response = await fetch(`${baseURL}/translation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: `${negativeText}` }),
      });

      if (!sec_response.ok) {
        throw new Error("Translation API response not OK");
      }

      const sec_data = await sec_response.json();

      setTranslatedNegativeText(sec_data.translated_text); // Set the translated negative text if applicable
    } catch (error) {
      console.error("Error during translation:", error);
    } finally {
      setIsTranslating(false);
      setIsLoading(false);
    }
  };

  const fetchFiltrationScores = async (text) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}/filtration-scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: `${text}` }),
      });
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);
      if (data && data.filtration_scores) {
        setFiltrationScores(data.filtration_scores[0]);
        console.log("Filtration data set:", data.filtration_scores[0]);
      } else {
        setFiltrationScores([]); // Make sure to initialize as an empty array if no scores
      }
    } catch (error) {
      console.error("Error fetching filtration scores:", error);
      setError("Error fetching filtration scores: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // // Function to handle feature selection from the sidebar
  // const handleFeatureSelection = (feature) => {
  //   setSelectedFeature(feature);
  // };

  useEffect(() => {
    // Only fetch sentiment data if the text contains at least one alphabet character
    if (selectedFeature === "semanticAnalysis" && /[a-zA-Z]+/.test(text)) {
      fetchSentimentData();
    }
    if (selectedFeature === "contentAnalysis" && /[a-zA-Z]+/.test(text)) {
      fetchFiltrationScores();
    }
  }, [selectedFeature, text]); // Ensure effect triggers on changes to these values

  // // Function to handle generating content based on the selected feature
  // const generateContent = async (text, negativeText) => {
  //   if (selectedFeature === 'imageGenerator') {
  //     generateImage(text, negativeText);
  //   } else if (selectedFeature === 'semanticAnalysis') {
  //     fetchSemanticData(text);
  //   }
  // };

  return (
    <main className="content">
      <FilterPanel
        selectedImageCount={selectedImageCount}
        setSelectedImageCount={setSelectedImageCount}
        imageQuality={imageQuality}
        setImageQuality={setImageQuality}
        selectedArtStyle={selectedArtStyle}
        setSelectedArtStyle={setSelectedArtStyle}
        selectedThemeGenre={selectedThemeGenre}
        setSelectedThemeGenre={setSelectedThemeGenre}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedWeather={selectedWeather}
        setSelectedWeather={setSelectedWeather}
        selectedTechnique={selectedTechnique}
        setSelectedTechnique={setSelectedTechnique}
      />

      <div className="image-gallery">
        <Prompt
          selectedFeature={selectedFeature}
          onGenerate={
            selectedFeature === "imageGenerator"
              ? generateImages
              : selectedFeature === "semanticAnalysis"
                ? fetchSentimentData
                : selectedFeature === "contentAnalysis"
                  ? fetchFiltrationScores
                  : translateText // No onGenerate function for translation
          }
          isLoading={isLoading} // Pass isLoading as a prop
        />

        {selectedFeature === "imageGenerator" && imageUrls.length > 0 && (
          <Carousel images={imageUrls} />
        )}

        {selectedFeature === "semanticAnalysis" && sentimentData && (
          <SemanticAnalysisGraph sentimentData={sentimentData} />
        )}

        {selectedFeature === "translation" && !isTranslating && (
          <div className="translation-container">
            <div className="translation-prompt">
              <h3 className="filter-subtitle">Translated Text:</h3>
              <div className="prompt-output" contentEditable="false">
                {translatedText}
              </div>
            </div>
            {/* {negativePrompt && (
      <div className="translation-prompt">
        <h3 className="filter-subtitle">Negative Prompt:</h3>
        <div className="prompt-output" contentEditable="false">{negativePrompt}</div>
      </div>
    )} */}
            {translatedNegativeText && (
              <div className="translation-prompt">
                <h3 className="filter-subtitle">Translated Negative Prompt:</h3>
                <div className="prompt-output" contentEditable="false">
                  {translatedNegativeText}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedFeature === "contentAnalysis" &&
          filtrationScores?.length > 0 && (
            <FiltrationScoresGraph filtrationScores={filtrationScores} />
          )}

        {/* Loading and error display */}
        {isLoading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </main>
  );
};

export default Content;
