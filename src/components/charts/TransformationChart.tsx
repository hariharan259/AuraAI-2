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
import { TransformationForecast } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TransformationChartProps {
  forecastData: TransformationForecast[];
}

export default function TransformationChart({ forecastData }: TransformationChartProps) {
  const data = {
    labels: ['Day 0 (Baseline)', 'Day 7', 'Day 15', 'Day 30 (Goal)'],
    datasets: [
      {
        label: 'Overall Skin Score',
        data: forecastData.map(d => d.overallScore),
        borderColor: 'rgba(139, 92, 246, 1)', // Purple
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: '#8b5cf6',
        pointRadius: 4,
      },
      {
        label: 'Hydration Improvement (%)',
        data: forecastData.map(d => d.hydrationImprovementPct),
        borderColor: 'rgba(6, 182, 212, 1)', // Cyan
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: '#06b6d4',
        pointRadius: 4,
      },
      {
        label: 'Acne Reduction (%)',
        data: forecastData.map(d => d.acneReductionPct),
        borderColor: 'rgba(16, 185, 129, 1)', // Green
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
      },
      {
        label: 'Pigmentation Fading (%)',
        data: forecastData.map(d => d.pigmentationImprovementPct),
        borderColor: 'rgba(234, 179, 8, 1)', // Gold
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: '#eab308',
        pointRadius: 4,
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
            size: 10
          }
        },
        suggestedMin: 0,
        suggestedMax: 100
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#cbd5e1',
          font: {
            family: 'Inter',
            size: 10,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9ca3af',
          font: {
            family: 'Inter',
            size: 10
          },
          boxWidth: 12,
          padding: 15
        }
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
    <div className="w-full h-full min-h-[300px] relative">
      <Line data={data} options={options} />
    </div>
  );
}
