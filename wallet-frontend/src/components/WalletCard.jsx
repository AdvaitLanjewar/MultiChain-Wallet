import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Download } from "lucide-react";
import CopyButton from "./CopyButton";

function WalletCard({
  title,
  symbol,
  address,
  balance,
  price,
  change24h = 0,
  onSelectReceive,
}) {
  const chainKey = symbol ? symbol.toLowerCase() : "eth";
  const numBalance = parseFloat(balance) || 0;
  const numPrice = typeof price === "number" ? price : (price?.price || 0);
  const numChange = typeof change24h === "number" ? change24h : (price?.change24h || 0);
  const usdValue = numBalance * numPrice;
  const isPositive = numChange >= 0;

  const truncateAddress = (addr) => {
    if (!addr) return "...";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Custom asset icons & logos
  const renderAssetLogo = () => {
    if (symbol === "ETH") {
      return <div className="asset-icon-wrapper eth">Ξ</div>;
    } else if (symbol === "BTC") {
      return <div className="asset-icon-wrapper btc">₿</div>;
    } else if (symbol === "SOL") {
      return <div className="asset-icon-wrapper sol">◎</div>;
    }
    return <div className="asset-icon-wrapper eth">{symbol}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`crypto-card ${chainKey}`}
    >
      <div className="crypto-card-top">
        <div className="asset-badge">
          {renderAssetLogo()}
          <div className="asset-names">
            <h3>{title}</h3>
            <span className="asset-symbol">{symbol}</span>
          </div>
        </div>

        <span className={`badge-24h ${isPositive ? "positive" : "negative"}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isPositive ? `+${numChange.toFixed(2)}%` : `${numChange.toFixed(2)}%`}
        </span>
      </div>

      <div className="crypto-balance-box">
        <div className="crypto-balance-val">
          {balance !== undefined && balance !== "..." ? balance : "0.00"} <span style={{ fontSize: "16px", color: "var(--text-muted)", fontWeight: "600" }}>{symbol}</span>
        </div>
        <div className="crypto-usd-val">
          ≈ ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", fontSize: "13px" }}>
        <span style={{ color: "var(--text-muted)" }}>Market Price</span>
        <span style={{ fontWeight: "700", color: "var(--text-main)" }}>
          {numPrice ? `$${numPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Fetching..."}
        </span>
      </div>

      <div className="crypto-card-bottom">
        <div className="address-pill" title={address}>
          <span>{truncateAddress(address)}</span>
          <CopyButton text={address} label="" successMessage={`${title} address copied!`} />
        </div>

        {onSelectReceive && (
          <button
            type="button"
            className="secondary-btn-sm"
            style={{ padding: "6px 12px", fontSize: "12px" }}
            onClick={() => onSelectReceive(chainKey)}
          >
            <Download size={13} />
            <span>QR Code</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default WalletCard;