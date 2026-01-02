import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user] = useAuthState(auth);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update User Role
  useEffect(() => {
    const role = localStorage.getItem("userType");
    setUserType(role);
  }, [user]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // --- REUSABLE COMPONENTS ---

  const NavLink = ({ to, children }) => (
    <Link to={to} className="relative group px-1 py-2">
      <span className="relative z-10 text-gray-300 group-hover:text-white transition-colors duration-200 font-medium">
        {children}
      </span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300 ease-out" />
    </Link>
  );

  const MobileNavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className="block text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all border-l-2 border-transparent hover:border-purple-500"
    >
      <div className="flex justify-between items-center">
        {children}
        <ChevronRight size={16} className="opacity-50" />
      </div>
    </Link>
  );

  const AuthButton = ({ isMobile = false }) => {
    if (user) {
      return (
        <Button
          onClick={handleSignOut}
          className={`bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-full transition-all ${isMobile ? "w-full justify-center mt-4" : ""}`}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      );
    }

    return (
      <Link to="/auth-selector" className={isMobile ? "w-full block mt-4" : ""}>
        <Button className={`bg-white text-white hover:bg-gray-200 rounded-full font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] transition-all ${isMobile ? "w-full" : ""}`}>
          Login
        </Button>
      </Link>
    );
  };

  const getLinks = () => {
    if (userType === "borrower") {
      return [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Dashboard", path: "/borrower/dashboard" },
        { name: "Profile", path: "/borrower/profile" },
      ];
    }
    if (userType === "lender") {
      return [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Dashboard", path: "/lender/dashboard" },
        { name: "Profile", path: "/lender/profile" },
      ];
    }
    return [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Team", path: "/team" },
    ];
  };

  const links = getLinks();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#030014]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-purple-900/5" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo Area */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full"></div>
                <img
                src="/tlogofinal.png"
                alt="TrustBridge Logo"
                className="h-10 w-auto pr-3 relative z-10"
                />
            </div>
            <span className="text-2xl md:text-1xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
              TrustBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <NavLink key={link.path} to={link.path}>
                {link.name}
              </NavLink>
            ))}
            
            <div className="pl-4 border-l border-white/10">
               <AuthButton />
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030014] border-b border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-2">
              {links.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <MobileNavLink to={link.path}>
                    {link.name}
                  </MobileNavLink>
                </motion.div>
              ))}
              
              <motion.div
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.3 }}
                 className="pt-4 mt-2 border-t border-white/10"
              >
                  <AuthButton isMobile={true} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}