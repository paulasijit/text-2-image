import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Home from "./HomePage";
import Content from "./Content";
import LoginForm from "./LoginForm";
import "./App.css";

const App = () => {
  const [currentFeature, setCurrentFeature] = useState("home");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user && currentFeature !== "home") {
      setCurrentFeature("home");
    }
  }, [user, currentFeature]);

  const handleFeatureSelect = (feature) => {
    setCurrentFeature(feature);
  };

  return (
    <div className="app">
      {!user && <LoginForm />}
      {user && (
        <>
          <Sidebar
            onFeatureSelect={handleFeatureSelect}
            currentFeature={currentFeature}
          />
          <div className="main-content">
            {currentFeature === "home" && <Home />}
            {currentFeature === "imageGenerator" && (
              <Content selectedFeature={currentFeature} />
            )}
            {currentFeature === "semanticAnalysis" && (
              <Content selectedFeature={currentFeature} />
            )}
            {currentFeature === "contentAnalysis" && (
              <Content selectedFeature={currentFeature} />
            )}
            {currentFeature === "translation" && (
              <Content selectedFeature={currentFeature} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
