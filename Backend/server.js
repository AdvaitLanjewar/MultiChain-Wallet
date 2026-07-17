const express = require("express");
const cors = require("cors");

const { generateWallet } = require("./index");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Blockchain Wallet Backend Running...");
});

// Generate Wallet API
app.get("/generate-wallet", async (req, res) => {
  try {
    const wallet = await generateWallet();
    res.json(wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});