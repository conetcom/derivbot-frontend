export default function AccountSelector({
  accounts = [],
  selectedAccount,
  setSelectedAccount,
  setBalance
}) {
  return (
    <div>
      <h3>💳 Cuenta Deriv</h3>

      <select
        value={selectedAccount?.id || ""}
        onChange={(e) => {

          const account = accounts.find(
            (a) =>
              Number(a.id) === Number(e.target.value)
          );

          console.log(
            "account:",
            account
          );

          console.log(
            "setSelectedAccount:",
            typeof setSelectedAccount
          );

          console.log(
            "setBalance:",
            typeof setBalance
          );

          if (
            typeof setSelectedAccount ===
            "function"
          ) {
            setSelectedAccount(account);
          }

          if (
            typeof setBalance ===
            "function"
          ) {
            setBalance(
              account?.balance || 0
            );
          }
        }}
      >
        {accounts?.map((acc) => (
          <option
            key={acc.id}
            value={acc.id}
          >
            {acc.account_name}
          </option>
        ))}
      </select>
    </div>
  );
}