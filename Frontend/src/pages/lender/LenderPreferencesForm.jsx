import React, { useState } from "react";
import DashboardWrapper from "../../components/shared/DashboardWrapper";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { 
  HandCoins, 
  Percent, 
  MapPin, 
  User, 
  Save, 
  Loader2, 
  AlertTriangle, 
  Settings2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify"; // Assuming react-toastify based on previous context

const LenderPreferencesForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    maxAmount: "",
    interestRate: "",
    location: "",
  });

  const [warnings, setWarnings] = useState({
    maxAmount: "",
    interestRate: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const MAX_LEND_AMOUNT = 0.5; // in ETH
  const MAX_INTEREST_RATE = 10; // in %

  // --- Logic ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let warningText = "";

    if (name === "maxAmount" && parseFloat(value) > MAX_LEND_AMOUNT) {
      warningText = `Maximum allowed is ${MAX_LEND_AMOUNT} ETH`;
    }
    if (name === "interestRate" && parseFloat(value) > MAX_INTEREST_RATE) {
      warningText = `Maximum allowed is ${MAX_INTEREST_RATE}%`;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setWarnings((prev) => ({ ...prev, [name]: warningText }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const amount = parseFloat(formData.maxAmount);
    const interest = parseFloat(formData.interestRate);

    if (amount > MAX_LEND_AMOUNT || interest > MAX_INTEREST_RATE) {
      toast.error("Please resolve warnings before saving.");
      setSubmitting(false);
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("You must be signed in to save preferences.");
        setSubmitting(false);
        return;
      }

      const userId = user.uid;
      const lenderDocRef = doc(db, "lenders", userId);
      
      // Artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      await setDoc(lenderDocRef, formData, { merge: true });

      setFormData({ name: "", maxAmount: "", interestRate: "", location: "" });
      toast.success("Preferences updated successfully!");
    } catch (err) {
      console.error("Error saving preferences:", err);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <DashboardWrapper>
      <div className="relative min-h-screen text-white p-4 md:p-8 flex justify-center">
        
        {/* --- Background Elements --- */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
        <div className="fixed top-0 right-0 w-96 h-96 bg-teal-900/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-blue-900/20 blur-[100px] rounded-full pointer-events-none" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
              <Settings2 size={14} /> Configuration
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-100 to-teal-200">
              Lending Preferences
            </h1>
            <p className="text-gray-400 mt-2">
              Define your lending criteria to automate approvals and manage risk.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-600"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Display Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500 group-focus-within:text-teal-400 transition-colors" />
                  </div>
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Satoshi Ventures"
                    className="pl-12 bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 h-12 rounded-xl transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Amount Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Max Lend Amount</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HandCoins className="h-5 w-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                    </div>
                    <Input
                      name="maxAmount"
                      type="number"
                      step="0.001"
                      value={formData.maxAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                      className={`pl-12 pr-12 bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:ring-1 h-12 rounded-xl transition-all ${
                        warnings.maxAmount ? "border-yellow-500/50 focus:border-yellow-500 focus:ring-yellow-500" : "focus:border-teal-500 focus:ring-teal-500"
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-mono text-sm">ETH</span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {warnings.maxAmount && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-yellow-400 text-xs mt-1 pl-1">
                        <AlertTriangle size={12} /> {warnings.maxAmount}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Interest Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Interest Rate</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Percent className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <Input
                      name="interestRate"
                      type="number"
                      step="0.1"
                      value={formData.interestRate}
                      onChange={handleChange}
                      placeholder="0.0"
                      required
                      className={`pl-12 pr-12 bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:ring-1 h-12 rounded-xl transition-all ${
                        warnings.interestRate ? "border-yellow-500/50 focus:border-yellow-500 focus:ring-yellow-500" : "focus:border-teal-500 focus:ring-teal-500"
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-bold text-sm">%</span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {warnings.interestRate && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-yellow-400 text-xs mt-1 pl-1">
                        <AlertTriangle size={12} /> {warnings.interestRate}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Preferred Region</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-500 group-focus-within:text-red-400 transition-colors" />
                  </div>
                  <Input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Global, India, Europe"
                    className="pl-12 bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 h-12 rounded-xl transition-all"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-teal-900/20 hover:shadow-teal-900/40 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={20} /> Save Configuration
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </DashboardWrapper>
  );
};

export default LenderPreferencesForm;