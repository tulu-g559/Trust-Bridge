import React, { useState } from "react";
import DashboardWrapper from "../../components/shared/DashboardWrapper";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { 
  Sparkles, 
  Coins, 
  Calendar, 
  FileText, 
  Send, 
  Loader2, 
  AlertCircle,
  TrendingUp 
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner"; // Assuming sonner or react-toastify

export default function LoanRequestForm() {
  const [formData, setFormData] = useState({
    amount: "",
    reason: "",
    duration: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Submitting loan request:", formData);
    toast.success("Loan request submitted successfully!");
    setIsSubmitting(false);
    // Add actual API logic here
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <DashboardWrapper>
      <div className="relative min-h-screen text-white p-4 md:p-8 flex justify-center">
         
         {/* Background Elements */}
         <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
         <div className="fixed top-20 right-20 w-64 h-64 bg-purple-900/20 blur-[80px] rounded-full pointer-events-none" />
         <div className="fixed bottom-20 left-20 w-64 h-64 bg-blue-900/20 blur-[80px] rounded-full pointer-events-none" />

         <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
         >
            
            {/* Left Column: Form (Span 7) */}
            <div className="lg:col-span-7">
                <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                    {/* Top Gradient Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-50"></div>
                    
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <Sparkles className="text-purple-400 w-6 h-6" />
                            </div>
                            New Loan Request
                        </h2>
                        <p className="text-gray-400">Fill in the details below to broadcast your request to our lender network.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Amount Field */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Loan Amount</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Coins className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <Input
                                    type="number"
                                    name="amount"
                                    placeholder="e.g. 5000"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 h-12 rounded-xl transition-all"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 font-mono text-sm">ETH / INR</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Duration Field */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Repayment Duration</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <Input
                                    type="number"
                                    name="duration"
                                    placeholder="e.g. 6"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                    className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-12 rounded-xl transition-all"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-sm">Months</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Reason Field */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Purpose of Loan</label>
                            <div className="relative group">
                                <div className="absolute top-3 left-4 pointer-events-none">
                                    <FileText className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <Textarea
                                    name="reason"
                                    placeholder="Briefly explain why you need this loan (e.g., Business expansion, Education)..."
                                    rows={4}
                                    value={formData.reason}
                                    onChange={handleChange}
                                    required
                                    className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl transition-all resize-none"
                                />
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div variants={itemVariants} className="pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold h-14 rounded-xl shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        Submit Request <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </motion.div>

                    </form>
                </div>
            </div>

            {/* Right Column: Info & Tips (Span 5) */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
                
                {/* Trust Score Impact Card */}
                <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-full text-purple-300">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Build Your Trust Score</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Repaying this loan on time will increase your on-chain Trust Score by approximately <span className="text-green-400 font-bold">+15 points</span>, unlocking lower interest rates for future borrowing.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Guidelines Card */}
                <div className="bg-gray-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <AlertCircle className="text-gray-400" size={20} /> Important Guidelines
                    </h3>
                    <ul className="space-y-3">
                        {["Ensure your wallet has enough gas fees for the transaction.", "Lenders prefer detailed reasons for higher approval rates.", "Loans are governed by smart contracts; repayment is automated.", "Late repayments may result in a Trust Score penalty."].map((tip, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 shrink-0"></span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>

            </motion.div>

         </motion.div>
      </div>
    </DashboardWrapper>
  );
}