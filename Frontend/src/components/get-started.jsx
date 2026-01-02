import { Link } from "react-router-dom";
import { ArrowRight, Clock, Zap, Wallet, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

export default function GetStarted() {
  
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="get-started" className="relative py-24 md:py-32 bg-black overflow-hidden flex items-center justify-center">
      {/* --- Background Elements --- */}
      
      {/* 1. Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* 2. Central Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-purple-600/20 to-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Glass Card */}
          <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 border border-white/10 overflow-hidden shadow-2xl">
            
            {/* Decorative Top Highlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 blur-sm"></div>

            <div className="text-center relative z-10">
              <motion.h2 
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white poppins-regular"
              >
                Ready to unlock <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient-x">
                  Financial Freedom?
                </span>
              </motion.h2>
              
              <motion.p 
                variants={itemVariants}
                className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed poppins-regular"
              >
                Join thousands of people who have bypassed traditional barriers to discover opportunity through TrustBridge.
              </motion.p>

              {/* Stats Grid */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              >
                {/* Stat 1 */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center hover:bg-white/5 transition-colors group">
                  <div className="mb-3 p-3 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">3 min</div>
                  <p className="text-gray-400 text-sm font-medium">Application Time</p>
                </div>

                {/* Stat 2 */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center hover:bg-white/5 transition-colors group">
                  <div className="mb-3 p-3 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">24 hrs</div>
                  <p className="text-gray-400 text-sm font-medium">Approval Time</p>
                </div>

                {/* Stat 3 */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center hover:bg-white/5 transition-colors group">
                  <div className="mb-3 p-3 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <Wallet className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">$2,500</div>
                  <p className="text-gray-400 text-sm font-medium">Average Loan</p>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center gap-4"
              >
                <Link to="/trustscore" className="relative group">
                    {/* Glow effect behind button */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                    
                    <Button className="relative bg-white text-white hover:bg-gray-100 rounded-full px-10 py-8 text-xl font-bold flex items-center gap-3 transition-all duration-300 transform group-hover:-translate-y-1 poppins-regular">
                      <span>Get Your Trust Score</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
                
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-2 poppins-regular">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>No credit check required. Secure & Private.</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}