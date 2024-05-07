import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SidebarDrawer from "./SidebarLayout";
import Home from "./HomePage";
import ContentAnalysis from "./ContentAnalysis";
import LoginForm from "./LoginRegisterForm";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import "./App.css";
import Translate from "./Translate";
import ImageGenerator from "./ImageGenerator";
import SentimentData from "./SentimentData";

const App = () => {
  const user = useSelector((state) => state.user);
  return (
    <Router>
      <div className="app">
        {!user && <Navigate to="/auth" />}
        {user ? (
          <>
            <SidebarDrawer />
            <div className="main-content">
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/semantic-analysis" element={<SentimentData user={user} />} />
                <Route exact path="/translation" element={<Translate user={user} />} />
                <Route exact path="/image-generator" element={<ImageGenerator user={user} />} />
                <Route exact path="/content-analysis" element={<ContentAnalysis user={user} />} />
                <Route exact path="/auth" element={<LoginForm />} />
                {/* <Route path="*" element={<NotFound/>}/> */}
              </Routes>
            </div>
          </>) : (
          <Routes>
            <Route exact path="/auth" element={<LoginForm />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
