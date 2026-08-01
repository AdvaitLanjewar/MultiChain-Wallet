const BASE_URL = "https://api.coingecko.com/api/v3";

// Original function kept 100% backward compatible for Portfolio.jsx and other pages
export async function getCryptoPrices() {
  try {
    const response = await fetch(
      `${BASE_URL}/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd`
    );
    const data = await response.json();

    return {
      bitcoin: data.bitcoin?.usd || 0,
      ethereum: data.ethereum?.usd || 0,
      solana: data.solana?.usd || 0,
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

// Detailed prices with 24H percentage change for the redesigned Dashboard
export async function getCryptoPricesWithDetails() {
  try {
    const response = await fetch(
      `${BASE_URL}/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true`
    );
    const data = await response.json();

    return {
      bitcoin: {
        price: data.bitcoin?.usd || 65420.5,
        change24h: data.bitcoin?.usd_24h_change || 2.45,
      },
      ethereum: {
        price: data.ethereum?.usd || 3480.25,
        change24h: data.ethereum?.usd_24h_change || -1.15,
      },
      solana: {
        price: data.solana?.usd || 148.8,
        change24h: data.solana?.usd_24h_change || 5.32,
      },
    };
  } catch (error) {
    console.error("Error fetching detailed prices:", error);

    // Realistic fallback data if CoinGecko API is rate-limited or offline
    return {
      bitcoin: { price: 65420.5, change24h: 2.45 },
      ethereum: { price: 3480.25, change24h: -1.15 },
      solana: { price: 148.8, change24h: 5.32 },
    };
  }
}