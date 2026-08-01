import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  ShoppingBag, DollarSign, ArrowRight, ShieldCheck, CheckCircle2, 
  Sparkles, CreditCard, ExternalLink, RefreshCw, X, AlertTriangle, Wallet
} from "lucide-react";

import Navbar from "../components/Navbar";
import { useWallet } from "../context/WalletContext";
import { getCryptoPricesWithDetails } from "../services/priceService";

function BuyCrypto() {
  const { wallet } = useWallet();

  // Demo Fiat USD Balance (default $10,000.00, persisted in localStorage)
  const [demoUsdBalance, setDemoUsdBalance] = useState(() => {
    const saved = localStorage.getItem("nexus_demo_usd_balance");
    return saved !== null ? parseFloat(saved) : 10000.00;
  });

  const [selectedCrypto, setSelectedCrypto] = useState("ETH");
  const [fiatAmount, setFiatAmount] = useState("100");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [prices, setPrices] = useState({
    ETH: 3480.25,
    BTC: 65420.50,
    SOL: 148.80,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purchaseReceipt, setPurchaseReceipt] = useState(null);

  // Load live crypto market rates
  const fetchPrices = useCallback(async () => {
    try {
      const priceData = await getCryptoPricesWithDetails();
      setPrices({
        ETH: priceData.ethereum?.price || 3480.25,
        BTC: priceData.bitcoin?.price || 65420.50,
        SOL: priceData.solana?.price || 148.80,
      });
    } catch (e) {
      console.error("Error fetching live rates for buy page:", e);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Save Demo USD Balance to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("nexus_demo_usd_balance", demoUsdBalance.toString());
  }, [demoUsdBalance]);

  if (!wallet) {
    return <Navigate to="/" />;
  }

  const currentPrice = prices[selectedCrypto] || 1000;
  const parsedFiat = parseFloat(fiatAmount) || 0;
  const estimatedCrypto = parsedFiat / currentPrice;

  const isBalanceDepleted = demoUsdBalance <= 0;

  // Preset setter ($50, $100, $250, $500, MAX)
  const handleSetPreset = (val) => {
    if (val === "MAX") {
      setFiatAmount(demoUsdBalance.toFixed(2));
    } else {
      const amt = Math.min(val, demoUsdBalance);
      setFiatAmount(amt.toString());
    }
  };

  // Validate Order
  const handleOpenConfirmation = (e) => {
    e.preventDefault();
    if (isBalanceDepleted) {
      toast.error("Demo USD balance depleted ($0.00). Purchases disabled.");
      return;
    }
    if (parsedFiat <= 0) {
      toast.error("Please enter a valid amount greater than $0.");
      return;
    }
    if (parsedFiat > demoUsdBalance) {
      toast.error(`Amount exceeds available Demo USD balance ($${demoUsdBalance.toLocaleString()})`);
      return;
    }
    setShowConfirmModal(true);
  };

  // Execute Demo Purchase Order & Update State + localStorage
  const handleExecutePurchase = () => {
    setShowConfirmModal(false);
    setLoading(true);

    setTimeout(() => {
      // 1. Deduct Demo USD balance
      const newUsdBal = Math.max(0, demoUsdBalance - parsedFiat);
      setDemoUsdBalance(newUsdBal);

      // 2. Increase purchased crypto balance in localStorage
      const savedCustomBalances = JSON.parse(localStorage.getItem("nexus_demo_custom_balances") || "{}");
      const key = selectedCrypto === "ETH" ? "ethereum" : selectedCrypto === "BTC" ? "bitcoin" : "solana";
      const prevBal = parseFloat(savedCustomBalances[key] || "0");
      savedCustomBalances[key] = (prevBal + estimatedCrypto).toString();
      localStorage.setItem("nexus_demo_custom_balances", JSON.stringify(savedCustomBalances));

      // 3. Add demo transaction entry to localStorage
      const prevTxs = JSON.parse(localStorage.getItem("nexus_demo_transactions") || "[]");
      const fakeHash = "0x" + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      
      const newTxEntry = {
        id: "tx-buy-" + Date.now(),
        chain: key,
        symbol: selectedCrypto,
        type: "receive",
        title: `Bought ${selectedCrypto} (Demo Gateway)`,
        amount: `+ ${estimatedCrypto.toFixed(4)} ${selectedCrypto}`,
        usdVal: `$${parsedFiat.toFixed(2)}`,
        from: "Demo Fiat Onramp Gateway",
        fromFull: "Nexus Demo Fiat Onramp Gateway (Card)",
        to: `My ${selectedCrypto} Wallet`,
        toFull: wallet[key]?.address || "My Wallet Address",
        time: "Just now",
        timestamp: new Date().toLocaleString(),
        status: "Confirmed",
        hash: fakeHash,
        isDemo: true,
      };

      localStorage.setItem("nexus_demo_transactions", JSON.stringify([newTxEntry, ...prevTxs]));

      // 4. Set receipt output
      setPurchaseReceipt({
        cryptoAmount: estimatedCrypto.toFixed(6),
        cryptoSymbol: selectedCrypto,
        fiatAmount: parsedFiat.toFixed(2),
        newDemoUsdBalance: newUsdBal.toFixed(2),
        hash: fakeHash,
        chainKey: key,
      });

      setLoading(false);
      toast.success(`Demo purchase complete! Added +${estimatedCrypto.toFixed(4)} ${selectedCrypto} to portfolio.`);
    }, 1200);
  };

  const handleResetForm = () => {
    setPurchaseReceipt(null);
    setFiatAmount("100");
  };

  return (
    <>
      <Navbar />

      <div className="container dashboard">
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <h1>Buy Cryptocurrency 🛍️</h1>
            <p className="dashboard-subtitle">
              Simulate instant fiat-to-crypto purchases using your Demo USD wallet
            </p>
          </div>
        </div>

        <div className="max-w-xl" style={{ margin: "0 auto" }}>
          {/* Demo USD Balance Hero Card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(18, 24, 38, 0.8) 100%)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            borderRadius: "20px",
            padding: "20px 24px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={14} style={{ color: "#A855F7" }} />
                <span>Demo USD Gateway Balance</span>
              </div>

              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "32px", fontWeight: "700", marginTop: "2px", color: "#F8FAFC" }}>
                ${demoUsdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="badge-demo-data" style={{ fontSize: "12px", padding: "6px 12px" }}>
              <span>Persisted Demo Funds</span>
            </div>
          </div>

          {/* Depleted Balance Alert Banner */}
          {isBalanceDepleted && (
            <div style={{
              background: "rgba(244, 63, 94, 0.1)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              padding: "16px",
              borderRadius: "16px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#FB7185",
              fontSize: "14px"
            }}>
              <AlertTriangle size={24} style={{ flexShrink: 0 }} />
              <div>
                <strong>Demo USD Balance Depleted ($0.00):</strong> You have exhausted your demo fiat funds. Purchases are disabled. Reset your wallet in Settings to restore funds.
              </div>
            </div>
          )}

          {/* Receipt View */}
          {purchaseReceipt ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="receipt-card"
            >
              <div className="receipt-icon-wrapper">
                <CheckCircle2 size={36} />
              </div>

              <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px", color: "var(--text-main)" }}>
                Demo Order Complete!
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
                Your portfolio has been updated immediately with your purchased assets.
              </p>

              <div className="tx-preview-card" style={{ marginBottom: "24px", textAlign: "left" }}>
                <div className="tx-preview-row">
                  <span className="label">Asset Purchased</span>
                  <span className="val" style={{ color: "#34D399", fontSize: "16px" }}>
                    +{purchaseReceipt.cryptoAmount} {purchaseReceipt.cryptoSymbol}
                  </span>
                </div>

                <div className="tx-preview-row">
                  <span className="label">Fiat Deducted</span>
                  <span className="val">${purchaseReceipt.fiatAmount} USD</span>
                </div>

                <div className="tx-preview-row">
                  <span className="label">Remaining Demo USD</span>
                  <span className="val">${purchaseReceipt.newDemoUsdBalance} USD</span>
                </div>

                <div className="tx-preview-row">
                  <span className="label">Simulated Tx Hash</span>
                  <span className="val" style={{ fontFamily: "monospace", fontSize: "12px", color: "#38BDF8", wordBreak: "break-all" }}>
                    {purchaseReceipt.hash}
                  </span>
                </div>

                <div className="tx-preview-row">
                  <span className="label">Badge</span>
                  <span className="val">
                    <span className="badge-demo-data">Demo Purchase</span>
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button type="button" className="action-btn primary" onClick={handleResetForm}>
                  <span>Buy More Crypto</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* Purchase Form */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card"
            >
              <form onSubmit={handleOpenConfirmation} className="form-group">
                {/* Crypto Network Selector Tabs */}
                <div>
                  <label>Select Asset to Buy</label>
                  <div className="network-selector-grid">
                    <button
                      type="button"
                      className={`network-select-btn eth ${selectedCrypto === "ETH" ? "active" : ""}`}
                      onClick={() => setSelectedCrypto("ETH")}
                    >
                      <span>Ξ</span>
                      <span>Buy ETH</span>
                    </button>

                    <button
                      type="button"
                      className={`network-select-btn btc ${selectedCrypto === "BTC" ? "active" : ""}`}
                      onClick={() => setSelectedCrypto("BTC")}
                    >
                      <span>₿</span>
                      <span>Buy BTC</span>
                    </button>

                    <button
                      type="button"
                      className={`network-select-btn sol ${selectedCrypto === "SOL" ? "active" : ""}`}
                      onClick={() => setSelectedCrypto("SOL")}
                    >
                      <span>◎</span>
                      <span>Buy SOL</span>
                    </button>
                  </div>
                </div>

                {/* You Pay USD Amount Input */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label htmlFor="fiat-amount">You Pay (USD)</label>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Live Rate: 1 {selectedCrypto} ≈ ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                    </span>
                  </div>

                  <div style={{ position: "relative", marginTop: "6px" }}>
                    <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", fontWeight: "700", color: "var(--text-muted)" }}>$</span>
                    <input
                      id="fiat-amount"
                      type="number"
                      className="text-input"
                      style={{ paddingLeft: "32px" }}
                      placeholder="100"
                      value={fiatAmount}
                      onChange={(e) => setFiatAmount(e.target.value)}
                      disabled={isBalanceDepleted}
                      required
                    />
                  </div>

                  {/* Preset Buttons ($50, $100, $250, $500, MAX) */}
                  <div className="fiat-preset-grid">
                    <button type="button" className="fiat-preset-chip" onClick={() => handleSetPreset(50)} disabled={isBalanceDepleted}>$50</button>
                    <button type="button" className="fiat-preset-chip" onClick={() => handleSetPreset(100)} disabled={isBalanceDepleted}>$100</button>
                    <button type="button" className="fiat-preset-chip" onClick={() => handleSetPreset(250)} disabled={isBalanceDepleted}>$250</button>
                    <button type="button" className="fiat-preset-chip" onClick={() => handleSetPreset(500)} disabled={isBalanceDepleted}>$500</button>
                    <button type="button" className="fiat-preset-chip" onClick={() => handleSetPreset("MAX")} disabled={isBalanceDepleted}>MAX</button>
                  </div>
                </div>

                {/* You Receive Calculation Preview Box */}
                <div className="tx-preview-card" style={{ marginTop: "10px", textAlign: "center", background: "rgba(139, 92, 246, 0.08)", borderColor: "rgba(168, 85, 247, 0.3)" }}>
                  <div style={{ fontSize: "12.5px", color: "var(--text-muted)", fontWeight: "600" }}>
                    YOU RECEIVE APPROXIMATELY
                  </div>
                  <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "28px", fontWeight: "800", color: "#34D399", margin: "4px 0" }}>
                    ≈ {estimatedCrypto.toFixed(6)} {selectedCrypto}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                    Zero Onramp Fees • Instant Demo Settlement
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label htmlFor="payment-method">Payment Method</label>
                  <select
                    id="payment-method"
                    className="select-input"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="card">Credit / Debit Card (Visa / Mastercard)</option>
                    <option value="bank">Bank Wire Transfer (ACH / SEPA)</option>
                    <option value="apple">Apple Pay / Google Pay</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="primary-btn full-width"
                  style={{ marginTop: "12px", padding: "14px" }}
                  disabled={loading || isBalanceDepleted}
                >
                  <ShoppingBag size={18} />
                  <span>{loading ? "Processing Order..." : `Buy ${selectedCrypto} Now`}</span>
                </button>

                <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
                  <ShieldCheck size={16} style={{ color: "var(--success)" }} />
                  <span>Encrypted Demo Fiat-to-Crypto Onramp</span>
                </p>
              </form>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pre-Purchase Confirmation Modal Drawer */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="modal-dialog"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-main)" }}>
                  Confirm Demo Order
                </h3>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="tx-preview-card" style={{ marginBottom: "24px" }}>
                <div className="tx-preview-row">
                  <span className="label">You Spend</span>
                  <span className="val">${parsedFiat.toFixed(2)} USD</span>
                </div>
                <div className="tx-preview-row">
                  <span className="label">Asset Receiving</span>
                  <span className="val" style={{ color: "#34D399", fontSize: "15px" }}>
                    ≈ {estimatedCrypto.toFixed(6)} {selectedCrypto}
                  </span>
                </div>
                <div className="tx-preview-row">
                  <span className="label">Payment Method</span>
                  <span className="val" style={{ textTransform: "capitalize" }}>{paymentMethod}</span>
                </div>
                <div className="tx-preview-row">
                  <span className="label">Remaining Demo USD</span>
                  <span className="val">${(demoUsdBalance - parsedFiat).toFixed(2)} USD</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  className="secondary-btn full-width"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary-btn full-width"
                  onClick={handleExecutePurchase}
                  disabled={loading}
                >
                  {loading ? <RefreshCw size={18} className="spin" /> : <ShoppingBag size={18} />}
                  <span>{loading ? "Executing..." : "Confirm Purchase"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default BuyCrypto;