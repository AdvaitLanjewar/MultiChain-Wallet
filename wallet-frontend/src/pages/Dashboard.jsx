import Navbar from "../components/Navbar";
import WalletCard from "../components/WalletCard";
import { Navigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { useState, useEffect } from "react";
import QRCodeModal from "../components/QRCodeModal";
import { getCryptoPrices } from "../services/priceService";
import { getBalances } from "../services/balanceService";
function Dashboard() {
  const [showMnemonic, setShowMnemonic] = useState(false);
  const { wallet } = useWallet();
  const [balances, setBalances] = useState({
  ethereum: "...",
  bitcoin: "...",
  solana: "...",
});

const [prices, setPrices] = useState({
  ethereum: 0,
  bitcoin: 0,
  solana: 0,
});
useEffect(() => {
  async function loadData() {
    const balanceData = await getBalances(wallet);
    setBalances(balanceData);

    const priceData = await getCryptoPrices();
    setPrices(priceData);
  }

  if (wallet) {
    loadData();
  }
}, [wallet]);

  if (!wallet) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Navbar />

      <div className="dashboard">

        <h1 className="dashboard-title">
          Welcome 👋
        </h1>

        <div className="wallet-grid">

          <WalletCard
          title="Ethereum"
          symbol="ETH"
          address={wallet.ethereum.address}
           balance={balances.ethereum}
          price={prices.ethereum}
          />

          <WalletCard
            title="Bitcoin"
             symbol="BTC"
             address={wallet.bitcoin.address}
             balance={balances.bitcoin}
            price={prices.bitcoin}
            />

          <WalletCard
           title="Solana"
           symbol="SOL"
           address={wallet.solana.address}
            balance={balances.solana}
           price={prices.solana}
/>
          <QRCodeModal address={wallet.ethereum.address} />

        </div>
<div className="wallet-card">
  <h2>Recovery Phrase</h2>

  <button onClick={() => setShowMnemonic(!showMnemonic)}>
    {showMnemonic ? "Hide" : "Show"} Recovery Phrase
  </button>

  {showMnemonic && (
    <p className="address">{wallet.mnemonic}</p>
  )}
</div>
      </div>
    </>
  );
}

export default Dashboard;