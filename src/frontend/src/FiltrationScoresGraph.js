import { Card, Container } from "@mui/material";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const FiltrationScoresGraph = ({ filtrationScores }) => {
  const renderCustomBarLabel = ({ x, y, width, height, value }) => {
    return (
      <text
        x={x + width / 2}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="bottom"
      >
        {value.toFixed(3)}
      </text>
    );
  };

  return (
    <Container
      style={{ position: "relative" }}
      sx={{ marginTop: -7, marginBottom: 5, maxWidth: "95% !important" }}
    >
      <Card sx={{ p: 2, bgcolor: "#57637526", border: "1px solid #30374180" }}>
        <BarChart
          width={1080}
          height={450}
          data={filtrationScores}
          margin={{
            top: 15,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="white" />
          <XAxis tick={{ fill: "white" }} dataKey="label" />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip />
          <Legend />
          <Bar fill="white" dataKey="score" label={renderCustomBarLabel}>
            {filtrationScores.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.label.toLowerCase() === "ok"
                    ? "lightcoral"
                    : "lightseagreen"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </Card>
    </Container>
  );
};

export default FiltrationScoresGraph;
