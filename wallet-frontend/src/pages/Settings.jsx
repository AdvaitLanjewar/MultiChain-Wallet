import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Settings as SettingsIcon, Shield, Globe, Key, Trash2, Moon, Sun, 
  DollarSign, Eye, EyeOff, Lock, AlertTriangle, CheckCircle2, User, 
  Sparkles, ExternalLink, ShieldCheck, GraduationCap, X
} from "lucide-react";

import Navbar from "../components/Navbar";
import CopyButton from "../components/CopyButton";
import { useWallet } from "../context/WalletContext";

function Settings() {
  const { wallet, logoutWallet } = useWallet();
  const navigate = useNavigate();

  // Settings State automatically saved and restored via localStorage
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("nexus_settings_currency") || "USD";
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("nexus_settings_theme") || "dark";
  });

  const [network, setNetwork] = useState(() => {
    return localStorage.getItem("nexus_settings_network") || "mainnet";
  });

  const [hideBalances, setHideBalances] = useState(() => {
    return localStorage.getItem("nexus_settings_hide_balances") === "true";
  });

  // Modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [isPhraseRevealed, setIsPhraseRevealed] = useState(false);

  // Two-step Reset Wallet modal states
  const [resetStep, setResetStep] = useState(0); // 0 = closed, 1 = first confirmation, 2 = second confirmation
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);

  // Save settings changes to localStorage
  useEffect(() => {
    localStorage.setItem("nexus_settings_currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("nexus_settings_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("nexus_settings_network", network);
  }, [network]);

  useEffect(() => {
    localStorage.setItem("nexus_settings_hide_balances", hideBalances.toString());
  }, [hideBalances]);

  if (!wallet) {
    return <Navigate to="/" />;
  }

  // Handle Two-Step Reset Wallet
  const handleFinalReset = () => {
    if (!confirmCheckbox) {
      toast.error("Please check the confirmation box to proceed.");
      return;
    }
    logoutWallet();
    localStorage.clear();
    toast.success("Wallet data permanently cleared.");
    setResetStep(0);
    navigate("/");
  };

  const seedWords = wallet.mnemonic ? wallet.mnemonic.trim().split(/\s+/) : [];

  return (
    <>
      <Navbar />

      <div className="container dashboard">
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <h1>Wallet Settings ⚙️</h1>
            <p className="dashboard-subtitle">
              Manage wallet security, display preferences, and node connections
            </p>
          </div>
        </div>

        <div className="max-w-xl" style={{ margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Profile & Active Wallet Overview */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "54px", height: "54px", borderRadius: "18px",
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(99, 102, 241, 0.2))",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                color: "#C084FC", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <User size={28} />
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-main)" }}>Nexus Master Vault</h3>
                  <span className="network-badge" style={{ fontSize: "11px", padding: "3px 8px" }}>HD Wallet</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Multi-Chain BIP39 Standard Seed Phrase Active
                </p>
              </div>
            </div>
          </motion.div>

          {/* Wallet Addresses Information */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card"
          >
            <div className="widget-title-row">
              <h3>
                <Key size={18} style={{ color: "#38BDF8" }} />
                <span>Wallet Addresses</span>
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="asset-row" style={{ padding: "12px 14px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Ethereum (ETH) Address</div>
                  <div style={{ fontFamily: "monospace", fontSize: "13px", color: "#38BDF8", marginTop: "2px" }}>
                    {wallet.ethereum?.address?.slice(0, 10)}...{wallet.ethereum?.address?.slice(-8)}
                  </div>
                </div>
                <CopyButton text={wallet.ethereum?.address} label="Copy ETH" />
              </div>

              <div className="asset-row" style={{ padding: "12px 14px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Bitcoin (BTC) Address</div>
                  <div style={{ fontFamily: "monospace", fontSize: "13px", color: "#F7931A", marginTop: "2px" }}>
                    {wallet.bitcoin?.address?.slice(0, 10)}...{wallet.bitcoin?.address?.slice(-8)}
                  </div>
                </div>
                <CopyButton text={wallet.bitcoin?.address} label="Copy BTC" />
              </div>

              <div className="asset-row" style={{ padding: "12px 14px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Solana (SOL) Address</div>
                  <div style={{ fontFamily: "monospace", fontSize: "13px", color: "#14F195", marginTop: "2px" }}>
                    {wallet.solana?.address?.slice(0, 10)}...{wallet.solana?.address?.slice(-8)}
                  </div>
                </div>
                <CopyButton text={wallet.solana?.address} label="Copy SOL" />
              </div>
            </div>
          </motion.div>

          {/* Preferences & Display Options */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card"
          >
            <div className="widget-title-row">
              <h3>
                <Globe size={18} style={{ color: "#A855F7" }} />
                <span>Display & Preferences</span>
              </h3>
            </div>

            <div className="setting-item-row">
              <div className="setting-label-box">
                <h4>Default Fiat Currency</h4>
                <p>Select your preferred fiat currency display across portfolio values.</p>
              </div>
              <select
                className="select-input"
                style={{ width: "130px", padding: "8px 12px", fontSize: "13px" }}
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  toast.success(`Currency set to ${e.target.value}`);
                }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="setting-item-row">
              <div className="setting-label-box">
                <h4>Theme Preference</h4>
                <p>Customize wallet UI theme mode.</p>
              </div>
              <select
                className="select-input"
                style={{ width: "130px", padding: "8px 12px", fontSize: "13px" }}
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value);
                  toast.success(`Theme set to ${e.target.value}`);
                }}
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Mode</option>
                <option value="system">System Default</option>
              </select>
            </div>

            <div className="setting-item-row">
              <div className="setting-label-box">
                <h4>Network Environment</h4>
                <p>Toggle between production mainnet nodes and devnet testnets.</p>
              </div>
              <select
                className="select-input"
                style={{ width: "160px", padding: "8px 12px", fontSize: "13px" }}
                value={network}
                onChange={(e) => {
                  setNetwork(e.target.value);
                  toast.success(`Switched network to ${e.target.value.toUpperCase()}`);
                }}
              >
                <option value="mainnet">Mainnet Production</option>
                <option value="testnet">Testnet / Devnet</option>
              </select>
            </div>

            <div className="setting-item-row">
              <div className="setting-label-box">
                <h4>Hide Balances (Privacy Mode)</h4>
                <p>Mask all numerical balance values with privacy asterisks.</p>
              </div>
              <label className="switch-toggle-label">
                <input
                  type="checkbox"
                  checked={hideBalances}
                  onChange={(e) => {
                    setHideBalances(e.target.checked);
                    toast.success(e.target.checked ? "Privacy mode enabled" : "Privacy mode disabled");
                  }}
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="setting-item-row">
              <div className="setting-label-box">
                <h4>Auto Lock Vault</h4>
                <p>Automatically lock wallet after inactivity.</p>
              </div>
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
          </motion.div>

          {/* Security & Backup Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card"
          >
            <div className="widget-title-row">
              <h3>
                <Shield size={18} style={{ color: "#10B981" }} />
                <span>Security & Secret Export</span>
              </h3>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
              <div className="setting-label-box">
                <h4>Export Secret Recovery Phrase</h4>
                <p>Backup your 12-word BIP39 seed phrase to restore your wallet anywhere.</p>
              </div>
              <button
                type="button"
                className="secondary-btn-sm"
                onClick={() => {
                  setIsPhraseRevealed(false);
                  setShowExportModal(true);
                }}
              >
                <Key size={14} />
                <span>Export Phrase</span>
              </button>
            </div>
          </motion.div>

          {/* Danger Zone Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
            style={{ borderColor: "rgba(244, 63, 94, 0.3)" }}
          >
            <div className="widget-title-row">
              <h3 style={{ color: "#FB7185" }}>
                <Trash2 size={18} />
                <span>Danger Zone</span>
              </h3>
            </div>

            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Disconnect your wallet and clear all local seed keys and browser storage data permanently.
            </p>

            <button
              type="button"
              className="logout-btn"
              style={{ width: "100%", justifyContent: "center", padding: "12px" }}
              onClick={() => setResetStep(1)}
            >
              <Trash2 size={16} />
              <span>Reset & Disconnect Wallet</span>
            </button>
          </motion.div>

          {/* About Project & Privacy Assurance */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card"
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
              <div style={{ padding: "10px", borderRadius: "12px", background: "rgba(56, 189, 248, 0.15)", color: "#38BDF8" }}>
                <GraduationCap size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "16px", fontWeight: "700" }}>About Nexus Wallet</h4>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                  College Final Year Project • Version 1.0.0 Production Release
                </p>
              </div>
            </div>

            <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>
              Built as a non-custodial multi-chain cryptocurrency wallet supporting Ethereum, Bitcoin, and Solana with 100% client-side cryptographic security and real-time market tracking.
            </div>

            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#34D399" }}>
              <ShieldCheck size={16} />
              <span>100% Non-Custodial Architecture — Private keys never touch any server.</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Export Wallet Modal (Requires explicit click on "Reveal Recovery Phrase") */}
      <AnimatePresence>
        {showExportModal && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-dialog"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#F59E0B", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Key size={20} /> Export Recovery Phrase
                </h3>
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Security Warning Banner */}
              <div className="security-warning-box">
                <AlertTriangle size={24} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Security Warning!</strong> Anyone with your recovery phrase can steal all your multi-chain assets. Ensure no one is looking at your screen.
                </div>
              </div>

              {isPhraseRevealed ? (
                <div>
                  <div className="words-grid">
                    {seedWords.map((word, idx) => (
                      <div key={idx} className="word-chip">
                        <span className="word-num">{idx + 1}.</span>
                        <span className="word-val">{word}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "20px", display: "flex", gap: "12px", justifyContent: "space-between" }}>
                    <CopyButton text={wallet.mnemonic} label="Copy Phrase" successMessage="Seed phrase copied securely!" />
                    <button type="button" className="secondary-btn-sm" onClick={() => setIsPhraseRevealed(false)}>
                      <EyeOff size={14} /> Hide
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <Lock size={40} style={{ color: "var(--text-dim)", marginBottom: "12px" }} />
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
                    Your secret phrase is protected. Click below to reveal your 12-word seed phrase.
                  </p>

                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => setIsPhraseRevealed(true)}
                  >
                    <Eye size={18} />
                    <span>Reveal Recovery Phrase</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Two-Step Reset Wallet Confirmation Modal */}
      <AnimatePresence>
        {resetStep > 0 && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-dialog"
              style={{ borderColor: "rgba(244, 63, 94, 0.4)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#FB7185", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Trash2 size={20} /> Confirm Reset (Step {resetStep} of 2)
                </h3>
                <button
                  type="button"
                  onClick={() => setResetStep(0)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              {resetStep === 1 ? (
                <div>
                  <p style={{ fontSize: "14.5px", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "20px" }}>
                    Are you sure you want to disconnect your wallet and remove all saved keys from this browser session?
                  </p>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="button" className="secondary-btn full-width" onClick={() => setResetStep(0)}>
                      Cancel
                    </button>
                    <button type="button" className="logout-btn full-width" style={{ justifyContent: "center" }} onClick={() => setResetStep(2)}>
                      <span>Proceed to Final Step</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{
                    background: "rgba(244, 63, 94, 0.1)",
                    border: "1px solid rgba(244, 63, 94, 0.3)",
                    padding: "16px",
                    borderRadius: "14px",
                    marginBottom: "20px",
                    fontSize: "13.5px",
                    color: "#FB7185"
                  }}>
                    <strong>Final Confirmation Warning:</strong> Without a backup of your 12-word seed phrase, all funds on this wallet will be permanently unrecoverable.
                  </div>

                  <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--text-main)", cursor: "pointer", marginBottom: "24px" }}>
                    <input
                      type="checkbox"
                      checked={confirmCheckbox}
                      onChange={(e) => setConfirmCheckbox(e.target.checked)}
                      style={{ width: "18px", height: "18px", accentColor: "var(--danger)" }}
                    />
                    <span>I understand all local wallet data will be permanently deleted.</span>
                  </label>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="button" className="secondary-btn full-width" onClick={() => setResetStep(0)}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="logout-btn full-width"
                      style={{ justifyContent: "center", background: "var(--danger)", color: "white" }}
                      disabled={!confirmCheckbox}
                      onClick={handleFinalReset}
                    >
                      <span>Permanently Delete Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Settings;