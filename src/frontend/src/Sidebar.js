import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faLanguage, 
  faBrain, 
  faProjectDiagram, 
  faShapes, 
  faImage, 
  faUser, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

import logoImage from './Logo.png';

const Sidebar = ({onFeatureSelect, currentFeature}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logoImage} alt="Logo" />
      </div>
      <div className={`sidebar-item ${currentFeature === 'home' ? 'active' : ''}`} onClick={() => onFeatureSelect('home')}>
        <FontAwesomeIcon icon={faHome} /> <span>Home</span>
      </div>
      <div className={`sidebar-item ${currentFeature === 'translation' ? 'active' : ''}`} onClick={() => onFeatureSelect('translation')}>
    <FontAwesomeIcon icon={faLanguage} /> <span>Translation</span>
  </div>
      <div className={`sidebar-item ${currentFeature === 'contentAnalysis' ? 'active' : ''}`} onClick={() => onFeatureSelect('contentAnalysis')}>
        <FontAwesomeIcon icon={faBrain} /> <span>Content Analysis</span>
      </div>
      {/* <div className="sidebar-item">
        <FontAwesomeIcon icon={faProjectDiagram} /> <span>Syntax Analysis</span>
      </div> */}
      <div className={`sidebar-item ${currentFeature === 'semanticAnalysis' ? 'active' : ''}`} onClick={() => onFeatureSelect('semanticAnalysis')}>
        <FontAwesomeIcon icon={faShapes} /> <span>Semantic Analysis</span>
      </div>
      <div className={`sidebar-item ${currentFeature === 'imageGenerator' ? 'active' : ''}`} onClick={() => onFeatureSelect('imageGenerator')}>
        <FontAwesomeIcon icon={faImage} /> <span>Image Generator</span>
      </div>
      <div className="sidebar-item">
        <FontAwesomeIcon icon={faUser} /> <span>Profile</span>
      </div>
      <div className="sidebar-item">
        <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
