import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Wallet, ScanLine, Globe, Zap } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../components/header";
import Footer from "../components/footer";

export default function AboutPage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow relative overflow-hidden pt-32 pb-20">
        {/* --- Background Elements --- */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <span className="py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 font-mono">
                EST. 2025
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
            >
              <span className="text-white rubik-maze-regular">Building the </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient-x rubik-maze-regular">
                Future of Finance
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed poppins-regular"
            >
              TrustBridge combines the security of blockchain with the intelligence of AI to create a borderless, permissionless financial ecosystem.
            </motion.p>
          </div>

          {/* Mission Block */}
          <div 
            data-aos="fade-up" 
            className="relative mb-24 max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
               {/* Decorative Grid inside card */}
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
               
               <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-6 michroma-regular">Our Mission</h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6 poppins-regular">
                      We believe that financial opportunity should not be limited by geography or traditional credit scores.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed poppins-regular">
                      By leveraging <span className="text-white font-semibold">Smart Contracts</span> and <span className="text-white font-semibold">AI Vision</span>, we are removing the gatekeepers and empowering individuals to own their financial identity.
                    </p>
                  </div>
                  <div className="bg-black/50 rounded-2xl p-6 border border-white/5">
                      {/* Abstract Visual Representation of Mission */}
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-purple-500/10 p-4 rounded-xl text-center">
                              <span className="block text-3xl font-bold text-white mb-1">10k+</span>
                              <span className="text-xs text-gray-400 uppercase tracking-widest">Users</span>
                          </div>
                          <div className="bg-blue-500/10 p-4 rounded-xl text-center">
                              <span className="block text-3xl font-bold text-white mb-1">$5M+</span>
                              <span className="text-xs text-gray-400 uppercase tracking-widest">Volume</span>
                          </div>
                          <div className="col-span-2 bg-white/5 p-4 rounded-xl text-center flex items-center justify-center gap-3">
                              <Globe className="w-5 h-5 text-green-400" />
                              <span className="text-white font-medium">Available in 120+ Countries</span>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Features Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative"
              >
                <div className="h-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 backdrop-blur-sm p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-900/20">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <f.icon className="w-24 h-24 text-white rotate-12" />
                  </div>
                  
                  <div className="w-12 h-12 rounded-lg bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:border-purple-500/50 transition-colors">
                    <f.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm relative z-10">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

const features = [
  {
    title: "Smart Contract Lending",
    description: "Borrow or lend assets on-chain with automated contracts that ensure secure repayment, eliminating the need for expensive intermediaries.",
    icon: ShieldCheck,
  },
  {
    title: "AI Document Vision",
    description: "Simply upload financial documents. Our neutral AI extracts income and identity data to assess eligibility without human bias.",
    icon: ScanLine,
  },
  {
    title: "Universal Wallet Login",
    description: "Seamlessly connect with MetaMask, Coinbase, or WalletConnect. Your wallet is your identity, making onboarding instant.",
    icon: Wallet,
  },
  {
    title: "Decentralized Reputation",
    description: "Build a portable, on-chain credit score based on your repayment history that you can take to any platform in the ecosystem.",
    icon: Sparkles,
  },
];