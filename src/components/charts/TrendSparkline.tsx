import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartOptions
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

interface TrendSparklineProps {
  data: any[];
  dataKey: string;
  color: string;
}

export default function TrendSparkline({ data, dataKey, color }: TrendSparklineProps) {
  const chartData = {
    labels: data.map((_, i) => i.toString()),
    datasets: [
      {
        data: data.map(d => d[dataKey]),
        borderColor: color,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        fill: false,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false }
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  return (
    <div className="w-full h-10 relative">
      <Line data={chartData} options={options} />
    </div>
  );
}
