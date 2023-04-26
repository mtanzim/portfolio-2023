import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import colors from "../colors.json";
import { useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  topN: number;
  dataSet: Array<{
    months: number;
    data: Array<{ language: string; percentage: number }>;
  }>;
}

export default function Coding({ dataSet, topN }: Props) {
  const [curData, setCurData] = useState(dataSet?.[0]);
  if (!curData) {
    return null;
  }
  const options = dataSet.map((d) => d.months);
  const slicedData = curData?.data?.slice(0, topN);
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
      <h1 className="text-4xl mb-4 mt-4">My top languages used</h1>
      <div className="tabs mb-4 mt-4">
        {options.map((month) => (
          <button
            key={month}
            onClick={() => setCurData(dataSet.find((d) => d.months === month))}
            className={
              month === curData.months
                ? "tab tab-bordered tab-active"
                : "tab tab-bordered"
            }
          >
            {month} Months
          </button>
        ))}
      </div>
      <Pie data={chartData} />
    </div>
  );
}
