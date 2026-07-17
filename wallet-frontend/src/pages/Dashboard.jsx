import Navbar from "../components/Navbar";
import WalletCard from "../components/WalletCard";
import { Navigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

function Dashboard() {
  const { wallet } = useWallet();

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
          />

          <WalletCard
            title="Bitcoin"
            symbol="BTC"
            address={wallet.bitcoin.address}
          />

          <WalletCard
            title="Solana"
            symbol="SOL"
            address={wallet.solana.address}
          />

        </div>

      </div>
    </>
  );
}

export default Dashboard;