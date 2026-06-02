import { Line } from "react-chartjs-2";

export default function RsiChart({
  rsiData
}) {

  const options = {

    responsive: true,

    animation: false,

    scales: {
      y: {
        min: 0,
        max: 100
      },
      x: {
        display: false
      }
    }
  };

  return (
    <div>

      <h3>📉 RSI</h3>

      <Line
        data={rsiData}
        options={options}
      />

    </div>
  );
}