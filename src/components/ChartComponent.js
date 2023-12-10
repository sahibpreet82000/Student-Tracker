// ChartComponent.js
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import moment from "moment";

const ChartComponent = ({ data, labelColumn }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    const existingChart = chartRef.current.chart;
    if (existingChart) {
      existingChart.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d");

    new Chart(ctx, {
      type: "bar", // You can choose the chart type based on your requirement
      data: {
        labels: data.map((student) => student[labelColumn]),
        datasets: [
          {
            label: "Scores",
            data: data.map((student) => student.Total),
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Customize the chart colors
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
    });
  }, [data, labelColumn]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;
