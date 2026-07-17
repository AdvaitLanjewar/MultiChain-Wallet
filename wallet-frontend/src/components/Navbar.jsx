import { Bell, Search, UserCircle } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        🚀 MultiChain Wallet
      </div>

      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search coins..."
        />
      </div>

      <div className="nav-icons">

        <Bell size={22} />

        <UserCircle size={30} />

      </div>

    </nav>
  );
}

export default Navbar;