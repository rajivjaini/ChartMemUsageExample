import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js';

const MemoryUsageChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'RSS memory usage',
      data: [],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  });
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'line',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            }
          }]
        }
      },
      data: chartData
    });

    const intervalId = setInterval(() => {
      const memoryUsage = process.memoryUsage().rss;
      const timestamp = new Date().toLocaleTimeString();

      setChartData(currentData => {
        const newLabels = [...currentData.labels, timestamp];
        const newDatasets = [{
          ...currentData.datasets[0],
          data: [...currentData.datasets[0].data, memoryUsage]
        }];

        if (newLabels.length > 10) {
          newLabels.shift();
          newDatasets[0].data.shift();
        }

        return { labels: newLabels, datasets: newDatasets };
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
};

export default MemoryUsageChart;
