// Header.js

import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      {/* Placeholder for search bar or URL input */}
      <input type="text" placeholder="Search or type URL" className="search-bar" />
    </header>
  );
};

export default Header;
