const BASE_URL = "https://api.coingecko.com/api/v3";

export async function getCryptoPrices() {
  try {
    const response = await fetch(
      `${BASE_URL}/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd`
    );

    const data = await response.json();

    return {
      bitcoin: data.bitcoin.usd,
      ethereum: data.ethereum.usd,
      solana: data.solana.usd,
    };
  } catch (error) {
    console.error("Error fetching prices:", error);

    return {
      bitcoin: 0,
      ethereum: 0,
      solana: 0,
    };
  }
}