const { ethers } = require("ethers");

async function sendTransactionWithProvider(privateKey, to, amount) {
  // Create provider using GetBlock
  const provider = new ethers.JsonRpcProvider(`https://shared.ap-southeast-1.getblock.io/ff253b2407d743729003ba75fd9d12f0`);
  
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


sendTransactionWithProvider("0xa845afae8903af9b5661d68893452c92559a1a66a0f01959fb63cb3f40664e5b","0x4c9730aCa1af4C2AA2145f835A08Db139bD7E3f6","0.0000001771250");