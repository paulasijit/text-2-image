import React, { useState, useEffect } from "react";
import Prompt from "./Prompt";
import SemanticAnalysisGraph from "./SemanticAnalysisGraph";
import "./Content.css";
import { useSnackbar } from "notistack";
import { updateToken } from "./redux/action";
import { useDispatch } from "react-redux";

const SentimentData = ({ user }) => {
  const [sentimentData, setSentimentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const baseURL = "http://127.0.0.1:80";

  const fetchSentimentData = async (text) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseURL}/sentiment-scores`, {
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
      console.log("Received data:", data);
      enqueueSnackbar("Emotional tone assessment done.", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });

      if (data.access_token) {
        dispatch(updateToken(data.access_token));
      }

      if (
        data &&
        data.sentiment_scores &&
        Array.isArray(data.sentiment_scores[0])
      ) {
        setSentimentData(data.sentiment_scores[0]);
        console.log("Sentiment data set:", data.sentiment_scores[0]);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      setError("Error fetching sentiment scores: " + error.message);
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
      fetchSentimentData();
    }
  }, [text]);

  return (
    <main className="content">
      <div className="image-gallery">
        <Prompt onGenerate={fetchSentimentData} isLoading={isLoading} />
        {sentimentData && (
          <SemanticAnalysisGraph sentimentData={sentimentData} />
        )}
      </div>
    </main>
  );
};

export default SentimentData;
