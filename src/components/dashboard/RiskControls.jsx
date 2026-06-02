export default function RiskControls({

  strategy,
  setStrategy,

  targetProfit,
  setTargetProfit,

  stopLoss,
  setStopLoss,

  maxDrawdown,
  setMaxDrawdown

}) {

  return (

    <div
      style={{
        display: "flex",
        gap: "10px"
      }}
    >

      <label>

        TP

        <input
          type="number"
          value={targetProfit}
          onChange={(e) =>
            setTargetProfit(
              Number(e.target.value)
            )
          }
        />

      </label>

      <label>

        SL

        <input
          type="number"
          value={stopLoss}
          onChange={(e) =>
            setStopLoss(
              Number(e.target.value)
            )
          }
        />

      </label>

      <label>

        DD

        <input
          type="number"
          value={maxDrawdown}
          onChange={(e) =>
            setMaxDrawdown(
              Number(e.target.value)
            )
          }
        />

      </label>

      <label>

        Strategy

        <select
          value={strategy}
          onChange={(e) =>
            setStrategy(
              e.target.value
            )
          }
        >

          <option value="sma">
            SMA
          </option>

          <option value="rsi">
            RSI
          </option>

        </select>

      </label>

    </div>
  );
}