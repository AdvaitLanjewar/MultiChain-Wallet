import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Send, Download, ArrowRightLeft, ShoppingBag, PieChart, History, Settings, LogOut, Wallet } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import toast from "react-hot-toast";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { wallet, logoutWallet } = useWallet();

  const handleLogout = () => {
    logoutWallet();
    toast.success("Wallet disconnected");
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Portfolio", path: "/portfolio", icon: PieChart },
    { name: "Send", path: "/send", icon: Send },
    { name: "Receive", path: "/receive", icon: Download },
    { name: "Buy", path: "/buy", icon: ShoppingBag },
    { name: "Transactions", path: "/transactions", icon: History },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
        <Wallet className="brand-icon" size={24} />
        <span className="brand-name">MultiChain Wallet</span>
      </div>

      <div className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              <Icon size={16} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="nav-actions">
        {wallet ? (
          <button className="logout-btn" onClick={handleLogout} title="Disconnect Wallet">
            <LogOut size={16} />
            <span>Disconnect</span>
          </button>
        ) : (
          <button className="primary-btn-sm" onClick={() => navigate("/create-wallet")}>
            Connect
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;