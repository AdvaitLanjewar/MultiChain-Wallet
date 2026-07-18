const {
  JsonRpcProvider,
  Wallet,
  parseEther,
  isAddress,
} = require("ethers");

const provider = new JsonRpcProvider(process.env.ETH_RPC_URL);

/**
 * Send ETH Transaction
 */
async function sendEthereumTransaction(privateKey, to, amount) {
  if (!privateKey) {
    throw new Error("Private key is required");
  }

  if (!isAddress(to)) {
    throw new Error("Invalid receiver address");
  }

  if (Number(amount) <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const wallet = new Wallet(privateKey, provider);

  const tx = await wallet.sendTransaction({
    to,
    value: parseEther(amount.toString()),
  });

  const receipt = await tx.wait();

  return {
    success: true,
    hash: receipt.hash,
    blockNumber: receipt.blockNumber,
    from: receipt.from,
    to: receipt.to,
    amount,
    explorer: `https://etherscan.io/tx/${receipt.hash}`,
  };
}

module.exports = {
  sendEthereumTransaction,
};