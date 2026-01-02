import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mic, User, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    setRole(userType);
  }, []);

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative py-24 md:py-36 overflow-hidden bg-black text-white">
      {/* --- Background Elements --- */}
      
      {/* 1. Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-200 backdrop-blur-sm">
              <ShieldCheck size={14} className="text-purple-400" />
              <span className="font-medium">AI-Powered Microloans</span>
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="mb-6 leading-[1.1] tracking-tighter"
          >
            <span className="bg-clip-text text-transparent rubik-maze-regular bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient-x text-6xl md:text-8xl">
              Reimagining Trust
            </span>
            <br />
            <span className="text-white michroma-regular text-4xl md:text-4xl mr-5">
              Unlocking</span><span className="text-white michroma-regular text-4xl md:text-4xl">Opportunities
            </span>
          </motion.h1>



          {/* Description */}
          <motion.p 
            variants={itemVariants}
            // smaller on all screens
            className="text-gray-400 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Access capital without traditional credit scores. 
            <br></br>We use <span className="text-white font-medium">Blockchain & AI</span> to help underserved individuals build true financial freedom.
          </motion.p>

          {/* Buttons Area */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {role === "borrower" && (
              <>
                <Link to="/trustscore">
                  <Button className="relative group overflow-hidden bg-white text-black hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-300">
                    <span className="relative z-10 text-white">Get Trust Score</span>
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </Button>
                </Link>
                <Link to="/borrower/profile">
                  <Button
                    variant="outline"
                    className="border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/20 rounded-full px-8 py-6 text-lg transition-all duration-300 group"
                  >
                    <User size={18} className="mr-2 group-hover:text-purple-400 transition-colors" />
                    Check Profile
                  </Button>
                </Link>
              </>
            )}

            {role === "lender" && (
              <>
                <Link to="/lender/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-blue-900/20">
                    Launch Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/lender/profile">
                  <Button
                    variant="outline"
                    className="border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 rounded-full px-8 py-6"
                  >
                    <User size={18} className="mr-2" />
                    Lender Profile
                  </Button>
                </Link>
              </>
            )}
            
            {/* Fallback if no role found (Optional) */}
            {!role && (
                 <div className="h-14 w-full animate-pulse bg-white/5 rounded-full max-w-xs"></div>
            )}
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 items-center justify-center gap-4 py-4 px-6 bg-white/5 rounded-2xl backdrop-blur-md border border-white/5 inline-flex"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative overflow-hidden"
                >
                   {/* Simulating avatars with gradients */}
                   <div className={`absolute inset-0 opacity-80 ${
                       i % 2 === 0 ? 'bg-purple-500' : 'bg-blue-500'
                   } mix-blend-overlay`}></div>
                   <span className="text-[10px] text-white/80 z-10 font-mono">{i}</span>
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-lg leading-none">1,000+</p>
              <p className="text-gray-400 text-sm">Lives changed this month</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}