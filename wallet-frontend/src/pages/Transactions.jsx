import { useState } from "react";
import Navbar from "../components/Navbar";
import { History, ArrowUpRight, ArrowDownLeft, ExternalLink, Filter } from "lucide-react";

function Transactions() {
  const [filterChain, setFilterChain] = useState("all");

  const sampleTransactions = [
    {
      id: "tx-1",
      chain: "ethereum",
      type: "receive",
      amount: "+ 0.05 ETH",
      from: "0x71C...9B3",
      to: "My Ethereum Wallet",
      time: "10 mins ago",
      status: "Confirmed",
      hash: "0x8f32a...e71c",
    },
    {
      id: "tx-2",
      chain: "solana",
      type: "send",
      amount: "- 1.2 SOL",
      from: "My Solana Wallet",
      to: "5K9a...7xM",
      time: "2 hours ago",
      status: "Confirmed",
      hash: "4xN9...mQ8p",
    },
    {
      id: "tx-3",
      chain: "bitcoin",
      type: "receive",
      amount: "+ 0.002 BTC",
      from: "bc1q...89w",
      to: "My Bitcoin Wallet",
      time: "1 day ago",
      status: "Confirmed",
      hash: "7f92...a38b",
    },
  ];

  const filteredTxs = filterChain === "all"
    ? sampleTransactions
    : sampleTransactions.filter((tx) => tx.chain === filterChain);

  return (
    <>
      <Navbar />
      <div className="container dashboard">
        <div className="flex-between">
          <h1 className="dashboard-title">💳 Transaction History</h1>

          <div className="filter-box">
            <Filter size={16} />
            <select
              className="select-input-sm"
              value={filterChain}
              onChange={(e) => setFilterChain(e.target.value)}
            >
              <option value="all">All Chains</option>
              <option value="ethereum">Ethereum</option>
              <option value="bitcoin">Bitcoin</option>
              <option value="solana">Solana</option>
            </select>
          </div>
        </div>

        <div className="card-box">
          {filteredTxs.length === 0 ? (
            <p className="empty-text">No transactions found for {filterChain}.</p>
          ) : (
            <div className="table-responsive">
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Network</th>
                    <th>Amount</th>
                    <th>Recipient / Sender</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTxs.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <span className={`tx-badge ${tx.type}`}>
                          {tx.type === "receive" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          {tx.type.toUpperCase()}
                        </span>
                      </td>
                      <td><span className={`chain-pill ${tx.chain}`}>{tx.chain.toUpperCase()}</span></td>
                      <td className={tx.type === "receive" ? "green-text font-bold" : "font-bold"}>{tx.amount}</td>
                      <td className="dim-text">{tx.type === "receive" ? `From: ${tx.from}` : `To: ${tx.to}`}</td>
                      <td className="dim-text">{tx.time}</td>
                      <td><span className="status-badge success">{tx.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Transactions;