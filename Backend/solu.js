const {
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey
} = require("@solana/web3.js");

const bs58 = require("bs58");

async function sendSolanaTransactionRaw(privateKey, to, amount) {
  const connection = new Connection(`https://shared.us-east-1.getblock.io/c5d576c75a8e4df39e8872dd40bf8bac`);
  
  const fromKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
  const toPublicKey = new PublicKey(to);
  
  try {
    // Get recent blockhash
    const latestBlockhash = await connection.getLatestBlockhash();
    
    // Create transaction
    const transaction = new Transaction();
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.feePayer = fromKeypair.publicKey;
    
    // Add the transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: Math.round(amount * LAMPORTS_PER_SOL)
      })
    );
    
    // Sign the transaction
    transaction.sign(fromKeypair);
    
    // Send raw transaction
    const signature = await connection.sendRawTransaction(
      transaction.serialize(),
      {
        skipPreflight: false,
        preflightCommitment: 'confirmed'
      }
    );
    
    console.log('Transaction sent:', signature);
    
    // Confirm transaction
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    });
    
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err}`);
    }
    
    console.log('Transaction confirmed:', confirmation);
    
    return signature;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}


sendSolanaTransactionRaw("5vBDHxDFLP5RgBcph9wvPK3o78SdsUFGcXuT2RdcFcn8ZoDLg32732aa3suthyh44m1nuf1yGfFzPxbrfV261FY3","j44VEnCXjnaeLK5Xn8EttraNPWYmTo2BLhcazoAt6fi",0.001);


