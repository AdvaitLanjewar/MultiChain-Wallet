module.exports = (req, res, next) => {
  const { chain, privateKey, to, amount } = req.body;

  if (!chain || !privateKey || !to || amount === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  if (Number(amount) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be greater than zero",
    });
  }

  next();
};