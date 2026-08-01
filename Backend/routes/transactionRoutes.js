const express = require("express");

const router = express.Router();

const validateTransaction = require("../middleware/validateTransaction");

const {
  sendTransaction,
} = require("../controllers/transactionController");

router.post("/", validateTransaction, sendTransaction);

module.exports = router;