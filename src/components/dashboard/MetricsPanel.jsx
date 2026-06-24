export default function MetricsPanel({
  balance = 0,
  sessionProfit = 0,
  metrics = {
    trades: 0,
    wins: 0,
    losses: 0,
    pnl: 0,
    winrate: 0
  },
  botActive = false,
  price = 0
}) {

  const profit =
    Number(metrics?.pnl || 0);

  const winrate =
    Number(metrics?.winrate || 0);

  return (

    <div className="card shadow-sm h-100">

      <div className="card-header bg-primary text-white">
        📊 Métricas del Bot
      </div>

      <div className="card-body">

        <div className="mb-3">

          <h4 className="mb-2">
            💰 Balance
          </h4>

          <h2 className="fw-bold">
            ${Number(balance).toFixed(2)}
          </h2>

        </div>

        <div className="mb-3">

          <h4 className="mb-2">
            📈 Profit
          </h4>

          <h3
            className={
              profit >= 0
                ? "text-success"
                : "text-danger"
            }
          >
            ${profit.toFixed(2)}
          </h3>

        </div>

        <div className="mb-3">

          <h5>
            Estado
          </h5>

          <span
            className={`badge ${
              botActive
                ? "bg-success"
                : "bg-secondary"
            }`}
          >
            {botActive
              ? "🟢 Ejecutándose"
              : "⚪ Detenido"}
          </span>

        </div>

        <div className="mb-4">

          <h5>
            📊 Precio Actual
          </h5>

          <h4 className="fw-bold">
            {price}
          </h4>

        </div>

        <hr />

        <div className="d-flex justify-content-between mb-2">
          <span>Operaciones</span>
          <strong>{metrics?.trades}</strong>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>Ganadas</span>
          <strong className="text-success">
            {metrics?.wins}
          </strong>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>Perdidas</span>
          <strong className="text-danger">
            {metrics?.losses}
          </strong>
        </div>

        <div className="d-flex justify-content-between">
          <span>Winrate</span>

          <strong
            className={
              winrate >= 60
                ? "text-success"
                : "text-warning"
            }
          >
            {winrate.toFixed(2)}%
          </strong>
        </div>

      </div>

    </div>

  );
}