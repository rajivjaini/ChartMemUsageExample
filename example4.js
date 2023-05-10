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

    const labels = memoryData.map(data => data.time);
    const rssData = memoryData.map(data => data.memoryUsage.rss);
    const heapUsedData = memoryData.map(data => data.memoryUsage.heapUsed);
    const heapTotalData = memoryData.map(data => data.memoryUsage.heapTotal);

    if (chart && labels.length) {
      new Chart(chart, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'RSS Memory Usage',
              data: rssData,
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1,
            },
            {
              label: 'Heap Used Memory Usage',
              data: heapUsedData,
              fill: false,
              borderColor: 'rgba(192, 75, 192, 1)',
              tension: 0.1,
            },
            {
              label: 'Heap Total Memory Usage',
              data: heapTotalData,
              fill: false,
              borderColor: 'rgba(192, 192, 75, 1)',
              tension: 0.1,
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
    }
  }, [memoryData]);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default MemoryGraph;
