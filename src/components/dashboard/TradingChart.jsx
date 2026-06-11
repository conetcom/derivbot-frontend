import {
  Line
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function TradingChart({
  chartData
}) {
//console.log("CHART DATA:", chartData);
  return (

    <div className="card mt-3">
      <div className="card-body">

        <h5>📈 Precio</h5>

        <Line data={chartData} />

      </div>
    </div>

  );
}