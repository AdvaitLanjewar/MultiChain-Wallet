const { ethers } = require("ethers");

async function sendTransactionWithProvider(privateKey, to, amount) {
  // Create provider using GetBlock
 const provider = new ethers.JsonRpcProvider(
  process.env.ETH_RPC_URL
);
  
  // Create wallet connected to provider
  const wallet = new ethers.Wallet(privateKey, provider);
  
  try {
    // Send transaction (ethers handles nonce, gas price, gas Limit, sign etc.)
    const tx = await wallet.sendTransaction({
      to: to,
      value: ethers.parseEther(amount)
    });
    
    console.log('Transaction sent:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('Transaction confirmed in block:', receipt.blockNumber);
    
    return tx.hash;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}


module.exports = {
  sendTransactionWithProvider,
};