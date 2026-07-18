const axios = require("axios");

async function getBitcoinBalance(address) {
  try {
    const url = `https://blockstream.info/api/address/${address}`;

    const { data } = await axios.get(url);

    const funded = data.chain_stats.funded_txo_sum;
    const spent = data.chain_stats.spent_txo_sum;

    const balanceSats = funded - spent;
    const balanceBTC = balanceSats / 100000000;

    return balanceBTC.toString();
  } catch (error) {
    throw new Error("Unable to fetch Bitcoin balance");
  }
}

module.exports = {
  getBitcoinBalance,
};