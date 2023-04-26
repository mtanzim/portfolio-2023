import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import colors from "../colors.json";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  months: number;
  topN: number;
  data: Array<{ language: string; percentage: number }>;
}

export default function Coding({ months, data, topN }: Props) {
  const slicedData = data.slice(0, topN);
  const chartData: ChartData<"pie", number[], string> = {
    labels: slicedData.map((d) => d.language),
    datasets: [
      {
        label: "",
        data: slicedData.map((d) => d.percentage),
        backgroundColor: slicedData.map((d) => colors?.[d?.language]?.color),
      },
    ],
  };
  return (
    <div>
      <h1 className="text-4xl mb-4 mt-4">
        Top languages used in the last {months} months
      </h1>
      <Pie data={chartData} />
    </div>
  );
}
