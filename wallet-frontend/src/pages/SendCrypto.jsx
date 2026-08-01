import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Send, Clipboard, QrCode, CheckCircle2, AlertCircle, ExternalLink, 
  RefreshCw, ShieldCheck, ArrowRight, X, Sparkles
} from "lucide-react";

import Navbar from "../components/Navbar";
import { useWallet } from "../context/WalletContext";
import API from "../services/api";
import { getCryptoPricesWithDetails } from "../services/priceService";
import { getBalances } from "../services/balanceService";

function SendCrypto() {
  const { wallet } = useWallet();
  const [chain, setChain] = useState("ethereum");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const [balances, setBalances] = useState({ ethereum: "0", bitcoin: "0", solana: "0" });
  const [prices, setPrices] = useState({
    ethereum: { price: 3480.25, change24h: 0 },
    bitcoin: { price: 65420.50, change24h: 0 },
    solana: { price: 148.80, change24h: 0 },
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txResult, setTxResult] = useState(null);
  const [txError, setTxError] = useState(null);

  const fetchBalancesAndPrices = useCallback(async () => {
    if (!wallet) return;
    try {
      const [balData, priceData] = await Promise.all([
        getBalances(wallet),
        getCryptoPricesWithDetails(),
      ]);
      setBalances(balData);
      setPrices(priceData);
    } catch (e) {
      console.error("Error fetching balances for send page:", e);
    }
  }, [wallet]);

  useEffect(() => {
    fetchBalancesAndPrices();
  }, [fetchBalancesAndPrices]);

  if (!wallet) {
    return <Navigate to="/" />;
  }

  // Get current network info
  const getCurrentNetworkDetails = () => {
    if (chain === "ethereum") {
      return {
        name: "Ethereum",
        symbol: "ETH",
        color: "#627EEA",
        icon: "Ξ",
        fee: 0.0003,
        balance: parseFloat(balances.ethereum) || 0,
        price: prices.ethereum?.price || 0,
        explorer: (hash) => `https://sepolia.etherscan.io/tx/${hash}`,
      };
    } else if (chain === "bitcoin") {
      return {
        name: "Bitcoin",
        symbol: "BTC",
        color: "#F7931A",
        icon: "₿",
        fee: 0.00001,
        balance: parseFloat(balances.bitcoin) || 0,
        price: prices.bitcoin?.price || 0,
        explorer: (hash) => `https://www.blockchain.com/explorer/transactions/btc-testnet/${hash}`,
      };
    } else {
      return {
        name: "Solana",
        symbol: "SOL",
        color: "#14F195",
        icon: "◎",
        fee: 0.000005,
        balance: parseFloat(balances.solana) || 0,
        price: prices.solana?.price || 0,
        explorer: (hash) => `https://explorer.solana.com/tx/${hash}?cluster=devnet`,
      };
    }
  };

  const net = getCurrentNetworkDetails();
  const parsedAmount = parseFloat(amount) || 0;
  const usdValue = parsedAmount * net.price;
  const maxAvailable = Math.max(0, net.balance - net.fee);

  // Private key helper
  const getPrivateKeyForChain = () => {
    if (!wallet) return "";
    if (chain === "ethereum") return wallet.ethereum?.privateKey || "";
    if (chain === "solana") return wallet.solana?.privateKey || "";
    if (chain === "bitcoin") return wallet.bitcoin?.privateKey || "";
    return "";
  };

  // Clipboard paste handler
  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setToAddress(text.trim());
        toast.success("Address pasted from clipboard!");
      }
    } catch (err) {
      toast.error("Clipboard permission denied");
      console.error(err);
    }
  };

  // Quick Percentage Setter
  const handleSetPercentage = (pct) => {
    if (maxAvailable <= 0) {
      setAmount("0");
      return;
    }
    const calcVal = (maxAvailable * (pct / 100)).toFixed(6);
    setAmount(calcVal);
  };

  // Validations
  const validateForm = () => {
    if (!toAddress || toAddress.trim().length < 10) {
      toast.error(`Please enter a valid ${net.name} recipient address.`);
      return false;
    }
    if (parsedAmount <= 0) {
      toast.error("Please enter an amount greater than 0.");
      return false;
    }
    if (parsedAmount + net.fee > net.balance) {
      toast.error(`Insufficient balance. Maximum sendable is ~${maxAvailable.toFixed(6)} ${net.symbol}`);
      return false;
    }
    return true;
  };

  // Form submit -> triggers confirmation modal
  const handleOpenConfirmation = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  // Broadcast transaction via backend API
  const handleBroadcastTransaction = async () => {
    setShowConfirmModal(false);
    const privateKey = getPrivateKeyForChain();

    if (!privateKey) {
      toast.error(`No private key found for ${chain}.`);
      return;
    }

    setLoading(true);
    setTxResult(null);
    setTxError(null);

    try {
      const response = await API.post("/transaction", {
        chain,
        privateKey,
        to: toAddress,
        amount: parsedAmount,
      });

      if (response.data && response.data.success !== false) {
        setTxResult(response.data);
        toast.success(`Transaction broadcast complete on ${net.name}!`);
        // Refresh balance
        fetchBalancesAndPrices();
      } else {
        const msg = response.data?.message || "Transaction failed to broadcast.";
        setTxError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Transaction Error:", err);
      const msg = err.response?.data?.message || err.message || "Network error broadcasting transaction.";
      setTxError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setToAddress("");
    setAmount("");
    setTxResult(null);
    setTxError(null);
  };

  const txHash = txResult?.transactionHash || txResult?.txHash || (typeof txResult === "string" ? txResult : null);

  return (
    <>
      <Navbar />

      <div className="container dashboard">
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <h1>Send Cryptocurrency 📤</h1>
            <p className="dashboard-subtitle">
              Transfer ETH, BTC, or SOL across multi-chain networks securely
            </p>
          </div>
        </div>

        <div className="max-w-xl" style={{ margin: "0 auto" }}>
          {/* Result Success Screen */}
          {txResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="receipt-card"
            >
              <div className="receipt-icon-wrapper">
                <CheckCircle2 size={36} />
              </div>

              <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px", color: "var(--text-main)" }}>
                Transaction Submitted
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
                Your transaction has been broadcast to the {net.name} network.
              </p>

              <div className="tx-preview-card" style={{ marginBottom: "24px", textAlign: "left" }}>
                <div className="tx-preview-row">
                  <span className="label">Network</span>
                  <span className="val" style={{ color: net.color }}>{net.name} ({net.symbol})</span>
                </div>
                <div className="tx-preview-row">
                  <span className="label">Recipient</span>
                  <span className="val" style={{ fontFamily: "monospace", fontSize: "13px" }}>
                    {toAddress.slice(0, 8)}...{toAddress.slice(-6)}
                  </span>
                </div>
                <div className="tx-preview-row">
                  <span className="label">Amount</span>
                  <span className="val">{parsedAmount} {net.symbol} (${usdValue.toFixed(2)})</span>
                </div>
                <div className="tx-preview-row">
                  <span className="label">Estimated Fee</span>
                  <span className="val">~{net.fee} {net.symbol}</span>
                </div>
                <div className="tx-preview-row">
                  <span className="label">Transaction Hash</span>
                  <span className="val" style={{ fontFamily: "monospace", fontSize: "12.5px", color: "#38BDF8", wordBreak: "break-all" }}>
                    {txHash || "Transaction submitted successfully."}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                {txHash && (
                  <a
                    href={net.explorer(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn"
                    style={{ textDecoration: "none" }}
                  >
                    <ExternalLink size={16} />
                    <span>Open Explorer</span>
                  </a>
                )}

                <button type="button" className="action-btn primary" onClick={handleResetForm}>
                  <span>Done</span>
                </button>
              </div>
            </motion.div>
          ) : txError ? (
            /* Result Failure Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card"
              style={{ textAlign: "center", borderColor: "rgba(244, 63, 94, 0.3)" }}
            >
              <div style={{
                width: "64px", height: "64px", borderRadius: "20px",
                background: "rgba(244, 63, 94, 0.15)", border: "1px solid rgba(244, 63, 94, 0.3)",
                color: "#FB7185", display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px auto"
              }}>
                <AlertCircle size={36} />
              </div>

              <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#FB7185", marginBottom: "8px" }}>
                Transaction Failed
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
                {txError}
              </p>

              <button type="button" className="primary-btn" onClick={() => setTxError(null)}>
                <span>Try Again</span>
              </button>
            </motion.div>
          ) : (
            /* Form Screen */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card"
            >
              {/* Top Available Balance Bar */}
              <div style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border-color)",
                padding: "16px",
                borderRadius: "14px",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
                    Available {net.name} Balance
                  </div>
                  <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "22px", fontWeight: "700", marginTop: "2px" }}>
                    {net.balance.toFixed(4)} <span style={{ fontSize: "14px", color: net.color }}>{net.symbol}</span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Est. USD Value</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-main)" }}>
                    ${(net.balance * net.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <form onSubmit={handleOpenConfirmation} className="form-group">
                {/* Network Switcher Pills */}
                <div>
                  <label>Selected Network</label>
                  <div className="network-selector-grid">
                    <button
                      type="button"
                      className={`network-select-btn eth ${chain === "ethereum" ? "active" : ""}`}
                      onClick={() => { setChain("ethereum"); setAmount(""); }}
                    >
                      <span>Ξ</span>
                      <span>Ethereum</span>
                    </button>

                    <button
                      type="button"
                      className={`network-select-btn btc ${chain === "bitcoin" ? "active" : ""}`}
                      onClick={() => { setChain("bitcoin"); setAmount(""); }}
                    >
                      <span>₿</span>
                      <span>Bitcoin</span>
                    </button>

                    <button
                      type="button"
                      className={`network-select-btn sol ${chain === "solana" ? "active" : ""}`}
                      onClick={() => { setChain("solana"); setAmount(""); }}
                    >
                      <span>◎</span>
                      <span>Solana</span>
                    </button>
                  </div>
                </div>

                {/* Recipient Address */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label htmlFor="recipient">Recipient Address</label>
                    <div className="input-addon-bar">
                      <button type="button" className="addon-btn" onClick={handlePasteAddress}>
                        <Clipboard size={13} />
                        <span>Paste</span>
                      </button>
                      <button type="button" className="addon-btn" disabled title="Camera QR scanning coming in V2">
                        <QrCode size={13} />
                        <span>QR (Coming Soon)</span>
                      </button>
                    </div>
                  </div>

                  <input
                    id="recipient"
                    type="text"
                    className="text-input"
                    placeholder={`Enter ${net.name} address...`}
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    required
                    style={{ marginTop: "6px" }}
                  />
                </div>

                {/* Amount Input */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label htmlFor="amount">Amount ({net.symbol})</label>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      ≈ ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </span>
                  </div>

                  <input
                    id="amount"
                    type="number"
                    step="any"
                    className="text-input"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    style={{ marginTop: "6px" }}
                  />

                  {/* Quick Percentage Setter Buttons */}
                  <div className="pct-btn-group">
                    <button type="button" className="pct-btn" onClick={() => handleSetPercentage(25)}>25%</button>
                    <button type="button" className="pct-btn" onClick={() => handleSetPercentage(50)}>50%</button>
                    <button type="button" className="pct-btn" onClick={() => handleSetPercentage(75)}>75%</button>
                    <button type="button" className="pct-btn" onClick={() => handleSetPercentage(100)}>MAX</button>
                  </div>
                </div>

                {/* Estimated Network Fee Card */}
                <div className="tx-preview-card" style={{ marginTop: "10px", padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Sparkles size={14} style={{ color: "#A855F7" }} />
                      <span>Estimated Network Fee</span>
                    </span>
                    <span style={{ fontWeight: "700", color: "var(--text-main)" }}>
                      ~{net.fee} {net.symbol} <span style={{ color: "var(--text-dim)", fontWeight: "500" }}>(~${(net.fee * net.price).toFixed(3)})</span>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="primary-btn full-width"
                  style={{ marginTop: "12px", padding: "14px" }}
                  disabled={loading}
                >
                  <Send size={18} />
                  <span>Preview & Send {net.symbol}</span>
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>

      {/* Confirmation Modal Drawer */}
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
                  Confirm Transaction
                </h3>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
                Please review your transaction details before broadcasting to the blockchain network.
              </p>

              <div className="tx-preview-card" style={{ marginBottom: "24px" }}>
                <div className="tx-preview-row">
                  <span className="label">Network</span>
                  <span className="val" style={{ color: net.color }}>{net.name}</span>
                </div>
                <div className="tx-preview-row">
                  <span className="label">Recipient Address</span>
                  <span className="val" style={{ fontFamily: "monospace", fontSize: "12.5px" }}>
                    {toAddress.slice(0, 8)}...{toAddress.slice(-6)}
                  </span>
                </div>
                <div className="tx-preview-row">
                  <span className="label">Amount</span>
                  <span className="val">{parsedAmount} {net.symbol} (${usdValue.toFixed(2)})</span>
                </div>
                <div className="tx-preview-row">
                  <span className="label">Estimated Fee</span>
                  <span className="val">~{net.fee} {net.symbol}</span>
                </div>
                <div className="tx-preview-row">
                  <span className="label">Total Deduction</span>
                  <span className="val" style={{ color: "#34D399", fontSize: "15px" }}>
                    {(parsedAmount + net.fee).toFixed(6)} {net.symbol}
                  </span>
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
                  onClick={handleBroadcastTransaction}
                  disabled={loading}
                >
                  {loading ? <RefreshCw size={18} className="spin" /> : <Send size={18} />}
                  <span>{loading ? "Broadcasting..." : "Confirm & Send"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SendCrypto;