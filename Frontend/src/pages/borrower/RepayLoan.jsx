import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import DashboardWrapper from "../../components/shared/DashboardWrapper";
import { db, auth } from "../../firebase";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { 
  Loader2, 
  Wallet, 
  ArrowRight, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft,
  Coins,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SEPOLIA_CHAIN_ID = 11155111;

export default function RepayLoan() {
  const [user] = useAuthState(auth);
  const { address: borrowerAddress, isConnected } = useAccount();
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const fetchApprovedLoans = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const q = query(
        collection(db, "loanRequests"),
        where("borrowerId", "==", user.uid),
        where("status", "==", "approved")
      );

      const snapshot = await getDocs(q);

      const loansData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const loan = { id: docSnap.id, ...docSnap.data() };

          try {
            const lenderDoc = await getDoc(doc(db, "lenders", loan.lenderId));
            if (!lenderDoc.exists()) return null;

            const lenderData = lenderDoc.data();
            
            const repaymentsQuery = query(
              collection(db, "repayments"),
              where("loanId", "==", docSnap.id),
              where("borrowerId", "==", user.uid)
            );
            const repaymentsSnapshot = await getDocs(repaymentsQuery);
            const repayments = repaymentsSnapshot.docs;

            const totalAmount = parseFloat(loan.amount);
            const interestRate = parseFloat(loan.interestRate);
            const totalWithInterest = totalAmount * (1 + interestRate / 100);
            const emi = totalWithInterest / 6;

            const storedRepayments = loan.repaidInstallments || 0;
            const actualRepayments = repayments.length;
            const repaidInstallments = Math.max(storedRepayments, actualRepayments);

            return {
              ...loan,
              lenderWallet: lenderData.walletAddress,
              lenderName: lenderData.name || "Anonymous",
              repaidInstallments,
              totalAmount,
              totalWithInterest,
              emi,
              remainingAmount: totalWithInterest - (repaidInstallments * emi),
              lastRepaymentHash: loan.lastRepaymentHash,
              lastRepaymentDate: loan.lastRepaymentDate?.toDate()
            };
          } catch (error) {
            console.error(`Error processing loan ${loan.id}:`, error);
            return null;
          }
        })
      );

      const validLoans = loansData.filter(loan =>
        loan &&
        ethers.isAddress(loan.lenderWallet) &&
        loan.repaidInstallments < 6
      );

      setApprovedLoans(validLoans);

    } catch (error) {
      console.error("Error fetching approved loans:", error);
      toast.error("Failed to load approved loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isConnected) {
      fetchApprovedLoans();
    }
  }, [user, isConnected]);

  const handleSelect = (loan) => {
    if (!isConnected) return toast.error("Please connect your wallet first");
    if (!loan.lenderWallet || !ethers.isAddress(loan.lenderWallet)) return toast.error("Invalid lender wallet address");
    setSelectedLoan(loan);
  };

  const handleRepayInstallment = async () => {
    if (!selectedLoan || !isConnected) return toast.error("Please connect your wallet first");
    
    setProcessing(true);

    try {
      if (!window.ethereum) throw new Error("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(SEPOLIA_CHAIN_ID)) throw new Error("Please switch to Sepolia network");

      const balance = await provider.getBalance(borrowerAddress);
      const amountInWei = ethers.parseEther(selectedLoan.emi.toFixed(18)); // Ensure generic string handling
      
      if (balance < amountInWei) throw new Error("Insufficient Sepolia ETH balance");

      const tx = await signer.sendTransaction({
        to: selectedLoan.lenderWallet,
        value: amountInWei,
        gasLimit: 21000 // Simple transfer
      });

      toast.info("Transaction submitted, waiting for confirmation...");

      const receipt = await tx.wait();

      await addDoc(collection(db, "repayments"), {
        loanId: selectedLoan.id,
        borrowerId: user.uid,
        lenderId: selectedLoan.lenderId,
        amount: selectedLoan.emi,
        transactionHash: receipt.hash,
        installmentNumber: selectedLoan.repaidInstallments + 1,
        createdAt: serverTimestamp(),
      });

      const loanDocRef = doc(db, "loanRequests", selectedLoan.id);
      await updateDoc(loanDocRef, {
        repaidInstallments: increment(1),
        lastRepaymentHash: receipt.hash,
        lastRepaymentDate: serverTimestamp(),
        remainingAmount: selectedLoan.remainingAmount - selectedLoan.emi
      });

      await fetchApprovedLoans();
      
      toast.success(`Installment paid successfully!`, {
        action: {
          label: "View Tx",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${receipt.hash}`, '_blank')
        },
      });

      setSelectedLoan(null);
    } catch (error) {
      console.error("Repayment failed:", error);
      toast.error(error.message || "Failed to process repayment");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardWrapper>
      <div className="relative min-h-screen text-white p-4 md:p-8">
         {/* Background Elements */}
         <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

         <div className="max-w-5xl mx-auto relative z-10">
            <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                Loan Repayment Portal
            </h1>

            {!isConnected && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8 flex items-center gap-3"
                >
                    <Wallet className="text-yellow-500" />
                    <p className="text-yellow-200">Wallet not connected. Connect your wallet to enable repayments.</p>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {selectedLoan ? (
                    /* --- Detailed Payment View --- */
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid md:grid-cols-2 gap-8"
                    >
                        {/* Receipt Card */}
                        <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500"></div>
                             
                             <button 
                                onClick={() => setSelectedLoan(null)}
                                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                             >
                                <ChevronLeft size={16} /> Back to list
                             </button>

                             <h2 className="text-2xl font-bold mb-1">Repayment Details</h2>
                             <p className="text-gray-400 text-sm mb-6">Review transaction before confirming</p>

                             <div className="space-y-4 bg-black/20 rounded-xl p-4 border border-white/5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Pay To</span>
                                    <span className="font-mono text-blue-300">{selectedLoan.lenderName}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Wallet</span>
                                    <span className="font-mono text-gray-300">
                                        {selectedLoan.lenderWallet?.slice(0, 6)}...{selectedLoan.lenderWallet?.slice(-4)}
                                    </span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Installment #</span>
                                    <span className="text-white font-bold">{selectedLoan.repaidInstallments + 1} / 6</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Amount Due</span>
                                    <span className="text-2xl font-bold text-white">{selectedLoan.emi.toFixed(4)} <span className="text-sm font-normal text-gray-500">SEP</span></span>
                                </div>
                             </div>

                             <div className="mt-8">
                                <Button
                                    disabled={processing || !isConnected}
                                    onClick={handleRepayInstallment}
                                    className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-bold py-6 rounded-xl shadow-lg shadow-teal-900/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <> <Loader2 className="animate-spin" /> Processing Blockchain Tx... </>
                                    ) : (
                                        <> Confirm Payment <ArrowRight size={18} /> </>
                                    )}
                                </Button>
                             </div>
                        </div>

                        {/* Info Panel */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <History size={18} className="text-teal-400" /> Loan Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Original Principal</span>
                                        <span className="text-white">{selectedLoan.totalAmount.toFixed(4)} SEP</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Total with Interest ({selectedLoan.interestRate}%)</span>
                                        <span className="text-white">{selectedLoan.totalWithInterest.toFixed(4)} SEP</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                                        <span className="text-gray-400">Remaining Balance</span>
                                        <span className="text-teal-400 font-bold">{selectedLoan.remainingAmount.toFixed(4)} SEP</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6">
                                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-blue-200">
                                    <CreditCard size={18} /> Smart Contract
                                </h3>
                                <p className="text-sm text-blue-200/80">
                                    This payment interacts directly with the Sepolia Testnet. Ensure you have sufficient gas fees.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                ) : (
                    /* --- Loan List View --- */
                    <motion.div
                        key="list"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {loading ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-teal-500 mb-4" />
                                <p className="text-gray-500">Loading your loans...</p>
                            </div>
                        ) : approvedLoans.length === 0 ? (
                            <div className="col-span-full bg-white/5 border border-white/5 border-dashed rounded-3xl p-12 text-center">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="text-gray-500" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Active Loans</h3>
                                <p className="text-gray-400">You don't have any approved loans pending repayment.</p>
                            </div>
                        ) : (
                            approvedLoans.map((loan) => (
                                <motion.div
                                    key={loan.id}
                                    variants={cardVariants}
                                    className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Lender</p>
                                            <h3 className="text-lg font-bold text-white">{loan.lenderName}</h3>
                                        </div>
                                        <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                                            <Coins size={20} />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">Progress</span>
                                            <span className="text-white font-mono">{loan.repaidInstallments}/6</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(loan.repaidInstallments / 6) * 100}%` }}
                                                className="h-full bg-gradient-to-r from-teal-500 to-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">EMI Amount</span>
                                            <span className="text-white font-mono">{loan.emi.toFixed(4)} SEP</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Remaining</span>
                                            <span className="text-gray-200 font-mono">{loan.remainingAmount.toFixed(4)} SEP</span>
                                        </div>
                                    </div>

                                    {loan.lastRepaymentHash && (
                                        <a 
                                            href={`https://sepolia.etherscan.io/tx/${loan.lastRepaymentHash}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block text-xs text-center text-blue-400 hover:underline mb-4"
                                        >
                                            View Last Transaction ↗
                                        </a>
                                    )}

                                    <Button
                                        onClick={() => handleSelect(loan)}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-teal-500/50"
                                    >
                                        Proceed to Pay
                                    </Button>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
         </div>
      </div>
    </DashboardWrapper>
  );
}