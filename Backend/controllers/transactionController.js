const {
  sendEthereumTransaction,
} = require("../services/ethereumService");

const {
  sendSolanaTransaction,
} = require("../services/solanaService");

exports.sendTransaction = async (req, res) => {
  try {
    const { chain, privateKey, to, amount } = req.body;

    if (!chain || !privateKey || !to || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    let result;

    switch (chain.toLowerCase()) {
      case "ethereum":
        result = await sendEthereumTransaction(
          privateKey,
          to,
          amount
        );
        break;

      case "solana":
        result = await sendSolanaTransaction(
          privateKey,
          to,
          amount
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Unsupported blockchain",
        });
    }

    res.json(result);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};