// Content.js
import React, { useState, useEffect } from "react";
import Prompt from "./Prompt";
import FiltrationScoresGraph from "./FiltrationScoresGraph";
// import "./Content.css";
import { useSnackbar } from "notistack";
import { updateToken } from "./redux/action";
import { useDispatch } from "react-redux";

const ContentAnalysis = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");

  const [filtrationScores, setFiltrationScores] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const baseURL = "http://127.0.0.1:80";

  const fetchFiltrationScores = async (text) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}/filtration-scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ text: `${text}` }),
      });
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      enqueueSnackbar("Filtration scores fetched successfully.", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });

      if (data.access_token) {
        dispatch(updateToken(data.access_token));
      }
      if (data && data.filtration_scores) {
        setFiltrationScores(data.filtration_scores[0]);
      } else {
        setFiltrationScores([]);
      }
    } catch (error) {
      setError("Error fetching filtration scores: " + error.message);
      enqueueSnackbar(`Error fetching sentiment scores: ${error.message}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (/[a-zA-Z]+/.test(text)) {
      fetchFiltrationScores();
    }
  }, [text]);

  return (
    <main className="content">
      <div className="image-gallery">
        <Prompt onGenerate={fetchFiltrationScores} isLoading={isLoading} />
        {filtrationScores?.length > 0 && (
          <FiltrationScoresGraph filtrationScores={filtrationScores} />
        )}
      </div>
    </main>
  );
};

export default ContentAnalysis;
