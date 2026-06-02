export default function TradeTable({

  trades,

  getTimeLeft,

  getProgress,

  formatTime

}) {

  return (

    <table
      border="1"
      cellPadding="10"
    >

      <thead>

        <tr>

          <th>ID</th>

          <th>Tipo</th>

          <th>Entry</th>

          <th>Status</th>

          <th>Profit</th>

          <th>Tiempo</th>

          <th>Progreso</th>

        </tr>

      </thead>

      <tbody>

        {trades.map((t) => {
  console.log("TRADE:", t)
         const timeLeft =
  getTimeLeft(
    t.date_expiry
  );

const progress =
  getProgress(
    t.date_start,
    t.date_expiry
  );

          return (

            <tr key={t.id}>

              <td>{t.id}</td>

              <td>
                {t.type || t.contract_type}
              </td>

              <td>
                {t.entry_price}
              </td>

              <td>
                {t.status}
              </td>

              <td>
                {t.profit}
              </td>

              <td>
                {
                  formatTime(
                    timeLeft
                  )
                }
              </td>

              <td>

                <div
                  style={{
                    width: "100px",
                    background:
                      "#eee"
                  }}
                >

                  <div
                    style={{
                      width:
                        `${progress}%`,
                      height: "10px",
                      background:
                        "green"
                    }}
                  />

                </div>

              </td>

            </tr>

          );
        })}

      </tbody>

    </table>
  );
}