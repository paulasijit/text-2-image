import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './SemanticAnalysisGraph.css';

const SemanticAnalysisGraph = ({ sentimentData }) => {
  const chartInstanceRef = useRef(null); // Stores the chart instance

  useEffect(() => {
    // Destroy the chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    if (!sentimentData || !Array.isArray(sentimentData)) {
      console.error('sentimentData is not an array or is null/undefined');
      return;
    }

    const scoreMap = {};
    sentimentData.forEach(item => {
      scoreMap[item.label] = item.score * 100; // Calculate percentage
    });

    const labels = Object.keys(scoreMap);
    const scores = labels.map(label => scoreMap[label]);
    const colors = labels.map(label => {
      return ['caring', 'approval', 'love', 'gratitude', 'realization', 'pride', 'joy', 'optimism', 'excitement', 'relief', 'amusement', 'admiration'].includes(label) ? 'darkorange' : 'cadetblue';
    });

    const ctx = document.getElementById('sentimentChart');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sentiment Scores',
          data: scores,
          backgroundColor: colors,
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0
            }
          },
          y: {
            ticks: {
              fontSize: 8
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              fontSize: 16,
              // Customizing the legend to only show two distinct labels
              generateLabels: function (chart) {
                // This function creates a fixed set of legend items
                return [{
                  text: 'Positive',
                  fillStyle: 'darkorange',
                  strokeStyle: 'darkorange'
                }, {
                  text: 'Negative',
                  fillStyle: 'cadetblue',
                  strokeStyle: 'cadetblue'
                }];
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return `${tooltipItem.label}: ${Math.round(tooltipItem.raw)}%`;
              }
            }
          }
        }
      }
    });

    // Cleanup function to destroy the chart when the component unmounts or data changes
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [sentimentData]); // Dependency array ensures effect runs only when sentimentData changes

  return (
    <div className="sentiment-container">
      <h2 style={{ textAlign: 'center' }}>Emotional Tone Assessment</h2>
      <canvas id="sentimentChart"></canvas>
    </div>
  );
};

export default SemanticAnalysisGraph;