import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface SkinRiskRadarProps {
  acneRisk: number;
  uvDamage: number;
  pigmentation: number;
  dehydration: number;
  agingRisk: number;
  sensitivity: number;
}

export default function SkinRiskRadar({
  acneRisk,
  uvDamage,
  pigmentation,
  dehydration,
  agingRisk,
  sensitivity
}: SkinRiskRadarProps) {
  const data = {
    labels: [
      'Acne Flare',
      'UV Damage',
      'Hyperpigmentation',
      'Dehydration',
      'Premature Aging',
      'Sensitivity'
    ],
    datasets: [
      {
        label: 'Risk Index (%)',
        data: [acneRisk, uvDamage, pigmentation, dehydration, agingRisk, sensitivity],
        backgroundColor: 'rgba(20, 184, 166, 0.2)',
        borderColor: 'rgba(20, 184, 166, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#14b8a6',
      }
    ]
  };

  const options: ChartOptions<'radar'> = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.08)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)'
        },
        pointLabels: {
          color: '#cbd5e1',
          font: {
            family: 'Inter',
            size: 11,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#64748b',
          backdropColor: 'transparent',
          showLabelBackdrop: false,
          font: {
            size: 9
          }
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: {
        display: false
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
    },
    maintainAspectRatio: false
  };

  return (
    <div className="w-full h-full min-h-[250px] relative flex justify-center items-center">
      <Radar data={data} options={options} />
    </div>
  );
}
