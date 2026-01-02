import { Smartphone, Shield, BarChart3, CreditCard, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Smartphone className="w-8 h-8 text-purple-400" />,
      title: "Connect Data",
      description: "Securely link your digital footprint to our encrypted vault.",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: "AI Analysis",
      description: "Our neutral AI engine analyzes 50+ data points to generate your score.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
      title: "Get Funded",
      description: "Instantly qualify for microloans based on your Trust Score.",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-blue-400" />,
      title: "Build History",
      description: "Repay on time to unlock higher limits and lower interest rates.",
    },
  ];

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
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden bg-black text-white">
       {/* --- Background --- */}
       
       {/* 1. Grid Pattern (adjusted for pure black) */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
       {/* 2. Ambient Purple/Blue Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight"
          >
            <span className="text-white poppins-regular">How </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 michroma-regular">
              TrustBridge
            </span><span className="text-white poppins-regular"> Works</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto poppins-regular"
          >
            A seamless, transparent 4-step process powered by AI.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              {/* Card Container */}
              <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/30 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]">
                
                {/* Icon Circle */}
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                        {step.icon}
                    </div>
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-200 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Step Number Background Watermark */}
                <span className="absolute top-4 right-6 text-6xl font-black text-white/[0.03] select-none z-0">
                  0{index + 1}
                </span>
              </div>

              {/* Connecting Arrow (Desktop Only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center transform -translate-y-1/2 z-20">
                  <ArrowRight className="text-gray-700 w-6 h-6 opacity-50" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}