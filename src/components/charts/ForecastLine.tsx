import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ForecastPoint {
  day: string;
  skin: number;
  hair: number;
  overall: number;
}

interface ForecastLineProps {
  data: ForecastPoint[];
}

export default function ForecastLine({ data }: ForecastLineProps) {
  const chartData = {
    labels: data.map(d => d.day),
    datasets: [
      {
        label: 'Overall Skin Index',
        data: data.map(d => d.overall),
        borderColor: 'rgba(139, 92, 246, 1)', // Purple
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        tension: 0.3,
        pointBackgroundColor: '#8b5cf6',
        pointRadius: 4,
      },
      {
        label: 'Skin Health',
        data: data.map(d => d.skin),
        borderColor: 'rgba(16, 185, 129, 1)', // Green
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2.5,
        tension: 0.3,
        pointBackgroundColor: '#10b981',
        pointRadius: 2.5,
      },
      {
        label: 'Hair Health',
        data: data.map(d => d.hair),
        borderColor: 'rgba(6, 182, 212, 1)', // Cyan
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 2.5,
        tension: 0.3,
        pointBackgroundColor: '#06b6d4',
        pointRadius: 2.5,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#64748b',
          font: {
            family: 'Inter',
            size: 9
          }
        },
        suggestedMin: 30,
        suggestedMax: 100
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: 'Inter',
            size: 9,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false // We render our own custom HTML legends under the chart
      },
      tooltip: {
        backgroundColor: 'rgba(13, 16, 28, 0.95)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        titleFont: {
          family: 'Inter',
          weight: 'bold'
        },
        bodyFont: {
          family: 'Inter'
        }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[250px] relative">
      <Line data={chartData} options={options} />
    </div>
  );
}
