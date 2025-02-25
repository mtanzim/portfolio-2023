import {
  ArcElement,
  type ChartData,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type Language = {
  color: string;
  url: string;
};

export type LanguagesColors = {
  [key: string]: Language;
};

interface Props {
  topN: number;
  colors: LanguagesColors;
  dataSet: Array<{
    months: number;
    data: Array<{ language: string; percentage: number }>;
  }>;
}

export default function Coding({ dataSet, topN, colors }: Props) {
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
    <div className="mb-4">
      <div className="tabs tabs-bordered justify-center mb-12 mt-4">
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
