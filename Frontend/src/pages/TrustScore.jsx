import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, 
  Loader2, 
  ShieldCheck, 
  ScanLine, 
  CreditCard, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Database
} from "lucide-react";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import DashboardWrapper from "../components/shared/DashboardWrapper";

export default function TrustScore() {
  const [user] = useAuthState(auth);
  const [aadhar, setAadhar] = useState(null);
  const [pan, setPan] = useState(null);
  const [phone, setPhone] = useState("");
  const [verified, setVerified] = useState(false);
  const [financialDocs, setFinancialDocs] = useState([]);
  const [trustScore, setTrustScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const fileInputRef = useRef();

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const handleVerification = async () => {
    if (!aadhar || !pan || phone.length !== 10) {
      toast.error("Please upload Aadhaar, PAN, and enter a valid mobile number.");
      return;
    }
    setVerifying(true);
    try {
      const formData = new FormData();
      formData.append("uid", user?.uid || "");
      formData.append("phone", phone);
      formData.append("document", aadhar);
      formData.append("document", pan);

      const response = await fetch(`${BACKEND_URL}/vision/first-trustscore`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok && !data.error) {
        setVerified(true);
        setTrustScore(data.trust_score || 0);
        toast.success("Identity verified successfully!");
      } else {
        setVerified(false);
        toast.error(data.error || "Verification failed.");
      }
    } catch (error) {
      setVerified(false);
      toast.error("Verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  const handleFinancialDocs = (e) => {
    if (!verified) return toast.info("Please complete identity verification first.");
    const newFiles = Array.from(e.target.files || []);
    setFinancialDocs((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeFinancialDoc = (index) => {
    setFinancialDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (!verified) return toast.error("Please complete identity verification first.");
    if (!user) return toast.error("Please login first.");
    if (financialDocs.length === 0) return toast.error("Please upload at least one financial document.");
    
    setLoading(true);
    const formData = new FormData();
    formData.append("uid", user.uid);
    financialDocs.forEach((file) => formData.append("document", file));
    
    try {
      const response = await fetch(`${BACKEND_URL}/vision/financial-trustscore`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setTrustScore(data.trust_score);
        toast.success("Trust Score updated!");
      } else {
        throw new Error(data.error || "Failed to process documents");
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload documents");
    } finally {
      setLoading(false);
    }
  };

  // --- Sub-components ---
  
  const FileUploadBox = ({ label, file, setFile, icon: Icon, disabled, accept }) => (
    <div className={`relative group border border-dashed rounded-xl p-6 transition-all duration-300 ${
        file 
        ? "border-green-500/50 bg-green-500/5" 
        : disabled 
            ? "border-gray-700 bg-gray-900/50 opacity-50 cursor-not-allowed" 
            : "border-gray-600 hover:border-purple-500 hover:bg-white/5 cursor-pointer"
    }`}>
      <input
        type="file"
        accept={accept || ".pdf,.jpg,.jpeg,.png"}
        onChange={(e) => setFile(e.target.files[0])}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="flex flex-col items-center justify-center text-center gap-2">
        {file ? (
            <div className="bg-green-500/20 p-3 rounded-full text-green-400">
                <CheckCircle2 size={24} />
            </div>
        ) : (
            <div className={`p-3 rounded-full ${disabled ? "bg-gray-800 text-gray-500" : "bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform"}`}>
                <Icon size={24} />
            </div>
        )}
        <div>
            <p className={`font-medium ${file ? "text-green-400" : "text-gray-300"}`}>
                {file ? "File Selected" : label}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                {file ? file.name : "Click or drag to upload"}
            </p>
        </div>
      </div>
    </div>
  );

  const CircularScore = ({ score }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Glow behind */}
        <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full"></div>
        
        <svg className="transform -rotate-90 w-64 h-64 relative z-10">
          {/* Track */}
          <circle
            cx="128" cy="128" r={radius}
            stroke="currentColor" strokeWidth="12" fill="transparent"
            className="text-gray-800"
          />
          {/* Progress */}
          <circle
            cx="128" cy="128" r={radius}
            stroke="url(#gradient)" strokeWidth="12" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
             <span className="text-6xl font-bold text-white tracking-tighter">{score}</span>
             <span className="text-sm text-gray-400 uppercase tracking-widest mt-1">Trust Score</span>
        </div>
      </div>
    );
  };

  return (
    <DashboardWrapper>
      <div className="relative min-h-screen text-white p-4 md:p-8">
         {/* Background Elements */}
         <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-12">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                    Trust Score Calculation
                </h1>
                <p className="text-gray-400 max-w-2xl text-lg">
                    Verify your identity and upload financial documents to generate your AI-powered creditworthiness score.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* --- Left Column: Verification Forms (Span 7) --- */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="lg:col-span-7 space-y-6"
                >
                    {/* Step 1: Identity */}
                    <motion.div variants={itemVariants} className={`bg-gray-900/40 backdrop-blur-xl border ${verified ? "border-green-500/30" : "border-white/10"} rounded-3xl p-8 relative overflow-hidden transition-all duration-500`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${verified ? "bg-green-500 text-black" : "bg-purple-600 text-white"}`}>1</div>
                            <h2 className="text-xl font-bold">Identity Verification</h2>
                            {verified && <span className="ml-auto text-green-400 flex items-center gap-1 text-sm"><CheckCircle2 size={16}/> Verified</span>}
                        </div>

                        {/* --- SIMULATION NOTICE --- */}
                        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                            <Database size={12} className="text-amber-400" />
                            <span>Note: Verification uses a Simulated Government Database Integration</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <FileUploadBox 
                                label="Upload Aadhaar" 
                                file={aadhar} 
                                setFile={setAadhar} 
                                icon={ScanLine} 
                                disabled={verified} 
                            />
                            <FileUploadBox 
                                label="Upload PAN" 
                                file={pan} 
                                setFile={setPan} 
                                icon={CreditCard} 
                                disabled={verified} 
                            />
                        </div>

                        <div className="relative mb-6">
                            <label className="text-gray-400 text-sm mb-2 block">Mobile Number linked to Aadhaar</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                maxLength={10}
                                disabled={verified}
                                placeholder="Enter 10-digit number"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors disabled:opacity-50"
                            />
                        </div>

                        {!verified && (
                            <button
                                onClick={handleVerification}
                                disabled={verifying}
                                className="w-full bg-white text-white font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {verifying ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
                                {verifying ? "Verifying..." : "Verify Identity"}
                            </button>
                        )}
                    </motion.div>

                    {/* Step 2: Financials */}
                    <motion.div 
                        variants={itemVariants} 
                        className={`bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden transition-all duration-500 ${!verified ? "opacity-50 pointer-events-none grayscale" : ""}`}
                    >
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold">2</div>
                            <h2 className="text-xl font-bold">Financial Proof</h2>
                        </div>

                        <div className="border-2 border-dashed border-gray-700 hover:border-purple-500/50 rounded-xl p-8 text-center transition-colors cursor-pointer bg-black/20" onClick={() => fileInputRef.current?.click()}>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                multiple
                                ref={fileInputRef}
                                onChange={handleFinancialDocs}
                                className="hidden"
                                disabled={!verified}
                            />
                            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                <UploadCloud size={24} />
                            </div>
                            <p className="text-gray-300 font-medium">Click to upload Bank Statements / ITR</p>
                            <p className="text-sm text-gray-500 mt-1">Supports PDF, JPG, PNG</p>
                        </div>

                        {/* File List */}
                        <AnimatePresence>
                            {financialDocs.length > 0 && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="mt-6 space-y-2"
                                >
                                    <p className="text-sm text-gray-400 mb-2">Uploaded Documents:</p>
                                    {financialDocs.map((doc, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText size={18} className="text-blue-400" />
                                                <span className="text-sm text-gray-300 truncate max-w-[200px]">{doc.name}</span>
                                            </div>
                                            <button onClick={() => removeFinancialDoc(i)} className="text-gray-500 hover:text-red-400 transition-colors">
                                                <X size={16} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleNext}
                            disabled={loading || financialDocs.length === 0}
                            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Calculate Score <ArrowRight size={18} /></span>}
                        </button>
                    </motion.div>
                </motion.div>

                {/* --- Right Column: Live Score Display (Span 5) --- */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="lg:col-span-5"
                >
                    <div className="sticky top-32">
                        <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                             {/* Abstract decoration */}
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                             
                             <h2 className="text-2xl font-bold mb-8">Live Trust Analysis</h2>
                             
                             <CircularScore score={trustScore} />
                             
                             <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Status</p>
                                    <p className={`font-bold ${verified ? "text-green-400" : "text-yellow-400"}`}>
                                        {verified ? "Verified" : "Pending"}
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Docs</p>
                                    <p className="text-white font-bold">{financialDocs.length} Uploaded</p>
                                </div>
                             </div>

                             {!verified && (
                                 <div className="mt-6 flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-left">
                                     <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                                     <p className="text-sm text-yellow-200/80">
                                         Complete Step 1 to unlock score calculation. Your data is encrypted securely.
                                     </p>
                                 </div>
                             )}
                        </div>
                    </div>
                </motion.div>

            </div>
         </div>
      </div>
    </DashboardWrapper>
  );
}