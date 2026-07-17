import { useNavigate } from "react-router-dom";
import { Wallet, Download } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      <div className="hero">

        <h1>🚀 MultiChain Wallet</h1>

        <p>
          Create, import and manage Ethereum, Bitcoin and Solana wallets
          securely from one application.
        </p>

        <div className="hero-buttons">

          <button
            className="primary-btn"
            onClick={() => navigate("/create-wallet")}
          >
            <Wallet size={20} />
            Create Wallet
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/import-wallet")}
          >
            <Download size={20} />
            Import Wallet
          </button>

        </div>

      </div>

    </div>
  );
}

export default Home;