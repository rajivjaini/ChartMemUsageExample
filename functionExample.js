import React, { useState, useEffect } from 'react';
import Chart from 'chart.js';

const MemoryUsageChart = () => {
  const [memoryUsage, setMemoryUsage] = useState({});

  useEffect(() => {
    const fetchMemoryUsage = async () => {
      const response = await fetch('/memory-usage');
      const data = await response.json();
      setMemoryUsage(data);
    };

    const intervalId = setInterval(fetchMemoryUsage, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const ctx = document.getElementById('memoryUsageChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(memoryUsage),
        datasets: [
          {
            label: 'Memory Usage',
            data: Object.values(memoryUsage),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    return () => chart.destroy();
  }, [memoryUsage]);

  return <canvas id="memoryUsageChart" />;
};

export default MemoryUsageChart;
