import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type ChartType = 'line' | 'bar' | 'pie' | 'doughnut';

interface SmartChartProps {
  type?: ChartType;
  jsonData: Record<string, any>[];
  title?: string;
  height?: number;
  width?: number | string;
  showLegendTitle?: boolean;
  showLegend?: boolean;
  tooltipDescription?: (label: string, value: number) => string;
  colorMap?: Record<string, string>; // optional color per key
}

const SmartChart: React.FC<SmartChartProps> = ({
  type = 'bar',
  jsonData,
  title = 'Smart Chart',
  height = 300,
  width = 'auto',
  showLegendTitle = true,
  showLegend = true,
  tooltipDescription,
  colorMap = {},
}) => {
  const labels = jsonData?.map(item => item.month) ?? [];

  const numericKeys =
    jsonData && jsonData.length > 0 && jsonData[0]
      ? Object.keys(jsonData[0]).filter(
        key => key !== 'month' && typeof jsonData[0][key] === 'number'
      )
      : [];

  const datasets = numericKeys.map(key => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    data: jsonData.map(item => item[key]),
    backgroundColor: colorMap[key] || '#0d6efd',
    borderColor: colorMap[key] || '#0d6efd',
    borderWidth: 2,
  }));

  const chartJsData = { labels, datasets };

  const chartJsOptions = {
    responsive: true,
    maintainAspectRatio: !width,
    plugins: {
      legend: { display: showLegend },
      title: {
        display: showLegendTitle,
        text: title,
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0]?.dataIndex;
            return labels?.[index] ?? '';
          },
          label: (context: any) => {
            const index = context.dataIndex;
            const value = context.raw;
            return tooltipDescription
              ? tooltipDescription(labels?.[index] ?? '', value)
              : `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
  };

  const chartJsProps = { data: chartJsData, options: chartJsOptions, height, width };

  switch (type) {
    case 'bar':
      return <Bar {...chartJsProps} />;
    case 'pie':
      return <Pie {...chartJsProps} />;
    case 'doughnut':
      return <Doughnut {...chartJsProps} />;
    default:
      return <Line {...chartJsProps} />;
  }
};

export default SmartChart;
