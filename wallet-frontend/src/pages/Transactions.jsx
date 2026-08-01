import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, Filter, Search, ArrowUpRight, ArrowDownLeft, ExternalLink, 
  CheckCircle2, Clock, XCircle, X, ShieldCheck, Sparkles, ChevronRight 
} from "lucide-react";

import Navbar from "../components/Navbar";

function Transactions() {
  const [filterChain, setFilterChain] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);

  // Pre-populated demo transactions list with "Demo Data" badge requirement
  const sampleTransactions = [
    {
      id: "tx-101",
      chain: "ethereum",
      symbol: "ETH",
      type: "receive",
      amount: "+ 0.050 ETH",
      amountNum: 0.05,
      usdVal: "$174.01",
      from: "0x71C...9B3",
      fromFull: "0x71C839092817293817293819B3",
      to: "My Ethereum Wallet",
      toFull: "0x19283746501928374650192837",
      time: "10 mins ago",
      timestamp: "Aug 01, 2026 21:55:00",
      status: "Confirmed",
      hash: "0x8f32a9102837192837192837e71c",
      isDemo: true,
    },
    {
      id: "tx-102",
      chain: "solana",
      symbol: "SOL",
      type: "send",
      amount: "- 1.200 SOL",
      amountNum: 1.2,
      usdVal: "$178.56",
      from: "My Solana Wallet",
      fromFull: "5K9a8192837192837192837xM",
      to: "5K9a...7xM",
      toFull: "5K9a89102938172938172937xM",
      time: "2 hours ago",
      timestamp: "Aug 01, 2026 20:05:00",
      status: "Confirmed",
      hash: "4xN98910293817293817293mQ8p",
      isDemo: true,
    },
    {
      id: "tx-103",
      chain: "bitcoin",
      symbol: "BTC",
      type: "receive",
      amount: "+ 0.002 BTC",
      amountNum: 0.002,
      usdVal: "$130.84",
      from: "bc1q...89w",
      fromFull: "bc1q891029381729381729389w",
      to: "My Bitcoin Wallet",
      toFull: "bc1q1928374650192837465089w",
      time: "1 day ago",
      timestamp: "Jul 31, 2026 18:30:00",
      status: "Confirmed",
      hash: "7f928910293817293817293a38b",
      isDemo: true,
    },
    {
      id: "tx-104",
      chain: "ethereum",
      symbol: "ETH",
      type: "send",
      amount: "- 0.015 ETH",
      amountNum: 0.015,
      usdVal: "$52.20",
      from: "My Ethereum Wallet",
      fromFull: "0x19283746501928374650192837",
      to: "0x98F...1A2",
      toFull: "0x98F19283746501928374651A2",
      time: "2 days ago",
      timestamp: "Jul 30, 2026 14:15:00",
      status: "Pending",
      hash: "0x3b1928374650192837465099c",
      isDemo: true,
    },
    {
      id: "tx-105",
      chain: "solana",
      symbol: "SOL",
      type: "send",
      amount: "- 5.000 SOL",
      amountNum: 5.0,
      usdVal: "$744.00",
      from: "My Solana Wallet",
      fromFull: "5K9a8192837192837192837xM",
      to: "8Z2p...9qW",
      toFull: "8Z2p19283746501928374659qW",
      time: "3 days ago",
      timestamp: "Jul 29, 2026 11:20:00",
      status: "Failed",
      hash: "9pW192837465019283746500ff",
      isDemo: true,
    },
  ];

  // Filter & Search Logic
  const filteredTxs = sampleTransactions.filter((tx) => {
    // Chain filter
    if (filterChain !== "all" && tx.chain !== filterChain) return false;
    // Status filter
    if (filterStatus !== "all" && tx.status.toLowerCase() !== filterStatus.toLowerCase()) return false;
    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchChain = tx.chain.toLowerCase().includes(q);
      const matchType = tx.type.toLowerCase().includes(q);
      const matchAmount = tx.amount.toLowerCase().includes(q);
      const matchFrom = tx.fromFull.toLowerCase().includes(q);
      const matchTo = tx.toFull.toLowerCase().includes(q);
      const matchHash = tx.hash.toLowerCase().includes(q);
      return matchChain || matchType || matchAmount || matchFrom || matchTo || matchHash;
    }
    return true;
  });

  // Block explorer helper
  const getExplorerLink = (tx) => {
    if (tx.chain === "ethereum") {
      return `https://sepolia.etherscan.io/tx/${tx.hash}`;
    } else if (tx.chain === "bitcoin") {
      return `https://www.blockchain.com/explorer/transactions/btc-testnet/${tx.hash}`;
    } else {
      return `https://solscan.io/tx/${tx.hash}?cluster=devnet`;
    }
  };

  const getStatusPill = (status) => {
    const s = status.toLowerCase();
    if (s === "confirmed") {
      return (
        <span className="status-badge confirmed">
          <CheckCircle2 size={12} /> Confirmed
        </span>
      );
    } else if (s === "pending") {
      return (
        <span className="status-badge pending">
          <Clock size={12} /> Pending
        </span>
      );
    } else {
      return (
        <span className="status-badge failed">
          <XCircle size={12} /> Failed
        </span>
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="container dashboard">
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <h1>Transaction History 💳</h1>
            <p className="dashboard-subtitle">
              Audit and track all multi-chain transfers and contract interactions
            </p>
          </div>

          <div className="badge-demo-data">
            <Sparkles size={13} />
            <span>Demo Data Mode</span>
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="glass-card" style={{ marginBottom: "24px", padding: "16px 20px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            {/* Search Input */}
            <div className="search-box-wrapper">
              <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                className="search-box-input"
                placeholder="Search by address, hash, token, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Dropdowns */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Filter size={14} style={{ color: "var(--text-muted)" }} />
                <select
                  className="select-input"
                  style={{ padding: "8px 12px", fontSize: "13px", width: "auto" }}
                  value={filterChain}
                  onChange={(e) => setFilterChain(e.target.value)}
                >
                  <option value="all">All Chains</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="bitcoin">Bitcoin</option>
                  <option value="solana">Solana</option>
                </select>
              </div>

              <select
                className="select-input"
                style={{ padding: "8px 12px", fontSize: "13px", width: "auto" }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="glass-card" style={{ padding: "0" }}>
          {filteredTxs.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <History size={40} style={{ color: "var(--text-dim)", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>No Transactions Found</h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                No records match your search query or selected filter criteria.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="tx-desktop-table" style={{ overflowX: "auto" }}>
                <table className="tx-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Network</th>
                      <th>Amount</th>
                      <th>Recipient / Sender</th>
                      <th>Timestamp</th>
                      <th>Status</th>
                      <th>Explorer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTxs.map((tx) => (
                      <tr key={tx.id} className="tx-table-row" onClick={() => setSelectedTx(tx)}>
                        <td>
                          <span className={`tx-badge ${tx.type}`}>
                            {tx.type === "receive" ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                            {tx.type.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`chain-pill ${tx.chain}`}>{tx.chain.toUpperCase()}</span>
                        </td>
                        <td className={tx.type === "receive" ? "green-text font-bold" : "font-bold"}>
                          {tx.amount}
                        </td>
                        <td className="dim-text" style={{ fontFamily: "monospace", fontSize: "12.5px" }}>
                          {tx.type === "receive" ? `From: ${tx.from}` : `To: ${tx.to}`}
                        </td>
                        <td className="dim-text">{tx.time}</td>
                        <td>{getStatusPill(tx.status)}</td>
                        <td>
                          <a
                            href={getExplorerLink(tx)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="secondary-btn-sm"
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                            title="View on Block Explorer"
                          >
                            <ExternalLink size={12} />
                            <span>Explorer</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Transaction Cards List */}
              <div className="tx-mobile-list" style={{ padding: "16px" }}>
                {filteredTxs.map((tx) => (
                  <div key={tx.id} className="tx-mobile-card" onClick={() => setSelectedTx(tx)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className={`tx-badge ${tx.type}`}>
                          {tx.type === "receive" ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                          {tx.type.toUpperCase()}
                        </span>
                        <span className={`chain-pill ${tx.chain}`}>{tx.chain.toUpperCase()}</span>
                      </div>
                      {getStatusPill(tx.status)}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                      <div>
                        <div style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-muted)" }}>
                          {tx.type === "receive" ? `From: ${tx.from}` : `To: ${tx.to}`}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "2px" }}>{tx.time}</div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div className={tx.type === "receive" ? "green-text font-bold" : "font-bold"} style={{ fontSize: "15px" }}>
                          {tx.amount}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{tx.usdVal}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Transaction Details Side Drawer */}
      <AnimatePresence>
        {selectedTx && (
          <div className="drawer-overlay" onClick={() => setSelectedTx(null)}>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="drawer-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className={`tx-icon-box ${selectedTx.type}`}>
                      {selectedTx.type === "receive" ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-main)" }}>
                        {selectedTx.type === "receive" ? "Received Crypto" : "Sent Crypto"}
                      </h3>
                      <span className={`chain-pill ${selectedTx.chain}`}>{selectedTx.chain.toUpperCase()} Network</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTx(null)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Amount Header */}
                <div style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-color)",
                  padding: "20px",
                  borderRadius: "16px",
                  textAlign: "center",
                  marginBottom: "24px"
                }}>
                  <div className={selectedTx.type === "receive" ? "green-text font-bold" : "font-bold"} style={{ fontSize: "28px", fontFamily: "Space Grotesk, sans-serif" }}>
                    {selectedTx.amount}
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
                    ≈ {selectedTx.usdVal} USD
                  </div>
                </div>

                {/* Details Breakdown List */}
                <div className="tx-preview-card">
                  <div className="tx-preview-row">
                    <span className="label">Status</span>
                    <span className="val">{getStatusPill(selectedTx.status)}</span>
                  </div>

                  <div className="tx-preview-row">
                    <span className="label">Sender Address</span>
                    <span className="val" style={{ fontFamily: "monospace", fontSize: "12px", wordBreak: "break-all" }}>
                      {selectedTx.fromFull}
                    </span>
                  </div>

                  <div className="tx-preview-row">
                    <span className="label">Recipient Address</span>
                    <span className="val" style={{ fontFamily: "monospace", fontSize: "12px", wordBreak: "break-all" }}>
                      {selectedTx.toFull}
                    </span>
                  </div>

                  <div className="tx-preview-row">
                    <span className="label">Timestamp</span>
                    <span className="val">{selectedTx.timestamp}</span>
                  </div>

                  <div className="tx-preview-row">
                    <span className="label">Transaction Hash</span>
                    <span className="val" style={{ fontFamily: "monospace", fontSize: "11.5px", color: "#38BDF8", wordBreak: "break-all" }}>
                      {selectedTx.hash}
                    </span>
                  </div>

                  <div className="tx-preview-row">
                    <span className="label">Data Record Type</span>
                    <span className="val">
                      <span className="badge-demo-data">Demo Data</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <a
                  href={getExplorerLink(selectedTx)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-btn full-width"
                  style={{ textDecoration: "none" }}
                >
                  <ExternalLink size={16} />
                  <span>Open Block Explorer</span>
                </a>

                <button
                  type="button"
                  className="secondary-btn full-width"
                  onClick={() => setSelectedTx(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Transactions;