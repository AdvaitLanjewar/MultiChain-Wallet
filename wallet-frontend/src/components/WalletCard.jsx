import { Copy, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function WalletCard({
  title,
  symbol,
  address,
  balance,
  price,
}) {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);

      setCopied(true);
      toast.success(`${title} address copied!`);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy address.");
      console.error(error);
    }
  };

  return (
    <div className="wallet-card">
      <h2>{title}</h2>

      <p>
        <strong>Symbol:</strong> {symbol}
      </p>

      <p className="address">
        <strong>Address:</strong>
        <br />
        {address}
      </p>

      <h3>
        Balance: {balance ?? "..."} {symbol}
      </h3>

      <p>
        <strong>Market Price:</strong>{" "}
        {price ? `$${price.toLocaleString()}` : "Loading..."}
      </p>

      <button type="button" onClick={copyAddress}>
        {copied ? <Check size={18} /> : <Copy size={18} />}
        {copied ? " Copied" : " Copy Address"}
      </button>
    </div>
  );
}

export default WalletCard;