import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { Send, CheckCircle, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

function SendCrypto() {
  const { wallet } = useWallet();
  const [chain, setChain] = useState("ethereum");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txResult, setTxResult] = useState(null);

  const getPrivateKeyForChain = () => {
    if (!wallet) return "";
    if (chain === "ethereum") return wallet.ethereum?.privateKey || "";
    if (chain === "solana") return wallet.solana?.privateKey || "";
    if (chain === "bitcoin") return wallet.bitcoin?.privateKey || "";
    return "";
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!toAddress || !amount) {
      toast.error("Please fill in recipient address and amount.");
      return;
    }

    const privateKey = getPrivateKeyForChain();
    if (!privateKey) {
      toast.error(`No private key found for ${chain}. Please connect your wallet.`);
      return;
    }

    setLoading(true);
    setTxResult(null);

    try {
      const response = await API.post("/transaction", {
        chain,
        privateKey,
        to: toAddress,
        amount: parseFloat(amount),
      });

      if (response.data && response.data.success !== false) {
        setTxResult(response.data);
        toast.success(`Transaction sent successfully on ${chain.toUpperCase()}!`);
        setToAddress("");
        setAmount("");
      } else {
        toast.error(response.data.message || "Transaction failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Transaction failed to broadcast");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container dashboard">
        <h1 className="dashboard-title">📤 Send Crypto</h1>

        <div className="card-box max-w-xl">
          <form onSubmit={handleSend} className="form-group">
            <div>
              <label htmlFor="chain-select">Select Network / Blockchain</label>
              <select
                id="chain-select"
                className="select-input"
                value={chain}
                onChange={(e) => setChain(e.target.value)}
              >
                <option value="ethereum">Ethereum (ETH / Sepolia)</option>
                <option value="solana">Solana (SOL / Devnet)</option>
                <option value="bitcoin">Bitcoin (BTC / Testnet)</option>
              </select>
            </div>

            <div>
              <label htmlFor="recipient">Recipient Address</label>
              <input
                id="recipient"
                type="text"
                className="text-input"
                placeholder={`Enter ${chain.toUpperCase()} wallet address`}
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                step="any"
                className="text-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="primary-btn full-width" disabled={loading}>
              <Send size={18} />
              {loading ? "Broadcasting Transaction..." : `Send ${chain.toUpperCase()}`}
            </button>
          </form>

          {txResult && (
            <div className="result-card">
              <CheckCircle size={24} color="#10B981" />
              <div>
                <h3>Transaction Broadcast Complete!</h3>
                <p className="tx-hash">Hash: {txResult.transactionHash || txResult.txHash || JSON.stringify(txResult)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SendCrypto;