import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import './HomePage.css';

const IMAGES_PER_PAGE = 36;

const Home = () => {
    const imageCount = 76;
    const imagePath = process.env.PUBLIC_URL + '/gallery/';
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(imageCount / IMAGES_PER_PAGE);

    // Helper function to change image source if error occurs (e.g., if PNG is not found)
    const handleImageError = (e, imageIndex) => {
        e.target.src = `${imagePath}${imageIndex + 1}.jpg`; // Try loading JPG if PNG fails
    };

    // Helper function to calculate image index range for current page
    const getImageRangeForCurrentPage = () => {
        const start = (currentPage - 1) * IMAGES_PER_PAGE;
        const end = start + IMAGES_PER_PAGE;
        return { start, end };
    };

    const { start, end } = getImageRangeForCurrentPage();

    // Create an array of image paths for the current page
    const images = Array.from({ length: imageCount }, (_, index) => {
        if (index >= start && index < end) {
            return {
                png: `${imagePath}${index + 1}.png`,
                jpg: `${imagePath}${index + 1}.jpg`,
                index: index
            };
        }
        return null;
    }).filter(Boolean); // Remove null values (images outside the current page range)

    // Pagination controls
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

  return (
    <div className="home">
      <section className="intro">
        <h1>Welcome to text2Scene - Your Ideas, Our Images! Transform your text descriptions into vivid scenes with ease.</h1>
        <p>text2Scene allows users to generate detailed visual scenes based on textual descriptions, making it a powerful tool for designers, artists, and educators to bring ideas to life quickly and accurately.</p>
      </section>
      
      <div className="steps-container">
      <section className="features">
  <h2>User-Friendly Features</h2>
  <ul>
    <li>Intuitive Design: Navigate through the application effortlessly.</li>
    <li>High Flexibility: Customize outputs to suit your unique creative needs.</li>
    <li>Multilingual Support: Engage with the tool in your native language.</li>
    <li>Content Filtering: Create and explore with confidence in a protected space.</li>
    <li>Semantic Understanding: Benefit from nuanced interpretation for precise visuals.</li>
    <li>Customizable Filtering: Tailor the scene generation to your creative vision.</li>
  </ul>
</section>


        <section className="guide">
          <h2>Getting Started</h2>
          <div className="step">
            <h3>Step 1: </h3>
            <p>Type your scene's description as a prompt.</p>
          </div>
          <div className="step">
            <h3>Step 2: </h3>
            <p>Use Content Analysis to filter inappropriate content.</p>
          </div>
          <div className="step">
            <h3>Step 3: </h3>
            <p>Translate your prompt to multiple languages if needed.</p>
          </div>
          <div className="step">
            <h3>Step 4: </h3>
            <p>Perform Semantic Analysis to understand the context of your sentence.</p>
          </div>
          <div className="step">
            <h3>Step 5: </h3>
            <p>Choose from various filter options to refine your scene.</p>
          </div>
          <div className="step">
            <h3>Step 6: </h3>
            <p>Select the type of scene you want to generate.</p>
          </div>
          <div className="step">
            <h3>Step 7: </h3>
            <p>Press 'Generate' and watch your text come to life!</p>
          </div>
        </section>
      </div>

       {/* Gallery section */}
            <div className="gallery">
                {images.map((image) => (
                    <img
                        key={image.index}
                        src={image.png}
                        alt={`Gallery ${image.index + 1}`}
                        onError={(e) => handleImageError(e, image.index)}
                    />
                ))}
            </div>

            {/* Pagination controls */}
            <div className="pagination-controls">
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                <FontAwesomeIcon icon={faAngleDoubleLeft} /> Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next <FontAwesomeIcon icon={faAngleDoubleRight} /> 
                </button>
            </div>
        </div>
    );
};

export default Home;