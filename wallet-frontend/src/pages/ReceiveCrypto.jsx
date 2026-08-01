import { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { Download, Share2, ShieldCheck, AlertTriangle, QrCode as QrIcon } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import CopyButton from "../components/CopyButton";
import { useWallet } from "../context/WalletContext";

function ReceiveCrypto() {
  const { wallet } = useWallet();
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const qrRef = useRef(null);

  if (!wallet) {
    return <Navigate to="/" />;
  }

  const getChainDetails = () => {
    if (selectedChain === "ethereum" || selectedChain === "eth") {
      return {
        name: "Ethereum",
        symbol: "ETH",
        color: "#627EEA",
        icon: "Ξ",
        address: wallet.ethereum?.address || "",
      };
    } else if (selectedChain === "bitcoin" || selectedChain === "btc") {
      return {
        name: "Bitcoin",
        symbol: "BTC",
        color: "#F7931A",
        icon: "₿",
        address: wallet.bitcoin?.address || "",
      };
    } else {
      return {
        name: "Solana",
        symbol: "SOL",
        color: "#14F195",
        icon: "◎",
        address: wallet.solana?.address || "",
      };
    }
  };

  const chainInfo = getChainDetails();

  // Export QR SVG to PNG image download
  const handleDownloadQR = () => {
    try {
      const svgElement = qrRef.current?.querySelector("svg");
      if (!svgElement) {
        toast.error("QR element unavailable");
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width + 40;
        canvas.height = img.height + 40;
        if (ctx) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 20, 20);

          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = `nexus-${selectedChain}-deposit-qr.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
          toast.success("QR Code downloaded successfully!");
        }
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } catch (err) {
      console.error("Error downloading QR Code:", err);
      toast.error("Failed to download QR code image.");
    }
  };

  // Native share address or clipboard copy fallback
  const handleShareAddress = async () => {
    if (!chainInfo.address) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Nexus Wallet ${chainInfo.name} Address`,
          text: `Deposit ${chainInfo.symbol} to my Nexus Wallet address:\n${chainInfo.address}`,
        });
        toast.success("Share menu opened!");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(chainInfo.address);
        toast.success("Address copied to clipboard for sharing!");
      } catch (e) {
        toast.error("Failed to share address");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="container dashboard">
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <h1>Receive Cryptocurrency 📥</h1>
            <p className="dashboard-subtitle">
              Display your public multi-chain deposit addresses and QR codes
            </p>
          </div>
        </div>

        <div className="max-w-xl" style={{ margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ textAlign: "center" }}
          >
            {/* Network Selector Tabs */}
            <div className="network-selector-grid">
              <button
                type="button"
                className={`network-select-btn eth ${selectedChain === "ethereum" ? "active" : ""}`}
                onClick={() => setSelectedChain("ethereum")}
              >
                <span>Ξ</span>
                <span>Ethereum</span>
              </button>

              <button
                type="button"
                className={`network-select-btn btc ${selectedChain === "bitcoin" ? "active" : ""}`}
                onClick={() => setSelectedChain("bitcoin")}
              >
                <span>₿</span>
                <span>Bitcoin</span>
              </button>

              <button
                type="button"
                className={`network-select-btn sol ${selectedChain === "solana" ? "active" : ""}`}
                onClick={() => setSelectedChain("solana")}
              >
                <span>◎</span>
                <span>Solana</span>
              </button>
            </div>

            {/* QR Code Container */}
            <div style={{ margin: "24px 0" }} ref={qrRef}>
              <div className="qr-box-inner" style={{ padding: "20px" }}>
                <QRCode
                  value={chainInfo.address || "NEXUS_WALLET"}
                  size={200}
                  bgColor="#FFFFFF"
                  fgColor="#080C14"
                />
              </div>
            </div>

            {/* Address Box & Action Buttons */}
            <div className="address-box" style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>
                Your {chainInfo.name} ({chainInfo.symbol}) Deposit Address
              </div>

              <div className="address-text" style={{ fontSize: "14px", color: "#38BDF8", margin: "4px 0 8px 0" }}>
                {chainInfo.address || "Address unavailable"}
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                <CopyButton
                  text={chainInfo.address}
                  label="Copy Address"
                  successMessage={`${chainInfo.name} address copied!`}
                />

                <button type="button" className="secondary-btn-sm" onClick={handleDownloadQR}>
                  <Download size={14} />
                  <span>Download QR</span>
                </button>

                <button type="button" className="secondary-btn-sm" onClick={handleShareAddress}>
                  <Share2 size={14} />
                  <span>Share Address</span>
                </button>
              </div>
            </div>

            {/* Receive Instructions */}
            <div style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-color)",
              padding: "16px",
              borderRadius: "14px",
              textAlign: "left",
              marginBottom: "16px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", fontWeight: "700", marginBottom: "6px", color: "var(--text-main)" }}>
                <AlertTriangle size={16} style={{ color: "#FBBF24" }} />
                <span>Receive Instructions</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Send only <strong>{chainInfo.name} ({chainInfo.symbol})</strong> assets to this deposit address. Sending any other tokens or cross-chain assets may result in permanent loss.
              </p>
            </div>

            {/* Security Notice */}
            <div style={{
              background: "rgba(16, 185, 129, 0.06)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              padding: "14px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textAlign: "left"
            }}>
              <ShieldCheck size={20} style={{ color: "#34D399", flexShrink: 0 }} />
              <div style={{ fontSize: "12.5px", color: "#A7F3D0" }}>
                <strong>Verified Non-Custodial Address:</strong> Cryptographically linked to your seed phrase. Only you control the private keys for deposits sent here.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default ReceiveCrypto;