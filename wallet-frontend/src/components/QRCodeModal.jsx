import { useState } from "react";
import QRCode from "react-qr-code";
import { QrCode, Download, ShieldCheck } from "lucide-react";
import CopyButton from "./CopyButton";

function QRCodeModal({ wallet, selectedChain = "ethereum", onChainChange }) {
  const [activeChain, setActiveChain] = useState(selectedChain);

  const currentChain = onChainChange ? selectedChain : activeChain;
  const setChain = (chain) => {
    if (onChainChange) onChainChange(chain);
    else setActiveChain(chain);
  };

  const getChainAddress = () => {
    if (!wallet) return "";
    if (currentChain === "ethereum" || currentChain === "eth") return wallet.ethereum?.address || "";
    if (currentChain === "bitcoin" || currentChain === "btc") return wallet.bitcoin?.address || "";
    if (currentChain === "solana" || currentChain === "sol") return wallet.solana?.address || "";
    return wallet.ethereum?.address || "";
  };

  const address = getChainAddress();

  return (
    <div className="glass-card">
      <div className="widget-title-row">
        <h3>
          <QrCode size={20} style={{ color: "#A855F7" }} />
          <span>Receive Crypto</span>
        </h3>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
          <ShieldCheck size={14} style={{ color: "var(--success)" }} /> Verified Address
        </span>
      </div>

      <div className="qr-tabs">
        <button
          type="button"
          className={`qr-tab-btn ${currentChain.startsWith("eth") ? "active" : ""}`}
          onClick={() => setChain("ethereum")}
        >
          Ethereum (ETH)
        </button>
        <button
          type="button"
          className={`qr-tab-btn ${currentChain.startsWith("btc") ? "active" : ""}`}
          onClick={() => setChain("bitcoin")}
        >
          Bitcoin (BTC)
        </button>
        <button
          type="button"
          className={`qr-tab-btn ${currentChain.startsWith("sol") ? "active" : ""}`}
          onClick={() => setChain("solana")}
        >
          Solana (SOL)
        </button>
      </div>

      <div className="qr-box-inner">
        <QRCode value={address || "NEXUS_WALLET"} size={160} />
      </div>

      <div className="address-box">
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          Deposit {currentChain.toUpperCase()} to this address:
        </span>
        <div className="address-text" style={{ fontSize: "13px", color: "#38BDF8" }}>
          {address || "Loading address..."}
        </div>
        <CopyButton text={address} label="Copy Receive Address" successMessage="Address copied to clipboard!" />
      </div>
    </div>
  );
}

export default QRCodeModal;