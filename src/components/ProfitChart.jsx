import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

// registrar módulos
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function ProfitChart({ trades }) {

  // 🔥 calcular profit acumulado
  let cumulative = 0;

  const labels = trades.map((t) =>
    new Date(t.created_at).toLocaleTimeString()
  );

  const dataValues = trades.map((t) => {
    cumulative += Number(t.profit);
    return cumulative;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Equity (Ganancia acumulada)",
        data: dataValues,
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📊 Curva de Ganancia</h3>
      <Line data={data} />
    </div>
  );
}