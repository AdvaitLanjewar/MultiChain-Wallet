import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import Navbar from "../components/Navbar";
import QRCode from "react-qr-code";
import { Copy, Check, Download, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

function ReceiveCrypto() {
  const { wallet } = useWallet();
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [copied, setCopied] = useState(false);

  const getAddress = () => {
    if (!wallet) return "";
    if (selectedChain === "ethereum") return wallet.ethereum?.address || "";
    if (selectedChain === "bitcoin") return wallet.bitcoin?.address || "";
    if (selectedChain === "solana") return wallet.solana?.address || "";
    return "";
  };

  const address = getAddress();

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Address copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <Navbar />
      <div className="container dashboard">
        <h1 className="dashboard-title">📥 Receive Crypto</h1>

        {!wallet ? (
          <div className="card-box text-center">
            <AlertCircle size={40} className="warning-icon" />
            <h2>No Wallet Connected</h2>
            <p>Please create or import a wallet to view your deposit addresses and QR codes.</p>
          </div>
        ) : (
          <div className="card-box max-w-xl text-center">
            <div className="tab-group">
              <button
                className={`tab-btn ${selectedChain === "ethereum" ? "active" : ""}`}
                onClick={() => setSelectedChain("ethereum")}
              >
                Ethereum (ETH)
              </button>
              <button
                className={`tab-btn ${selectedChain === "bitcoin" ? "active" : ""}`}
                onClick={() => setSelectedChain("bitcoin")}
              >
                Bitcoin (BTC)
              </button>
              <button
                className={`tab-btn ${selectedChain === "solana" ? "active" : ""}`}
                onClick={() => setSelectedChain("solana")}
              >
                Solana (SOL)
              </button>
            </div>

            <div className="qr-container">
              {address ? (
                <div className="qr-wrapper">
                  <QRCode value={address} size={200} bgColor="#FFFFFF" fgColor="#0F172A" />
                </div>
              ) : (
                <p>Address unavailable</p>
              )}
            </div>

            <div className="address-box">
              <p className="address-label">Your {selectedChain.toUpperCase()} Deposit Address</p>
              <code className="address-text">{address}</code>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Address"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ReceiveCrypto;