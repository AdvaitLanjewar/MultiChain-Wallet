import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home as HomeIcon, LayoutDashboard, Send, Download, ShoppingBag, PieChart, History, Settings, LogOut, Wallet, ShieldCheck } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import toast from "react-hot-toast";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { wallet, logoutWallet } = useWallet();

  const handleLogout = () => {
    logoutWallet();
    toast.success("Wallet disconnected successfully");
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/", icon: HomeIcon, alwaysShow: true },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, requiresWallet: true },
    { name: "Portfolio", path: "/portfolio", icon: PieChart, requiresWallet: true },
    { name: "Send", path: "/send", icon: Send, requiresWallet: true },
    { name: "Receive", path: "/receive", icon: Download, requiresWallet: true },
    { name: "Buy", path: "/buy", icon: ShoppingBag, requiresWallet: true },
    { name: "Transactions", path: "/transactions", icon: History, requiresWallet: true },
    { name: "Settings", path: "/settings", icon: Settings, requiresWallet: true },
  ];

  const visibleNavItems = navItems.filter(item => item.alwaysShow || (wallet && item.requiresWallet));

  return (
    <nav className="navbar">
      <div 
        className="nav-brand" 
        onClick={() => navigate(wallet ? "/dashboard" : "/")} 
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
      >
        <div style={{
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))",
          padding: "8px",
          borderRadius: "12px",
          border: "1px solid rgba(168, 85, 247, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Wallet className="brand-icon" size={22} />
        </div>
        <span className="brand-name">NEXUS WALLET</span>
      </div>

      <div className="nav-links">
        {visibleNavItems.map((item) => {
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
        <div className="network-badge" title="Connected to Multi-Chain Mainnet">
          <span className="network-dot"></span>
          <span>Mainnet</span>
        </div>

        {wallet ? (
          <button className="logout-btn" onClick={handleLogout} title="Disconnect Wallet">
            <LogOut size={15} />
            <span>Disconnect</span>
          </button>
        ) : (
          <button className="primary-btn" style={{ padding: "8px 16px", fontSize: "13px" }} onClick={() => navigate("/create-wallet")}>
            <ShieldCheck size={16} />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;