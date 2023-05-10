import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js';

const MemoryGraph = () => {
  const chartRef = useRef(null);
  const [memoryData, setMemoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/memory-usage');
        const data = await response.json();
        setMemoryData(prevData => [...prevData, data]);
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const chart = chartRef.current;

    if (chart && memoryData.length) {
      const labels = memoryData.map(data => data.time);
      const rssData = memoryData.map(data => data.memoryUsage.rss);
      const heapUsedData = memoryData.map(data => data.memoryUsage.heapUsed);
      const heapTotalData = memoryData.map(data => data.memoryUsage.heapTotal);

      chart.data.labels = labels;
      chart.data.datasets[0].data = rssData;
      chart.data.datasets[1].data = heapUsedData;
      chart.data.datasets[2].data = heapTotalData;
      chart.update();
    }
  }, [memoryData]);

  useEffect(() => {
    const chartElement = chartRef.current;
    const chart = new Chart(chartElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'RSS Memory',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Heap Used Memory',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Heap Total Memory',
            data: [],
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default MemoryGraph;
