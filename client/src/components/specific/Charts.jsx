import {
  ArcElement,
  CategoryScale,
  Chart as ChartJs,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  plugins,
  PointElement,
  scales,
  Tooltip,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { purpleLite, purple, orange, orangeLite } from "../../constants/color";
import { getlastSevenDays } from "../../lib/features";

ChartJs.register(
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const labels = getlastSevenDays();

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Revenue",
        fill: true,
        backgroundColor: purpleLite,
        borderColor: purple,
      },
    ],
  };
  return <Line data={data} options={lineChartOptions} />;
};

const donutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  cutout: 100,
};
const DoughnutChart = ({ value = [], labels }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Total Chats Vs Group Chats",
        fill: true,
        backgroundColor: [purpleLite, orangeLite],
        hoverBackgroundColor: [purple, orange],
        borderColor: [purple, orange],
        offset: 40,
      },
    ],
  };

  return (
    <Doughnut
      style={{
        zIndex: 10,
      }}
      data={data}
      options={donutChartOptions}
    />
  );
};

export { DoughnutChart, LineChart };
