import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

const FiltrationScoresGraph = ({ filtrationScores }) => {
  // Function to format the tooltip label
  const renderCustomBarLabel = ({ x, y, width, height, value }) => {
    return (
      <text x={x + width / 2} y={y} fill="white" textAnchor="middle" dominantBaseline="bottom">
        {value.toFixed(3)}
      </text>
    );
  };

  return (
    <BarChart
      width={1000}
      height={700}
      data={filtrationScores}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="white"/>
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="score" label={renderCustomBarLabel}>
        {filtrationScores.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.label.toLowerCase() === 'ok' ? 'lightcoral' : 'lightseagreen'} />
        ))}
      </Bar>
    </BarChart>
  );
};

export default FiltrationScoresGraph;
