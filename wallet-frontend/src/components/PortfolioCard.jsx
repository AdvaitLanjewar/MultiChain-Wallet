import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Send, Download, ShoppingBag, RefreshCw, Sparkles } from "lucide-react";

function PortfolioCard({ totalBalance, change24hPercent, onRefresh, isRefreshing, ethVal, btcVal, solVal }) {
  const isPositive = change24hPercent >= 0;
  const totalVal = Math.max(totalBalance, 0.01);
  const ethPct = Math.round((ethVal / totalVal) * 100) || 33;
  const btcPct = Math.round((btcVal / totalVal) * 100) || 33;
  const solPct = Math.max(0, 100 - ethPct - btcPct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="portfolio-hero-card"
    >
      <div className="portfolio-header">
        <div>
          <div className="portfolio-label">
            <Sparkles size={16} style={{ color: "#A855F7" }} />
            <span>Total Portfolio Balance</span>
          </div>

          <div className="portfolio-amount">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className={`badge-24h ${isPositive ? "positive" : "negative"}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? `+${change24hPercent.toFixed(2)}%` : `${change24hPercent.toFixed(2)}%`} (24h)
            </span>
            <span style={{ color: "var(--text-dim)", fontSize: "13px" }}>Live Market Data</span>
          </div>
        </div>

        <div className="action-buttons-group">
          <Link to="/send" className="action-btn primary">
            <Send size={16} />
            <span>Send</span>
          </Link>
          <Link to="/receive" className="action-btn">
            <Download size={16} />
            <span>Receive</span>
          </Link>
          <Link to="/buy" className="action-btn">
            <ShoppingBag size={16} />
            <span>Buy</span>
          </Link>
          <button 
            type="button" 
            className="action-btn" 
            onClick={onRefresh} 
            disabled={isRefreshing}
            title="Refresh prices and balances"
          >
            <RefreshCw size={16} className={isRefreshing ? "spin" : ""} />
          </button>
        </div>
      </div>

      {/* Asset Breakdown Progress Bar */}
      <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
          <span>Asset Breakdown</span>
          <span>ETH {ethPct}% • BTC {btcPct}% • SOL {solPct}%</span>
        </div>
        <div style={{ height: "6px", width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: "10px", display: "flex", overflow: "hidden" }}>
          <div style={{ width: `${ethPct}%`, background: "var(--accent-eth)", transition: "width 0.5s ease" }} />
          <div style={{ width: `${btcPct}%`, background: "var(--accent-btc)", transition: "width 0.5s ease" }} />
          <div style={{ width: `${solPct}%`, background: "var(--accent-sol)", transition: "width 0.5s ease" }} />
        </div>
      </div>
    </motion.div>
  );
}

export default PortfolioCard;
