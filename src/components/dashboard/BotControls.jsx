export default function BotControls({
  botRunning,
  handleStartBot,
  handleStopBot,
  manualTrade
}) {

  return (

    <div>

      <button
        onClick={
          botRunning
            ? handleStopBot
            : handleStartBot
        }
        style={{
          backgroundColor:
            botRunning
              ? "#dc3545"
              : "#28a745",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {
          botRunning
            ? "⛔ Stop Bot"
            : "▶️ Start Bot"
        }
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