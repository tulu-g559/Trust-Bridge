import React, { useEffect, useState } from "react";
import DashboardWrapper from "../../components/shared/DashboardWrapper";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  getDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { 
  HandCoins, 
  Percent, 
  BadgeCheck, 
  MapPin, 
  Search, 
  Wallet, 
  Loader2,
  Filter,
  ArrowRight
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";

const LenderList = () => {
  const [lenders, setLenders] = useState([]);
  const [filteredLenders, setFilteredLenders] = useState([]);
  const [loanRequests, setLoanRequests] = useState({});
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [user] = useAuthState(auth);
  const { address: walletAddress, isConnected } = useAccount();

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4 } 
    }
  };

  // --- Data Fetching ---
  useEffect(() => {
    const fetchLenders = async () => {
      try {
        const q = query(collection(db, "lenders"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (lender) =>
              lender.maxAmount &&
              lender.interestRate &&
              !isNaN(parseFloat(lender.maxAmount)) &&
              !isNaN(parseFloat(lender.interestRate))
          );

        setLenders(data);
        setFilteredLenders(data);
      } catch (err) {
        console.error("Error fetching lenders:", err);
        toast.error("Failed to fetch lenders.");
      }
    };

    fetchLenders();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchLoanRequests = async () => {
      try {
        const q = query(
          collection(db, "loanRequests"),
          where("borrowerId", "==", user.uid)
        );
        const snapshot = await getDocs(q);

        const requestsMap = {};
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          requestsMap[data.lenderId] = data.status;
        });

        setLoanRequests(requestsMap);
      } catch (err) {
        console.error("Error fetching loan requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanRequests();
  }, [user]);

  // --- Search Logic ---
  useEffect(() => {
    const results = lenders.filter(lender => 
      (lender.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lender.location?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredLenders(results);
  }, [searchTerm, lenders]);

  // --- Apply Logic ---
  const handleApply = async (lender) => {
    if (!user) return toast.error("Please log in to apply for a loan.");
    if (!isConnected) return toast.error("Please connect your wallet first");
    if (!walletAddress) return toast.error("Please connect your wallet to continue");

    setApplyingId(lender.id);
    try {
      const borrowerDoc = await getDoc(doc(db, "users", user.uid));
      const borrowerData = borrowerDoc.data();

      // Ensure wallet address is up to date in DB
      if (borrowerData?.walletAddress !== walletAddress) {
        await updateDoc(doc(db, "users", user.uid), {
          walletAddress: walletAddress
        });
      }

      await addDoc(collection(db, "loanRequests"), {
        lenderId: lender.id,
        borrowerId: user.uid,
        borrowerName: borrowerData?.fullName || "Anonymous",
        borrowerWallet: walletAddress,
        amount: lender.maxAmount,
        interestRate: lender.interestRate,
        trustScore: borrowerData?.trust_score?.current || "N/A",
        reason: "General Loan Request",
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("Application submitted successfully!");

      setLoanRequests((prev) => ({
        ...prev,
        [lender.id]: "pending",
      }));
    } catch (err) {
      console.error("Error sending loan request:", err);
      toast.error("Failed to send request.");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <DashboardWrapper>
      <div className="relative min-h-screen text-white p-4 md:p-8">
         {/* Background Elements */}
         <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
         <div className="fixed top-0 right-0 w-96 h-96 bg-purple-900/10 blur-[100px] rounded-full pointer-events-none" />

         <div className="relative z-10 max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Find a Lender
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Browse verified lenders and access capital instantly via smart contracts.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full md:w-auto relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-80 pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all text-white placeholder-gray-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-600" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
                    <p className="text-gray-500 animate-pulse">Scanning the blockchain for lenders...</p>
                </div>
            ) : filteredLenders.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                    <div className="inline-block p-4 rounded-full bg-gray-800 mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No lenders found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or come back later.</p>
                </div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredLenders.map((lender) => {
                        const status = loanRequests[lender.id];

                        return (
                            <motion.div
                                key={lender.id}
                                variants={cardVariants}
                                className="group relative bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/10"
                            >
                                {/* Decorative Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

                                {/* Lender Header */}
                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 p-[1px]">
                                            <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                                                <span className="font-bold text-lg text-white">
                                                    {lender.name ? lender.name.charAt(0) : "L"}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                                                {lender.name || "Verified Lender"}
                                            </h2>
                                            <div className="flex items-center gap-1 text-xs text-green-400">
                                                <BadgeCheck size={12} />
                                                <span>KYC Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                    {lender.location && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                                            <MapPin size={10} />
                                            {lender.location}
                                        </div>
                                    )}
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                        <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                                            <HandCoins size={12} /> Max Amount
                                        </p>
                                        <p className="text-xl font-bold text-white">{lender.maxAmount} <span className="text-xs font-normal text-gray-400">ETH</span></p>
                                    </div>
                                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                        <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                                            <Percent size={12} /> Interest
                                        </p>
                                        <p className="text-xl font-bold text-green-400">{lender.interestRate}%</p>
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="relative z-10">
                                    {!isConnected ? (
                                        <Button disabled className="w-full bg-gray-700/50 text-gray-400 border border-gray-600 border-dashed cursor-not-allowed">
                                            <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
                                        </Button>
                                    ) : status === "approved" ? (
                                        <div className="w-full py-2.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-center flex items-center justify-center gap-2">
                                            <BadgeCheck size={18} /> Loan Approved
                                        </div>
                                    ) : status === "rejected" ? (
                                        <div className="w-full py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-center">
                                            Application Rejected
                                        </div>
                                    ) : status === "pending" ? (
                                        <div className="w-full py-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold text-center flex items-center justify-center gap-2 animate-pulse">
                                            <Loader2 size={16} className="animate-spin" /> Processing
                                        </div>
                                    ) : (
                                        <Button 
                                            onClick={() => handleApply(lender)}
                                            disabled={applyingId === lender.id}
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-6 rounded-xl shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transition-all transform hover:scale-[1.02]"
                                        >
                                            {applyingId === lender.id ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Request...
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-between w-full">
                                                    <span>Apply Now</span>
                                                    <ArrowRight size={18} />
                                                </div>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
         </div>
      </div>
    </DashboardWrapper>
  );
};

export default LenderList;