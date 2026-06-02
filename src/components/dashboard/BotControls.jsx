export default function BotControls({

  startBot,

  stopBot,

  manualTrade

}) {

  return (

    <div>

      <button
        onClick={startBot}
      >
        ▶️ Start
      </button>

      <button
        onClick={stopBot}
      >
        ⛔ Stop
      </button>

      <button
        onClick={() =>
          manualTrade("CALL")
        }
      >
        📈 CALL
      </button>

      <button
        onClick={() =>
          manualTrade("PUT")
        }
      >
        📉 PUT
      </button>

    </div>
  );
}