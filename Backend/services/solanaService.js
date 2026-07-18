const {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

const bs58 = require("bs58");

const connection = new Connection(
  process.env.SOL_RPC_URL,
  "confirmed"
);

async function sendSolanaTransaction(privateKey, to, amount) {
  try {
    if (!privateKey) {
      throw new Error("Private key is required");
    }

    // Validate receiver address
    let receiver;
    try {
      receiver = new PublicKey(to);
    } catch {
      throw new Error("Invalid receiver address");
    }

    if (Number(amount) <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const sender = Keypair.fromSecretKey(
      bs58.decode(privateKey)
    );

    const lamports = Math.round(
      Number(amount) * LAMPORTS_PER_SOL
    );

    // Check sender balance
    const balance = await connection.getBalance(sender.publicKey);

    // Keep a small buffer for transaction fees
    const estimatedFee = 5000;

    if (balance < lamports + estimatedFee) {
      throw new Error("Insufficient SOL balance");
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: receiver,
        lamports,
      })
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [sender]
    );

    return {
      success: true,
      signature,
      amount,
      from: sender.publicKey.toBase58(),
      to: receiver.toBase58(),
      explorer: `https://solscan.io/tx/${signature}`,
    };

  } catch (err) {
    throw err;
  }
}

module.exports = {
  sendSolanaTransaction,
};