import { CheckCircle2, ShieldCheck, Globe, Zap, Cpu, TrendingUp, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyTrustBridge() {
  const benefits = [
    {
      icon: <Wallet className="w-6 h-6 text-purple-400" />,
      title: "No Credit Score Needed",
      description: "We use alternative data, not FICO scores. Your potential matters more than your history.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: "Bank-Grade Security",
      description: "All transactions are immutable and encrypted on the blockchain for total transparency.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      title: "AI-Powered Decisions",
      description: "Our neutral AI algorithm analyzes thousands of data points to generate fair Trust Scores.",
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      title: "Global Accessibility",
      description: "Borderless lending. Whether you are in New York or Nairobi, opportunities are equal.",
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      title: "Instant Approval",
      description: "No paperwork. No waiting weeks. Get approved and funded in minutes, not days.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
      title: "Build Real Wealth",
      description: "Repaying loans creates an on-chain credit history that follows you forever.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
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
    <section id="why-trustbridge" className="relative py-24 bg-black text-white overflow-hidden">
      {/* --- Background Elements --- */}
      
      {/* 1. Consistent Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* 2. Side Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight poppins-regular"
          >            Why To Choose{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 michroma-regular">
              TrustBridge
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg poppins-regular"
          >
            We are reimagining financial inclusion for the digital age by removing the gatekeepers.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="h-full p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.15)] flex flex-col items-start">
                
                {/* Icon Wrapper */}
                <div className="mb-5 p-3 rounded-xl bg-black border border-white/10 group-hover:border-purple-500/50 shadow-inner transition-colors">
                  {benefit.icon}
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-white transition-colors">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed text-sm">
                  {benefit.description}
                </p>

                {/* Decorative glow on hover inside the card */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}