import { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import Navbar from "../components/Navbar";
import { getCryptoPrices } from "../services/priceService";
import { getBalances } from "../services/balanceService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { PieChart, TrendingUp, DollarSign, Wallet, RefreshCw } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

function Portfolio() {
  const { wallet } = useWallet();
  const [balances, setBalances] = useState({ ethereum: "0", bitcoin: "0", solana: "0" });
  const [prices, setPrices] = useState({ ethereum: 0, bitcoin: 0, solana: 0 });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const priceData = await getCryptoPrices();
      setPrices(priceData);

      if (wallet) {
        const balanceData = await getBalances(wallet);
        setBalances(balanceData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [wallet]);

  const ethVal = (parseFloat(balances.ethereum) || 0) * (prices.ethereum || 0);
  const btcVal = (parseFloat(balances.bitcoin) || 0) * (prices.bitcoin || 0);
  const solVal = (parseFloat(balances.solana) || 0) * (prices.solana || 0);
  const totalNetWorth = ethVal + btcVal + solVal;

  const chartData = {
    labels: ["Ethereum (ETH)", "Bitcoin (BTC)", "Solana (SOL)"],
    datasets: [
      {
        label: "Value in USD ($)",
        data: [ethVal || 1, btcVal || 1, solVal || 1],
        backgroundColor: ["#627EEA", "#F7931A", "#14F195"],
        borderWidth: 2,
        borderColor: "#1E293B",
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94A3B8",
          font: { size: 14 },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <>
      <Navbar />
      <div className="container dashboard">
        <div className="flex-between">
          <h1 className="dashboard-title">📊 Portfolio Analytics</h1>
          <button className="secondary-btn-sm" onClick={fetchData} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh Rates
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card highlight">
            <div className="stat-icon"><DollarSign size={24} /></div>
            <div>
              <p className="stat-label">Total Portfolio Net Worth</p>
              <h2 className="stat-value">${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><TrendingUp size={24} /></div>
            <div>
              <p className="stat-label">Assets Tracked</p>
              <h2 className="stat-value">3 Blockchains</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><Wallet size={24} /></div>
            <div>
              <p className="stat-label">Active Wallet</p>
              <h2 className="stat-value">{wallet ? "Connected" : "Not Connected"}</h2>
            </div>
          </div>
        </div>

        <div className="grid-2-col">
          <div className="card-box">
            <h3>Asset Allocation</h3>
            <div style={{ height: "260px", position: "relative" }}>
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="card-box">
            <h3>Asset Summary</h3>
            <div className="asset-list">
              <div className="asset-row">
                <span className="coin-dot eth"></span>
                <div className="asset-info">
                  <strong>Ethereum</strong>
                  <span>{balances.ethereum} ETH</span>
                </div>
                <div className="asset-value">
                  <strong>${ethVal.toFixed(2)}</strong>
                  <span>@ ${prices.ethereum?.toLocaleString() || "0"}</span>
                </div>
              </div>

              <div className="asset-row">
                <span className="coin-dot btc"></span>
                <div className="asset-info">
                  <strong>Bitcoin</strong>
                  <span>{balances.bitcoin} BTC</span>
                </div>
                <div className="asset-value">
                  <strong>${btcVal.toFixed(2)}</strong>
                  <span>@ ${prices.bitcoin?.toLocaleString() || "0"}</span>
                </div>
              </div>

              <div className="asset-row">
                <span className="coin-dot sol"></span>
                <div className="asset-info">
                  <strong>Solana</strong>
                  <span>{balances.solana} SOL</span>
                </div>
                <div className="asset-value">
                  <strong>${solVal.toFixed(2)}</strong>
                  <span>@ ${prices.solana?.toLocaleString() || "0"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Portfolio;