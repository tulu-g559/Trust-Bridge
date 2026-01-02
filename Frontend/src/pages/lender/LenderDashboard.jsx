import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import DashboardWrapper from "../../components/shared/DashboardWrapper";
import { 
  Wallet, 
  Users, 
  BarChart2, 
  Loader2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

export default function LenderDashboard() {
  const [currentUser] = useAuthState(auth);
  const [activeBorrowers, setActiveBorrowers] = useState(0);
  const [totalLent, setTotalLent] = useState(0);
  const [expectedReturns, setExpectedReturns] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // --- Data Fetching ---
  useEffect(() => {
    const fetchLoanStats = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);
        const q = query(
          collection(db, "loanRequests"),
          where("lenderId", "==", currentUser.uid),
          where("status", "==", "approved")
        );

        const querySnapshot = await getDocs(q);
        setActiveBorrowers(querySnapshot.size);

        let lentAmount = 0;
        let totalExpectedReturns = 0;

        querySnapshot.forEach((doc) => {
          const loan = doc.data();
          const amount = parseFloat(loan.amount);
          const interestRate = parseFloat(loan.interestRate);

          lentAmount += amount;
          const principalPlusInterest = amount + amount * (interestRate / 100);
          totalExpectedReturns += principalPlusInterest;
        });

        setTotalLent(lentAmount);
        setExpectedReturns(totalExpectedReturns);
      } catch (error) {
        console.error("Error fetching loan stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanStats();
  }, [currentUser]);

  const formatCurrency = (value) => {
    return value.toLocaleString("en-IN", {
      maximumFractionDigits: 3,
      style: "currency",
      currency: "ETH",
    });
  };

  const stats = [
    {
      label: "Total Capital Deployed",
      value: isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : formatCurrency(totalLent),
      icon: <Wallet className="w-6 h-6 text-emerald-400" />,
      color: "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10",
      glow: "shadow-emerald-900/20",
      textColor: "text-emerald-400"
    },
    {
      label: "Active Portfolio",
      value: isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `${activeBorrowers} Borrowers`,
      icon: <Users className="w-6 h-6 text-blue-400" />,
      color: "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10",
      glow: "shadow-blue-900/20",
      textColor: "text-blue-400",
      link: "/lender/active-borrowers",
    },
    {
      label: "Projected Returns",
      value: isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : formatCurrency(expectedReturns),
      icon: <BarChart2 className="w-6 h-6 text-purple-400" />,
      color: "border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10",
      glow: "shadow-purple-900/20",
      textColor: "text-purple-400"
    },
  ];

  return (
    <DashboardWrapper>
      <div className="relative min-h-screen text-white p-4 md:p-8">
        {/* --- Background Elements --- */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
        <div className="fixed top-0 right-0 w-96 h-96 bg-purple-900/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
            
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                        Lender Dashboard
                    </h1>
                    <p className="text-gray-400">Monitor your investments and track yield generation.</p>
                </div>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-300">Market Open</span>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
                {stats.map((stat, index) => {
                    const Content = (
                        <div className="h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl border border-white/5 bg-black/40 ${stat.glow}`}>
                                    {stat.icon}
                                </div>
                                {stat.link && <ArrowUpRight className="text-gray-600 group-hover:text-white transition-colors" size={20} />}
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                                <h2 className={`text-2xl md:text-3xl font-bold ${stat.textColor} tracking-tight`}>
                                    {stat.value}
                                </h2>
                            </div>
                        </div>
                    );

                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`group relative rounded-2xl p-6 border transition-all duration-300 backdrop-blur-sm shadow-lg ${stat.color} ${stat.glow}`}
                        >
                            {stat.link && !isLoading ? (
                                <Link to={stat.link} className="block h-full">
                                    {Content}
                                </Link>
                            ) : Content}
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Recent Activity Section */}
            <motion.section 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8"
            >
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                    <Activity className="text-blue-400" size={20} />
                    <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                </div>

                <div className="space-y-4">
                    {/* Activity Item 1 */}
                    <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                            <ArrowUpRight size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">Funds Deployed</p>
                            <p className="text-sm text-gray-400">You lent <span className="text-emerald-300">5.0 ETH</span> to Aarti Sharma</p>
                        </div>
                        <span className="text-xs text-gray-500">2h ago</span>
                    </motion.div>

                    {/* Activity Item 2 */}
                    <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 group-hover:scale-110 transition-transform">
                            <FileText size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">New Request</p>
                            <p className="text-sm text-gray-400">Ramesh B. requested <span className="text-white">2.5 ETH</span> for Business</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg transition-colors">Review</button>
                        </div>
                    </motion.div>

                    {/* Activity Item 3 */}
                    <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform">
                            <ArrowDownLeft size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">Repayment Received</p>
                            <p className="text-sm text-gray-400">Sunita K. paid installment #3 (<span className="text-purple-300">0.4 ETH</span>)</p>
                        </div>
                        <span className="text-xs text-gray-500">1d ago</span>
                    </motion.div>
                </div>
            </motion.section>
        </div>
      </div>
    </DashboardWrapper>
  );
}