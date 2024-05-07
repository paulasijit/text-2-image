import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./SemanticAnalysisGraph.css";
import { Container } from "@mui/system";
import { Card, Divider, Typography } from "@mui/material";

const SemanticAnalysisGraph = ({ sentimentData }) => {
  const chartInstanceRef = useRef(null);
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    if (!sentimentData || !Array.isArray(sentimentData)) {
      console.error("sentimentData is not an array or is null/undefined");
      return;
    }

    const scoreMap = {};
    sentimentData.forEach((item) => {
      scoreMap[item.label] = item.score * 100;
    });

    const labels = Object.keys(scoreMap);
    const scores = labels.map((label) => scoreMap[label]);
    const colors = labels.map((label) => {
      return [
        "caring",
        "approval",
        "love",
        "gratitude",
        "realization",
        "pride",
        "joy",
        "optimism",
        "excitement",
        "relief",
        "amusement",
        "admiration",
      ].includes(label)
        ? "darkorange"
        : "cadetblue";
    });

    const ctx = document.getElementById("sentimentChart");
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Sentiment Scores",
            data: scores,
            backgroundColor: colors,
          },
        ],
      },
      options: {
        indexAxis: "y",
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              color: "white",
            },
          },
          y: {
            ticks: {
              fontSize: 8,
              color: "white",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              fontSize: 16,
              generateLabels: function (chart) {
                return [
                  {
                    text: "Positive",
                    fillStyle: "darkorange",
                    strokeStyle: "darkorange",
                    fontColor: "white",
                  },
                  {
                    text: "Negative",
                    fillStyle: "cadetblue",
                    strokeStyle: "cadetblue",
                  },
                ];
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.label}: ${Math.round(tooltipItem.raw)}%`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [sentimentData]);
  return (
    <Container
      style={{ position: "relative" }}
      sx={{ marginTop: -5, marginBottom: 2, maxWidth: "95% !important" }}
    >
      <Card sx={{ p: 0, bgcolor: "#57637526", border: "1px solid #30374180" }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontSize: "0.975rem",
            p: 2,
            pb: 1,
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Emotional Tone Assessment
        </Typography>

        <Divider
          sx={{
            background: "#42494d",
            mt: 1,
          }}
        />
        <canvas id="sentimentChart"></canvas>
      </Card>
    </Container>
  );
};

export default SemanticAnalysisGraph;

