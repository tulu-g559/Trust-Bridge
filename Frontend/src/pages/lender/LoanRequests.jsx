import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { auth, db as firestore } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import DashboardWrapper from "../../components/shared/DashboardWrapper";
import { 
  User, 
  Timer, 
  Trash2, 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowUpRight,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { ethers } from 'ethers';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { motion, AnimatePresence } from "framer-motion";

// Sepolia Network Configuration
const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL;

const isSepoliaNetwork = (chainId) => chainId === SEPOLIA_CHAIN_ID;

export default function LoanRequests() {
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const { address: walletAddress, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: walletAddress,
    watch: true,
  });

  const chainId = useChainId();
  const isValidNetwork = isSepoliaNetwork(chainId);

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // --- Logic ---
  const addSepoliaNetwork = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
          chainName: 'Sepolia Test Network',
          nativeCurrency: { name: 'Sepolia ETH', symbol: 'SEP', decimals: 18 },
          rpcUrls: [SEPOLIA_RPC_URL],
          blockExplorerUrls: ['https://sepolia.etherscan.io/']
        }]
      });
    } catch (error) {
      console.error('Error adding Sepolia network:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(firestore, "loanRequests"),
      where("lenderId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedRequests = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const borrowerId = data.borrowerId;

          try {
            const borrowerDoc = await getDoc(doc(firestore, "users", borrowerId));
            const borrowerData = borrowerDoc.data();
            
            return { 
              id: docSnap.id, 
              ...data, 
              borrowerName: borrowerData?.fullName || "Anonymous",
              borrowerWallet: borrowerData?.walletAddress,
              trustScore: borrowerData?.trust_score?.current || "N/A",
              trustScoreUpdated: borrowerData?.trust_score?.updated_at
            };
          } catch (error) {
            console.error("Error fetching borrower details:", error);
            return { 
              id: docSnap.id, 
              ...data, 
              borrowerName: "Anonymous", 
              borrowerWallet: null, 
              trustScore: "N/A" 
            };
          }
        })
      );

      const sorted = fetchedRequests.sort((a, b) => {
        const statusOrder = { pending: 0, approved: 1, rejected: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });

      setRequests(sorted);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpdate = async (id, status) => {
    if (!isConnected) return toast.error("Please connect your wallet first");
    if (!isValidNetwork) {
      toast.error("Please switch to Sepolia network");
      addSepoliaNetwork();
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [status]: true } }));

    try {
      const requestRef = doc(firestore, "loanRequests", id);
      const requestSnap = await getDoc(requestRef);
      const request = requestSnap.data();

      if (status === "approved") {
        if (!window.ethereum) throw new Error("Please install MetaMask");
        if (!request.borrowerWallet) throw new Error("Borrower wallet address not found");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const amount = ethers.parseEther(request.amount.toString());
        const walletBalance = await provider.getBalance(walletAddress);
        
        if (walletBalance < amount) throw new Error("Insufficient Sepolia ETH balance");

        const tx = await signer.sendTransaction({ to: request.borrowerWallet, value: amount });
        
        toast.info("Transaction submitted, waiting for confirmation...");
        const receipt = await tx.wait();

        await updateDoc(requestRef, {
          status,
          transactionHash: receipt.hash,
          transferredAt: serverTimestamp(),
          transferAmount: request.amount,
          chainId: SEPOLIA_CHAIN_ID
        });

        await addDoc(collection(firestore, "notifications"), {
          userId: request.borrowerId,
          type: "loan_status_update",
          status,
          message: `Your loan request for ${request.amount} Sepolia ETH has been approved!`,
          requestId: id,
          transactionHash: receipt.hash,
          createdAt: serverTimestamp(),
        });

        toast.success("Loan approved and funds transferred!");
      } else {
        await updateDoc(requestRef, { status, updatedAt: serverTimestamp() });
        await addDoc(collection(firestore, "notifications"), {
          userId: request.borrowerId,
          type: "loan_status_update",
          status,
          message: `Your loan request has been ${status}.`,
          requestId: id,
          createdAt: serverTimestamp(),
        });
        toast.success(`Loan request ${status}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update loan request");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [status]: false } }));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this loan request?")) return;
    try {
      await deleteDoc(doc(firestore, "loanRequests", id));
      toast.success("Loan request deleted");
    } catch (error) {
      toast.error("Failed to delete request");
    }
  };

  // --- Render ---
  return (
    <DashboardWrapper>
      <div className="relative min-h-screen text-white p-4 md:p-8">
        {/* Background Elements */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Loan Requests
                    </h1>
                    <p className="text-gray-400">Review incoming applications and deploy capital.</p>
                </div>
                
                {balance && (
                    <div className="bg-gray-900/50 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <Wallet size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Wallet Balance</p>
                            <p className="text-white font-mono font-bold">{parseFloat(ethers.formatEther(balance.value)).toFixed(4)} SEP</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Network Warnings */}
            {!isConnected && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
                    <Wallet className="text-yellow-500" />
                    <p className="text-yellow-200">Connect your wallet to approve loans and transfer funds.</p>
                </motion.div>
            )}

            {isConnected && !isValidNetwork && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-red-500" />
                        <p className="text-red-200">Wrong Network. Please switch to Sepolia Testnet.</p>
                    </div>
                    <button onClick={addSepoliaNetwork} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-colors">
                        Switch Network
                    </button>
                </motion.div>
            )}

            {/* Requests List */}
            {requests.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="text-gray-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Requests Pending</h3>
                    <p className="text-gray-400">Waiting for borrowers to apply for your loans.</p>
                </div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-6"
                >
                    {requests.map((req) => {
                        const score = parseInt(req.trustScore) || 0;
                        const scoreColor = score >= 75 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400";
                        const scoreBg = score >= 75 ? "bg-green-500/10 border-green-500/20" : score >= 50 ? "bg-yellow-500/10 border-yellow-500/20" : "bg-red-500/10 border-red-500/20";

                        return (
                            <motion.div
                                key={req.id}
                                variants={cardVariants}
                                className="group bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                                    
                                    {/* Borrower Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold border border-white/10">
                                                {req.borrowerName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white leading-none">{req.borrowerName}</h3>
                                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                                    {req.borrowerWallet ? `${req.borrowerWallet.slice(0, 6)}...${req.borrowerWallet.slice(-4)}` : "No Wallet Linked"}
                                                </p>
                                            </div>
                                            <div className={`ml-4 px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${scoreBg} ${scoreColor}`}>
                                                <ShieldCheck size={12} />
                                                Trust Score: {req.trustScore}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                                            <div>
                                                <span className="text-gray-500 block text-xs uppercase tracking-wider mb-0.5">Amount</span>
                                                <span className="text-white font-mono text-lg">{req.amount} SEP</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block text-xs uppercase tracking-wider mb-0.5">Interest</span>
                                                <span className="text-green-400 font-mono text-lg">{req.interestRate}%</span>
                                            </div>
                                            <div className="flex-1 min-w-[200px]">
                                                <span className="text-gray-500 block text-xs uppercase tracking-wider mb-0.5">Reason</span>
                                                <span className="text-gray-300 italic">{req.reason || "No reason provided"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
                                        {req.status === "pending" ? (
                                            <div className="flex gap-3 w-full lg:w-auto">
                                                <button
                                                    onClick={() => handleUpdate(req.id, "rejected")}
                                                    disabled={loadingStates[req.id]?.rejected}
                                                    className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                                >
                                                    {loadingStates[req.id]?.rejected ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={18} />}
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleUpdate(req.id, "approved")}
                                                    disabled={loadingStates[req.id]?.approved || !isConnected || !isValidNetwork}
                                                    className="flex-1 lg:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loadingStates[req.id]?.approved ? (
                                                        <> <Loader2 className="animate-spin" size={16} /> Processing </>
                                                    ) : (
                                                        <> <CheckCircle2 size={18} /> Approve & Send </>
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-end gap-2">
                                                <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${
                                                    req.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                                }`}>
                                                    {req.status === "approved" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </div>
                                                
                                                {req.transactionHash && (
                                                    <a 
                                                        href={`https://sepolia.etherscan.io/tx/${req.transactionHash}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                                    >
                                                        View On-Chain <ArrowUpRight size={12} />
                                                    </a>
                                                )}

                                                <button 
                                                    onClick={() => handleDelete(req.id)}
                                                    className="mt-2 text-gray-600 hover:text-red-400 transition-colors"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
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
}