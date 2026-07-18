const {
  JsonRpcProvider,
  Wallet,
  parseEther,
  formatEther,
  isAddress,
} = require("ethers");

const provider = new JsonRpcProvider(process.env.ETH_RPC_URL);

async function sendEthereumTransaction(privateKey, to, amount) {
  if (!privateKey) {
    throw new Error("Private key is required");
  }

  if (!isAddress(to)) {
    throw new Error("Invalid receiver address");
  }

  if (Number(amount) <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  const wallet = new Wallet(privateKey, provider);

  // Sender balance
  const balance = await provider.getBalance(wallet.address);

  // Estimate gas
  const gasEstimate = await provider.estimateGas({
    from: wallet.address,
    to,
    value: parseEther(amount.toString()),
  });

  const feeData = await provider.getFeeData();

  const gasPrice = feeData.gasPrice;

  if (!gasPrice) {
    throw new Error("Unable to fetch gas price");
  }

  const gasCost = gasEstimate * gasPrice;
  const totalCost = parseEther(amount.toString()) + gasCost;

  if (balance < totalCost) {
    throw new Error(
      `Insufficient balance.
Wallet: ${formatEther(balance)} ETH
Required: ${formatEther(totalCost)} ETH`
    );
  }

  const tx = await wallet.sendTransaction({
    to,
    value: parseEther(amount.toString()),
    gasLimit: gasEstimate,
  });

  const receipt = await tx.wait();

  return {
    success: true,
    hash: receipt.hash,
    blockNumber: receipt.blockNumber,
    from: receipt.from,
    to: receipt.to,
    amount,
    gasUsed: receipt.gasUsed.toString(),
    explorer: `https://etherscan.io/tx/${receipt.hash}`,
  };
}

module.exports = {
  sendEthereumTransaction,
};