const errorHandler = require("./middleware/errorHandler");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const express = require("express");
const cors = require("cors");

const { generateWallet } = require("./services/walletService");
const balanceRoutes = require("./routes/balanceRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

console.log("ETH RPC:", process.env.ETH_RPC_URL);
console.log("SOL RPC:", process.env.SOL_RPC_URL);

app.use(cors());
app.use(express.json());

// Balance Routes
app.use("/balance", balanceRoutes);

// Transaction Routes
app.use("/transaction", transactionRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("Blockchain Wallet Backend Running...");
});


// Wallet Generation
app.get("/generate-wallet", async (req, res) => {
  try {
    const wallet = await generateWallet();
    res.json(wallet);
  } catch (err) {
  next(err);
}
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});