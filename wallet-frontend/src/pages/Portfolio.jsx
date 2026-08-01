import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { 
  PieChart, DollarSign, Wallet, RefreshCw, TrendingUp, TrendingDown, 
  BarChart3, Globe2, ShieldCheck, Sparkles 
} from "lucide-react";

import Navbar from "../components/Navbar";
import { useWallet } from "../context/WalletContext";
import { getCryptoPricesWithDetails } from "../services/priceService";
import { getBalances } from "../services/balanceService";

ChartJS.register(ArcElement, Tooltip, Legend);

function Portfolio() {
  const { wallet } = useWallet();
  const [balances, setBalances] = useState({ ethereum: "0", bitcoin: "0", solana: "0" });
  const [prices, setPrices] = useState({
    ethereum: { price: 3480.25, change24h: -1.15 },
    bitcoin: { price: 65420.50, change24h: 2.45 },
    solana: { price: 148.80, change24h: 5.32 },
  });
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const priceData = await getCryptoPricesWithDetails();
      setPrices(priceData);

      if (wallet) {
        const balanceData = await getBalances(wallet);
        setBalances(balanceData);
      }
    } catch (err) {
      console.error("Portfolio data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Actual net worth calculation from real balances and prices
  const ethBalNum = parseFloat(balances.ethereum) || 0;
  const btcBalNum = parseFloat(balances.bitcoin) || 0;
  const solBalNum = parseFloat(balances.solana) || 0;

  const ethVal = ethBalNum * (prices.ethereum?.price || 0);
  const btcVal = btcBalNum * (prices.bitcoin?.price || 0);
  const solVal = solBalNum * (prices.solana?.price || 0);
  const totalNetWorth = ethVal + btcVal + solVal;

  // Percentage calculations for breakdown bar & chart
  const totalValForCalc = Math.max(totalNetWorth, 0.0001);
  const ethPct = totalNetWorth > 0 ? Math.round((ethVal / totalValForCalc) * 100) : 33;
  const btcPct = totalNetWorth > 0 ? Math.round((btcVal / totalValForCalc) * 100) : 33;
  const solPct = totalNetWorth > 0 ? Math.max(0, 100 - ethPct - btcPct) : 34;

  const chartData = {
    labels: ["Ethereum (ETH)", "Bitcoin (BTC)", "Solana (SOL)"],
    datasets: [
      {
        label: "USD Value ($)",
        data: [ethVal || 1, btcVal || 1, solVal || 1],
        backgroundColor: ["#627EEA", "#F7931A", "#14F195"],
        borderWidth: 2,
        borderColor: "#080C14",
      },
    ],
  };

  const chartOptions = {
    animation: {
      duration: 1000, // Animates ONLY ONCE on page load
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94A3B8",
          font: { size: 13, family: "Plus Jakarta Sans" },
          padding: 16,
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Fallback market overview metrics
  const marketOverview = [
    { name: "Global Crypto Market Cap", val: "$2.48 Trillion", change: "+1.85%" },
    { name: "24H Global Volume", val: "$89.4 Billion", change: "+4.12%" },
    { name: "BTC Dominance", val: "54.2%", change: "+0.30%" },
    { name: "ETH Gas Price", val: "18 Gwei", change: "Optimal" },
  ];

  return (
    <>
      <Navbar />

      <div className="container dashboard">
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <h1>Portfolio Analytics 📊</h1>
            <p className="dashboard-subtitle">
              Detailed USD valuations, asset allocations, and live market metrics
            </p>
          </div>

          <button
            type="button"
            className="secondary-btn-sm"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? "spin" : ""} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Top Summary Stats */}
        <div className="stats-banner-grid" style={{ marginBottom: "28px" }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="stat-card highlight"
          >
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="stat-label">Total Portfolio Net Worth</p>
              <h2 className="stat-value">
                ${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stat-card"
          >
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="stat-label">Tracked Blockchains</p>
              <h2 className="stat-value">3 Active Chains</h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stat-card"
          >
            <div className="stat-icon">
              <Wallet size={24} />
            </div>
            <div>
              <p className="stat-label">Wallet Connectivity</p>
              <h2 className="stat-value">{wallet ? "HD Wallet Active" : "No Wallet"}</h2>
            </div>
          </motion.div>
        </div>

        {/* Chart & Asset Summary Grid */}
        <div className="dashboard-grid-2" style={{ marginBottom: "28px" }}>
          {/* Asset Allocation Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
          >
            <div className="widget-title-row">
              <h3>
                <PieChart size={20} style={{ color: "#A855F7" }} />
                <span>Asset Allocation</span>
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>USD Value Ratio</span>
            </div>

            <div style={{ height: "260px", position: "relative", marginTop: "10px" }}>
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Individual Crypto Asset Cards & Profit/Loss */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card"
          >
            <div className="widget-title-row">
              <h3>
                <Sparkles size={20} style={{ color: "#38BDF8" }} />
                <span>Asset Holdings & Performance</span>
              </h3>
            </div>

            <div className="asset-list" style={{ marginTop: "12px" }}>
              {/* Ethereum */}
              <div className="asset-row" style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div className="asset-icon-wrapper eth" style={{ width: "36px", height: "36px", fontSize: "15px" }}>Ξ</div>
                  <div className="asset-info">
                    <strong>Ethereum</strong>
                    <span>{balances.ethereum} ETH</span>
                  </div>
                </div>

                <div className="asset-value">
                  <strong>${ethVal.toFixed(2)}</strong>
                  <span className={`badge-24h ${prices.ethereum?.change24h >= 0 ? "positive" : "negative"}`} style={{ fontSize: "11px", padding: "2px 6px" }}>
                    {prices.ethereum?.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {prices.ethereum?.change24h?.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Bitcoin */}
              <div className="asset-row" style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div className="asset-icon-wrapper btc" style={{ width: "36px", height: "36px", fontSize: "15px" }}>₿</div>
                  <div className="asset-info">
                    <strong>Bitcoin</strong>
                    <span>{balances.bitcoin} BTC</span>
                  </div>
                </div>

                <div className="asset-value">
                  <strong>${btcVal.toFixed(2)}</strong>
                  <span className={`badge-24h ${prices.bitcoin?.change24h >= 0 ? "positive" : "negative"}`} style={{ fontSize: "11px", padding: "2px 6px" }}>
                    {prices.bitcoin?.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {prices.bitcoin?.change24h?.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Solana */}
              <div className="asset-row" style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div className="asset-icon-wrapper sol" style={{ width: "36px", height: "36px", fontSize: "15px" }}>◎</div>
                  <div className="asset-info">
                    <strong>Solana</strong>
                    <span>{balances.solana} SOL</span>
                  </div>
                </div>

                <div className="asset-value">
                  <strong>${solVal.toFixed(2)}</strong>
                  <span className={`badge-24h ${prices.solana?.change24h >= 0 ? "positive" : "negative"}`} style={{ fontSize: "11px", padding: "2px 6px" }}>
                    {prices.solana?.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {prices.solana?.change24h?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Asset Distribution Progress Bar */}
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: "600" }}>
                <span>Portfolio Ratio</span>
                <span>ETH {ethPct}% • BTC {btcPct}% • SOL {solPct}%</span>
              </div>
              <div style={{ height: "6px", width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: "10px", display: "flex", overflow: "hidden" }}>
                <div style={{ width: `${ethPct}%`, background: "var(--accent-eth)", transition: "width 0.5s ease" }} />
                <div style={{ width: `${btcPct}%`, background: "var(--accent-btc)", transition: "width 0.5s ease" }} />
                <div style={{ width: `${solPct}%`, background: "var(--accent-sol)", transition: "width 0.5s ease" }} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Market Overview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <div className="widget-title-row">
            <h3>
              <Globe2 size={20} style={{ color: "#10B981" }} />
              <span>Global Market Overview</span>
            </h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Live Metrics Feed</span>
          </div>

          <div className="stats-banner-grid" style={{ background: "transparent", border: "none", padding: 0 }}>
            {marketOverview.map((item, idx) => (
              <div key={idx} className="stat-card" style={{ background: "rgba(255,255,255,0.02)", padding: "16px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>{item.name}</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)" }}>{item.val}</div>
                  <div style={{ fontSize: "11px", color: item.change.startsWith("+") ? "#34D399" : "#C084FC", fontWeight: "600", marginTop: "2px" }}>
                    {item.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Portfolio;