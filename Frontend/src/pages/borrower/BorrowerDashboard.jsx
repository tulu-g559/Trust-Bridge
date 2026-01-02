import React, { useState, useEffect } from "react";
import DashboardWrapper from "../../components/shared/DashboardWrapper";
import { 
  BadgeCheck, 
  FileText, 
  TrendingUp, 
  Loader2, 
  Calendar, 
  Wallet, 
  ArrowUpRight, 
  Activity 
} from "lucide-react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { motion } from "framer-motion";

export default function BorrowerDashboard() {
  const [currentUser] = useAuthState(auth);
  const [borrowedAmount, setBorrowedAmount] = useState(0);
  const [nextDueDate, setNextDueDate] = useState(null);
  const [trustScore, setTrustScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching Logic ---
  useEffect(() => {
    const fetchBorrowerStats = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);
        const q = query(
          collection(db, "loanRequests"),
          where("borrowerId", "==", currentUser.uid),
          where("status", "==", "approved")
        );

        const querySnapshot = await getDocs(q);
        let totalBorrowed = 0;
        let earliestDueDate = null;

        querySnapshot.forEach((doc) => {
          const loan = doc.data();
          totalBorrowed += parseFloat(loan.amount);
          
          if (loan.transferredAt) {
            const dueDate = new Date(loan.transferredAt.seconds * 1000);
            dueDate.setMonth(dueDate.getMonth() + 6);
            
            if (!earliestDueDate || dueDate < earliestDueDate) {
              earliestDueDate = dueDate;
            }
          }
        });

        setBorrowedAmount(totalBorrowed);
        setNextDueDate(earliestDueDate);

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();
        setTrustScore(userData?.trust_score?.current ?? 0);

      } catch (error) {
        console.error("Error fetching borrower stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBorrowerStats();
  }, [currentUser]);

  // --- Formatting Helpers ---
  const formatCurrency = (value) => {
    return value.toLocaleString("en-IN", {
      maximumFractionDigits: 3,
      style: "currency",
      currency: "ETH",
    });
  };

  const formatDueDate = (date) => {
    if (!date) return "No upcoming payments";
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const getDaysRemaining = (date) => {
    if (!date) return null;
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const ScoreRing = ({ score }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    return (
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="transform -rotate-90 w-20 h-20">
          <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-800" />
          <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="text-purple-500 transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
             <TrendingUp size={20} className="text-purple-400" />
        </div>
      </div>
    );
  };

  return (
    <DashboardWrapper>
      {/* LAYOUT FIX: 
         - `pt-24 md:pt-32` pushes content down so it clears the fixed Header.
         - `min-h-screen` ensures the black background fills the page.
      */}
      {/* <div className="relative min-h-screen bg-black text-white w-full pt-24 md:pt-32 px-4 md:px-8 pb-12 overflow-hidden"> */}
      <div className="relative min-h-screen bg-black text-white w-full pt-12 md:pt-20 px-4 md:px-8 pb-12 overflow-hidden">

        
        {/* --- Background Elements (Fixed to cover screen) --- */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>
        <div className="fixed top-0 right-0 w-96 h-96 bg-purple-900/10 blur-[100px] rounded-full pointer-events-none z-0" />
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-blue-900/10 blur-[100px] rounded-full pointer-events-none z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
            
            {/* Header Area */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-400">Welcome back, here is your financial overview.</p>
                </div>
                
                {/* Status Badge */}
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-300">System Online</span>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
                {/* Card 1: Borrowed */}
                <motion.div variants={itemVariants} className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                            <Wallet size={24} />
                        </div>
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider border border-white/10 px-2 py-1 rounded">Active</span>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Total Borrowed</p>
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            {isLoading ? <Loader2 className="animate-spin" /> : formatCurrency(borrowedAmount)}
                        </h2>
                    </div>
                </motion.div>

                {/* Card 2: Due Date */}
                <motion.div variants={itemVariants} className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full group-hover:bg-orange-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-400">
                            <Calendar size={24} />
                        </div>
                        {nextDueDate && (
                            <span className="text-xs font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded">
                                {getDaysRemaining(nextDueDate)} Days left
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Next Payment Due</p>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {isLoading ? <Loader2 className="animate-spin" /> : formatDueDate(nextDueDate)}
                        </h2>
                    </div>
                </motion.div>

                {/* Card 3: Trust Score */}
                <motion.div variants={itemVariants} className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors flex items-center justify-between">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-all"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                             <p className="text-gray-400 text-sm">Trust Score</p>
                             <BadgeCheck size={14} className="text-purple-400" />
                        </div>
                        <h2 className="text-4xl font-bold text-white tracking-tight">
                            {isLoading ? <Loader2 className="animate-spin" /> : (trustScore ?? "N/A")}
                            <span className="text-lg text-gray-500 font-normal">/100</span>
                        </h2>
                        <p className="text-xs text-purple-300 mt-1">Good Standing</p>
                    </div>
                    <div className="relative z-10">
                        {isLoading ? null : <ScoreRing score={trustScore || 0} />}
                    </div>
                </motion.div>
            </motion.div>

            {/* Recent Activity */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8"
            >
                <div className="flex items-center gap-3 mb-8">
                    <Activity className="text-blue-400" size={20} />
                    <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="p-3 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                            <BadgeCheck size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">Payment Successful</p>
                            <p className="text-sm text-gray-400">You repaid 0.3 ETH for Loan #8821</p>
                        </div>
                        <span className="text-xs text-gray-500">Apr 30</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            <ArrowUpRight size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">Loan Approved</p>
                            <p className="text-sm text-gray-400">Your request for 5 ETH was approved</p>
                        </div>
                        <span className="text-xs text-gray-500">Apr 28</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            <TrendingUp size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">Trust Score Updated</p>
                            <p className="text-sm text-gray-400">Your score increased by 12 points</p>
                        </div>
                        <span className="text-xs text-gray-500">Apr 25</span>
                    </div>
                </div>
            </motion.section>
        </div>
      </div>
    </DashboardWrapper>
  );
}