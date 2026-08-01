import { useState } from "react";
import Navbar from "../components/Navbar";
import { ShoppingBag, CreditCard, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

function BuyCrypto() {
  const [fiatAmount, setFiatAmount] = useState("100");
  const [selectedCrypto, setSelectedCrypto] = useState("ETH");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const rates = {
    ETH: 3300,
    BTC: 96000,
    SOL: 180,
  };

  const currentRate = rates[selectedCrypto] || 1;
  const estimatedCrypto = (parseFloat(fiatAmount) || 0) / currentRate;

  const handleBuy = (e) => {
    e.preventDefault();
    if (!fiatAmount || parseFloat(fiatAmount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Purchase simulation complete! Bought ${estimatedCrypto.toFixed(4)} ${selectedCrypto} for $${fiatAmount} USD.`);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div className="container dashboard">
        <h1 className="dashboard-title">🛍️ Buy Crypto (Fiat Gateway)</h1>

        <div className="card-box max-w-xl">
          <form onSubmit={handleBuy} className="form-group">
            <div>
              <label htmlFor="fiat-amount">You Pay (USD)</label>
              <div className="input-with-addon">
                <span className="addon">$</span>
                <input
                  id="fiat-amount"
                  type="number"
                  className="text-input"
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(e.target.value)}
                  min="10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="crypto-select">You Receive</label>
              <select
                id="crypto-select"
                className="select-input"
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
              >
                <option value="ETH">Ethereum (ETH)</option>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="SOL">Solana (SOL)</option>
              </select>
            </div>

            <div className="conversion-preview">
              <span>Estimated Rate: 1 {selectedCrypto} ≈ ${currentRate.toLocaleString()} USD</span>
              <h3 className="est-receive">You get ≈ {estimatedCrypto.toFixed(6)} {selectedCrypto}</h3>
            </div>

            <div>
              <label htmlFor="payment-method">Payment Method</label>
              <select
                id="payment-method"
                className="select-input"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="card">Credit / Debit Card (Visa / Mastercard)</option>
                <option value="bank">Bank Transfer (ACH / SEPA)</option>
                <option value="apple">Apple Pay / Google Pay</option>
              </select>
            </div>

            <button type="submit" className="primary-btn full-width" disabled={loading}>
              <ShoppingBag size={18} />
              {loading ? "Processing Order..." : `Buy ${selectedCrypto} Now`}
            </button>

            <p className="security-note"><ShieldCheck size={16} /> Encrypted & Secure Fiat-to-Crypto Onramp</p>
          </form>
        </div>
      </div>
    </>
  );
}

export default BuyCrypto;