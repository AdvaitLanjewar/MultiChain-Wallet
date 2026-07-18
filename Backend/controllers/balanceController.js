const { getBitcoinBalance } = require("../services/bitcoinService");
const {
  getEthereumBalance,
  getSolanaBalance,
} = require("../services/balanceService");

exports.getBalance = async (req, res) => {
  try {
    const { chain, address } = req.query;

    if (!chain || !address) {
      return res.status(400).json({
        success: false,
        message: "chain and address are required",
      });
    }

    let balance;

    switch (chain.toLowerCase()) {
      case "ethereum":
        balance = await getEthereumBalance(address);
        break;

      case "solana":
        balance = await getSolanaBalance(address);
        break;

      case "bitcoin":
        balance = await getBitcoinBalance(address);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Unsupported blockchain",
        });
    }

    res.json({
      success: true,
      chain,
      address,
      balance,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};