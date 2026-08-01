import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import PortfolioCard from "../components/PortfolioCard";
import WalletCard from "../components/WalletCard";
import QRCodeModal from "../components/QRCodeModal";
import RecoveryPhraseCard from "../components/RecoveryPhraseCard";
import RecentActivityWidget from "../components/RecentActivityWidget";

import { useWallet } from "../context/WalletContext";
import { getCryptoPricesWithDetails } from "../services/priceService";
import { getBalances } from "../services/balanceService";

function Dashboard() {
  const { wallet } = useWallet();
  const [selectedQrChain, setSelectedQrChain] = useState("ethereum");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [balances, setBalances] = useState({
    ethereum: "...",
    bitcoin: "...",
    solana: "...",
  });

  const [prices, setPrices] = useState({
    bitcoin: { price: 0, change24h: 0 },
    ethereum: { price: 0, change24h: 0 },
    solana: { price: 0, change24h: 0 },
  });

  const loadData = useCallback(async (showToast = false) => {
    if (!wallet) return;

    if (showToast) setIsRefreshing(true);

    try {
      const [balanceData, priceData] = await Promise.all([
        getBalances(wallet),
        getCryptoPricesWithDetails(),
      ]);

      setBalances(balanceData);
      setPrices(priceData);

      if (showToast) {
        toast.success("Balances & live prices updated");
      }
    } catch (error) {
      console.error("Dashboard error loading data:", error);
      if (showToast) toast.error("Failed to refresh live data");
    } finally {
      setIsRefreshing(false);
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet) {
      loadData();
    }
  }, [wallet, loadData]);

  if (!wallet) {
    return <Navigate to="/" />;
  }

  // Calculations for total portfolio
  const ethBalNum = parseFloat(balances.ethereum) || 0;
  const btcBalNum = parseFloat(balances.bitcoin) || 0;
  const solBalNum = parseFloat(balances.solana) || 0;

  const ethVal = ethBalNum * (prices.ethereum?.price || 0);
  const btcVal = btcBalNum * (prices.bitcoin?.price || 0);
  const solVal = solBalNum * (prices.solana?.price || 0);

  const totalPortfolioValue = ethVal + btcVal + solVal;

  // Weighted average 24h change
  const totalValForCalc = totalPortfolioValue || 1;
  const weightedChange =
    (ethVal * (prices.ethereum?.change24h || 0) +
      btcVal * (prices.bitcoin?.change24h || 0) +
      solVal * (prices.solana?.change24h || 0)) /
    totalValForCalc;

  const overall24hChange = totalPortfolioValue > 0 ? weightedChange : 1.25;

  return (
    <>
      <Navbar />

      <div className="container dashboard">
        {/* Header Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="dashboard-header"
        >
          <div className="dashboard-title-group">
            <h1>Welcome Back 👋</h1>
            <p className="dashboard-subtitle">
              Overview of your secure multi-chain wallet assets and activity
            </p>
          </div>
        </motion.div>

        {/* Total Portfolio Hero Card */}
        <PortfolioCard
          totalBalance={totalPortfolioValue}
          change24hPercent={overall24hChange}
          onRefresh={() => loadData(true)}
          isRefreshing={isRefreshing}
          ethVal={ethVal}
          btcVal={btcVal}
          solVal={solVal}
        />

        {/* Crypto Wallet Balance Cards Grid */}
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "var(--text-main)" }}>
            Your Crypto Assets
          </h2>
          <div className="wallet-grid">
            <WalletCard
              title="Ethereum"
              symbol="ETH"
              address={wallet.ethereum?.address}
              balance={balances.ethereum}
              price={prices.ethereum?.price}
              change24h={prices.ethereum?.change24h}
              onSelectReceive={(chain) => setSelectedQrChain(chain)}
            />

            <WalletCard
              title="Bitcoin"
              symbol="BTC"
              address={wallet.bitcoin?.address}
              balance={balances.bitcoin}
              price={prices.bitcoin?.price}
              change24h={prices.bitcoin?.change24h}
              onSelectReceive={(chain) => setSelectedQrChain(chain)}
            />

            <WalletCard
              title="Solana"
              symbol="SOL"
              address={wallet.solana?.address}
              balance={balances.solana}
              price={prices.solana?.price}
              change24h={prices.solana?.change24h}
              onSelectReceive={(chain) => setSelectedQrChain(chain)}
            />
          </div>
        </div>

        {/* Lower Dashboard Grid (Activity Widget, QR Receive, & Recovery Phrase) */}
        <div className="dashboard-grid-2">
          {/* Left Column: Recent Activity Widget */}
          <RecentActivityWidget />

          {/* Right Column: QR Receive & Recovery Phrase */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <QRCodeModal
              wallet={wallet}
              selectedChain={selectedQrChain}
              onChainChange={(chain) => setSelectedQrChain(chain)}
            />

            <RecoveryPhraseCard mnemonic={wallet.mnemonic} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;