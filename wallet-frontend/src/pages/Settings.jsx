import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import Navbar from "../components/Navbar";
import { Settings as SettingsIcon, Shield, Globe, Key, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Settings() {
  const { wallet, logoutWallet } = useWallet();
  const navigate = useNavigate();
  const [network, setNetwork] = useState("testnet");
  const [currency, setCurrency] = useState("USD");
  const [showKey, setShowKey] = useState(false);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to disconnect and clear wallet data from this browser?")) {
      logoutWallet();
      toast.success("Wallet data cleared.");
      navigate("/");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container dashboard">
        <h1 className="dashboard-title">⚙️ Wallet Settings</h1>

        <div className="card-box max-w-xl">
          <div className="setting-section">
            <h3><Globe size={18} /> Network & Node Configuration</h3>
            <div className="form-group">
              <label htmlFor="network-mode">Blockchain Environment</label>
              <select
                id="network-mode"
                className="select-input"
                value={network}
                onChange={(e) => {
                  setNetwork(e.target.value);
                  toast.success(`Switched network mode to ${e.target.value.toUpperCase()}`);
                }}
              >
                <option value="testnet">Testnet / Devnet (Sepolia, Solana Devnet)</option>
                <option value="mainnet">Mainnet Production (Live Networks)</option>
              </select>
            </div>
          </div>

          <div className="setting-section">
            <h3><Shield size={18} /> Display Preferences</h3>
            <div className="form-group">
              <label htmlFor="currency-mode">Default Currency</label>
              <select
                id="currency-mode"
                className="select-input"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD ($ United States Dollar)</option>
                <option value="EUR">EUR (€ Euro)</option>
                <option value="INR">INR (₹ Indian Rupee)</option>
              </select>
            </div>
          </div>

          {wallet && (
            <div className="setting-section">
              <h3><Key size={18} /> Security & Backup</h3>
              <p className="dim-text">Secret Recovery Mnemonic Phrase:</p>
              <button
                className="secondary-btn-sm"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? "Hide Phrase" : "Show Recovery Phrase"}
              </button>
              {showKey && (
                <div className="mnemonic-box">
                  <code>{wallet.mnemonic}</code>
                </div>
              )}
            </div>
          )}

          <div className="setting-section danger-zone">
            <h3><Trash2 size={18} /> Danger Zone</h3>
            <p>Disconnect wallet and remove saved seed phrase from browser local storage.</p>
            <button className="danger-btn" onClick={handleReset}>
              Reset & Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;