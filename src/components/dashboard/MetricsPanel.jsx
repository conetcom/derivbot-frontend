export default function MetricsPanel({

  balance,

  sessionProfit,

  metrics,

  botActive,

  price

}) {

  return (

    <div>

      <h2>
        💰 Balance: $
        {balance}
      </h2>
<h2>
  📈 Profit: ${metrics.pnl?.toFixed(2)}
</h2>
      

      <h3>
        🤖
        {
          botActive
            ? " ACTIVO"
            : " OFF"
        }
      </h3>

      <h3>
        📊 Precio:
        {price}
      </h3>

      <hr />

      <p>
        Trades:
        {metrics.trades}
      </p>

      <p>
        Wins:
        {metrics.wins}
      </p>

      <p>
        Losses:
        {metrics.losses}
      </p>

      <p>
        Winrate:
        {metrics.winrate}%
      </p>

    </div>
  );
}