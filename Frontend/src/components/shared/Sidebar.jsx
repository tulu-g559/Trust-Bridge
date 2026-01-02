import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, FileText, Search, Users, BookOpen, ShieldCheck, 
  Menu, X, ChevronRight, LayoutDashboard 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const [role, setRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    setRole(userType);
  }, []);

  const isActive = (path) => location.pathname.includes(path);

  const menuVariants = {
    closed: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95, 
      transition: { duration: 0.2 } 
    },
    open: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.3, ease: "easeOut" } 
    }
  };

  return (
    // Added 'mt-24 md:mt-32' to push it down below the fixed Navbar
    // <div className="relative z-40 px-4 mt-24 md:mt-32">
    <div className="relative z-40 px-4 mt-12 md:mt-20">

      
      {/* Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white px-5 py-3 rounded-full transition-all duration-300 shadow-[0_0_20px_-5px_rgba(147,51,234,0.3)] hover:border-purple-500/50 group"
      >
        <div className="relative">
            {isMenuOpen ? <X size={20} className="text-purple-400" /> : <Menu size={20} className="text-purple-400" />}
        </div>
        <span className="font-medium tracking-wide">
            {isMenuOpen ? "Close Menu" : "Dashboard Menu"}
        </span>
        <ChevronRight size={16} className={`text-gray-500 transition-transform duration-300 ${isMenuOpen ? "rotate-90" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="absolute top-full left-4 mt-4 w-72 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Grid Pattern Background inside menu */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

            <div className="relative z-10 p-3 flex flex-col gap-1">
              {role === "borrower" && (
                <>
                  <MenuItem 
                    to="/borrower/dashboard" 
                    icon={<LayoutDashboard size={18} />} 
                    label="Dashboard" 
                    active={isActive("/borrower/dashboard")} 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  <MenuItem 
                    to="/trustscore" 
                    icon={<ShieldCheck size={18} />} 
                    label="My Trust Score" 
                    active={isActive("/trustscore")} 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  <MenuItem 
                    to="/borrower/find-lenders" 
                    icon={<Search size={18} />} 
                    label="Find Lenders" 
                    active={isActive("/find-lenders")} 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  <MenuItem 
                    to="/borrower/repay" 
                    icon={<FileText size={18} />} 
                    label="Repay Loan" 
                    active={isActive("/borrower/repay")} 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                </>
              )}

              {role === "lender" && (
                <>
                  <MenuItem 
                    to="/lender/dashboard" 
                    icon={<LayoutDashboard size={18} />} 
                    label="Dashboard" 
                    active={isActive("/lender/dashboard")} 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  <MenuItem 
                    to="/lender/requests" 
                    icon={<Users size={18} />} 
                    label="Loan Requests" 
                    active={isActive("/requests")} 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  <MenuItem 
                    to="/lender/preferences" 
                    icon={<BookOpen size={18} />} 
                    label="Preferences" 
                    active={isActive("/preferences")} 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                </>
              )}
            </div>
            
            {/* Decorative bottom bar */}
            <div className="h-1 w-full bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-purple-500/50"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Reusable Menu Item Component
const MenuItem = ({ to, icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden ${
      active 
        ? "bg-purple-500/20 text-white shadow-inner border border-purple-500/30" 
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`}
  >
    {active && (
        <motion.div 
            layoutId="active-indicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" 
        />
    )}
    
    <span className={`relative z-10 transition-colors ${active ? "text-purple-300" : "group-hover:text-purple-400"}`}>
        {icon}
    </span>
    <span className="relative z-10 font-medium">{label}</span>
  </Link>
);

export default Sidebar;