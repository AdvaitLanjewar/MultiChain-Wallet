import api from "./api";

export const getBalances = async (wallet) => {
  let ethBal = 0;
  let btcBal = 0;
  let solBal = 0;

  try {
    const [ethereum, bitcoin, solana] = await Promise.all([
      api.get("/balance", {
        params: {
          chain: "ethereum",
          address: wallet.ethereum.address,
        },
      }),

      api.get("/balance", {
        params: {
          chain: "bitcoin",
          address: wallet.bitcoin.address,
        },
      }),

      api.get("/balance", {
        params: {
          chain: "solana",
          address: wallet.solana.address,
        },
      }),
    ]);

    ethBal = parseFloat(ethereum.data.balance) || 0;
    btcBal = parseFloat(bitcoin.data.balance) || 0;
    solBal = parseFloat(solana.data.balance) || 0;
  } catch (error) {
    console.error("Balance Error fetching on-chain balance:", error);
  }

  // Merge demo purchased asset balances from localStorage
  try {
    const customBals = JSON.parse(localStorage.getItem("nexus_demo_custom_balances") || "{}");
    if (customBals.ethereum) ethBal += parseFloat(customBals.ethereum) || 0;
    if (customBals.bitcoin) btcBal += parseFloat(customBals.bitcoin) || 0;
    if (customBals.solana) solBal += parseFloat(customBals.solana) || 0;
  } catch (e) {
    console.error("Error reading custom balances", e);
  }

  return {
    ethereum: ethBal.toString(),
    bitcoin: btcBal.toString(),
    solana: solBal.toString(),
  };
};