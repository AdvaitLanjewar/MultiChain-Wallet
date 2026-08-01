import { Link } from "react-router-dom";
import { History, ArrowDownLeft, ArrowUpRight, ChevronRight, CheckCircle2 } from "lucide-react";

function RecentActivityWidget() {
  const recentTransactions = [
    {
      id: "tx-1",
      chain: "ETH",
      type: "receive",
      title: "Received Ethereum",
      amount: "+0.050 ETH",
      time: "10 mins ago",
      status: "Confirmed",
    },
    {
      id: "tx-2",
      chain: "SOL",
      type: "send",
      title: "Sent Solana",
      amount: "-1.200 SOL",
      time: "2 hours ago",
      status: "Confirmed",
    },
    {
      id: "tx-3",
      chain: "BTC",
      type: "receive",
      title: "Received Bitcoin",
      amount: "+0.002 BTC",
      time: "1 day ago",
      status: "Confirmed",
    },
  ];

  return (
    <div className="glass-card">
      <div className="widget-title-row">
        <h3>
          <History size={20} style={{ color: "#38BDF8" }} />
          <span>Recent Activity</span>
        </h3>

        <Link
          to="/transactions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: "var(--primary)",
            fontSize: "13px",
            fontWeight: "600",
            textDecoration: "none"
          }}
        >
          <span>View All</span>
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="tx-mini-list">
        {recentTransactions.map((tx) => (
          <div key={tx.id} className="tx-mini-item">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className={`tx-icon-box ${tx.type}`}>
                {tx.type === "receive" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
              </div>

              <div className="tx-meta">
                <h4>{tx.title}</h4>
                <p>{tx.time} • <span className={`chain-pill ${tx.chain.toLowerCase()}`}>{tx.chain}</span></p>
              </div>
            </div>

            <div className="tx-amount-col">
              <div className={`val ${tx.type === "receive" ? "green" : ""}`}>{tx.amount}</div>
              <div style={{ fontSize: "11px", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "3px", marginTop: "2px" }}>
                <CheckCircle2 size={12} />
                <span>{tx.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivityWidget;
