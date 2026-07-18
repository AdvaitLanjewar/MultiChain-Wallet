const { JsonRpcProvider, formatEther } = require("ethers");
const {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

const ethProvider = new JsonRpcProvider(process.env.ETH_RPC_URL);

const solConnection = new Connection(
  process.env.SOL_RPC_URL,
  "confirmed"
);

async function getEthereumBalance(address) {
  const balance = await ethProvider.getBalance(address);

  return formatEther(balance);
}

async function getSolanaBalance(address) {
  const balance = await solConnection.getBalance(
    new PublicKey(address)
  );

  return (balance / LAMPORTS_PER_SOL).toString();
}

module.exports = {
  getEthereumBalance,
  getSolanaBalance,
};