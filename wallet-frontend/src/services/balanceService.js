import api from "./api";

export const getBalances = async (wallet) => {
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

    return {
      ethereum: ethereum.data.balance,
      bitcoin: bitcoin.data.balance,
      solana: solana.data.balance,
    };
  } catch (error) {
    console.error("Balance Error:", error);

    return {
      ethereum: "0",
      bitcoin: "0",
      solana: "0",
    };
  }
};