import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Wallet, ArrowRight, TrendingUp } from "lucide-react";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    localStorage.setItem("userType", role);
    navigate(`/auth/${role}`);
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden p-4">
      {/* --- Background Elements --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
      
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-4xl w-full"
      >
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 font-mono mb-6">
              <TrendingUp size={12} />
              <span>Decentralized Credit Protocol</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white poppins-regular">
             Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 michroma-regular">TrustBridge</span>
           </h1>
           <p className="text-gray-400 text-lg max-w-lg mx-auto poppins-regular">
             Choose how you want to interact with the platform to get started.
           </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
          {/* Borrower Card */}
          <RoleCard
            role="borrower"
            icon={<User size={32} />}
            title="Borrow"
            subtitle="Access Capital"
            description="Get instant microloans using your on-chain Trust Score. Build your financial reputation."
            gradient="from-purple-600 to-pink-600"
            onClick={() => handleSelectRole("borrower")}
          />

          {/* Lender Card */}
          <RoleCard
            role="lender"
            icon={<Wallet size={32} />}
            title="Lend"
            subtitle="Earn Yield"
            description="Provide liquidity to verified borrowers and earn competitive APY in a secure environment."
            gradient="from-blue-600 to-cyan-500"
            onClick={() => handleSelectRole("lender")}
          />
        </div>

        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-600 mt-12 text-sm poppins-regular"
        >
            Secured by Ethereum Sepolia Testnet & AI Vision Verification
        </motion.p>
      </motion.div>
    </div>
  );
};

// New "Glass Monolith" Card Design
const RoleCard = ({ role, icon, title, subtitle, description, gradient, onClick }) => {
    return (
        <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative w-full text-left h-full"
        >
            {/* The Glass Container */}
            <div className="relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 p-1 transition-all duration-500 group-hover:border-white/20">
                
                {/* Background Gradient Blob (Animates on hover) */}
                <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${gradient} rounded-full blur-[80px] opacity-20 group-hover:opacity-40 group-hover:scale-125 transition-all duration-700`}></div>
                
                {/* Inner Content Card */}
                <div className="relative h-full bg-[#050505]/80 backdrop-blur-xl rounded-[1.8rem] p-8 flex flex-col items-start gap-4">
                    
                    {/* Header: Icon & Arrow */}
                    <div className="w-full flex justify-between items-start mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:scale-110`}>
                            {icon}
                        </div>
                        <div className="p-3 rounded-full border border-white/5 bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </div>
                    </div>

                    {/* Titles */}
                    <div>
                        <span className={`text-xs font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r ${gradient} mb-2 block`}>
                            {subtitle}
                        </span>
                        <h3 className="text-3xl font-bold text-white mb-2 poppins-regular">
                            {title}
                        </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed poppins-regular">
                        {description}
                    </p>

                    {/* Bottom Indicator */}
                    <div className="mt-auto pt-6 w-full">
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full w-0 bg-gradient-to-r ${gradient} group-hover:w-full transition-all duration-700 ease-out`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.button>
    )
}

export default RoleSelectionPage;