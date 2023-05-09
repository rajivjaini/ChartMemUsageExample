import React from 'react';
import Chart from 'chart.js';

class MemoryUsageChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { memoryUsage: {} };
  }

  componentDidMount() {
    this.fetchMemoryUsage();
    this.intervalId = setInterval(() => this.fetchMemoryUsage(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  async fetchMemoryUsage() {
    const response = await fetch('/memory-usage');
    const data = await response.json();
    this.setState({ memoryUsage: data });
  }

  render() {
    const { memoryUsage } = this.state;

    return <canvas id="memoryUsageChart" />;
  }

  componentDidUpdate() {
    const { memoryUsage } = this.state;
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
  }
}

export default MemoryUsageChart;
