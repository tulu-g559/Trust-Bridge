import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Header from "../components/header";
import Footer from "../components/footer";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, CreditCard, Wallet, 
  Camera, Edit2, ShieldCheck, Loader2, Save, X 
} from "lucide-react";

export default function Profile() {
  const [user] = useAuthState(auth);
  const { address, isConnected } = useAccount();

  const [profileData, setProfileData] = useState({
    fullName: "",
    bio: "",
    email: "",
    phone: "",
    panId: "",
    photoURL: "",
    walletAddress: "",
  });

  const [role, setRole] = useState(() => localStorage.getItem("userRole") || "borrower");
  const [collectionPath, setCollectionPath] = useState(() => localStorage.getItem("userType") === "lender" ? "lenders" : "users");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load Cloudinary script
  useEffect(() => {
    const scriptId = "cloudinary-widget";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.async = true;
      script.id = scriptId;
      document.body.appendChild(script);
    }
  }, []);

  // Fetch Profile Data
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      const uid = user.uid;
      
      try {
        const collection = localStorage.getItem("userType") === "lender" ? "lenders" : "users";
        const ref = doc(db, collection, uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setCollectionPath(collection);
          setProfileData({
            fullName: data.fullName || "",
            bio: data.bio || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            panId: data.panId || "",
            photoURL: data.photoURL || "",
            walletAddress: data.walletAddress || "",
          });
          const userRole = collection === "lenders" ? "lender" : "borrower";
          setRole(userRole);
        } else {
            // Fallback to check other collection
             const altCollection = collection === "lenders" ? "users" : "lenders";
             const altRef = doc(db, altCollection, uid);
             const altSnap = await getDoc(altRef);
             if(altSnap.exists()){
                const data = altSnap.data();
                setCollectionPath(altCollection);
                setProfileData({
                    fullName: data.fullName || "",
                    bio: data.bio || "",
                    email: data.email || user.email || "",
                    phone: data.phone || "",
                    panId: data.panId || "",
                    photoURL: data.photoURL || "",
                    walletAddress: data.walletAddress || "",
                });
                const userRole = altCollection === "lenders" ? "lender" : "borrower";
                setRole(userRole);
             }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Sync Wallet Address
  useEffect(() => {
    const updateWallet = async () => {
      if (user && isConnected && address && profileData.walletAddress !== address) {
        try {
          const ref = doc(db, collectionPath, user.uid);
          await setDoc(ref, { walletAddress: address }, { merge: true });
          setProfileData((prev) => ({ ...prev, walletAddress: address }));
          toast.success("Wallet connected & saved to profile");
        } catch (err) {
          console.error("Error updating wallet:", err);
        }
      }
    };
    updateWallet();
  }, [isConnected, address, collectionPath, user]);

  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!user) return;
      const ref = doc(db, collectionPath, user.uid);
      await setDoc(ref, { ...profileData, role }, { merge: true });
      toast.success("Profile updated successfully");
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloudinaryUpload = () => {
    if (!window.cloudinary || !window.cloudinary.createUploadWidget) {
      return toast.error("Cloudinary not ready.");
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dg3fyadhh",
        uploadPreset: "avatar_preset",
        folder: "avatars",
        cropping: true,
        sources: ["local", "url", "camera"],
        styles: {
            palette: {
                window: "#000000",
                windowBorder: "#90A0B3",
                tabIcon: "#9333ea",
                menuIcons: "#5A616A",
                textDark: "#000000",
                textLight: "#FFFFFF",
                link: "#9333ea",
                action: "#FF620C",
                inactiveTabIcon: "#0E2F5A",
                error: "#F44235",
                inProgress: "#0078FF",
                complete: "#20B832",
                sourceBg: "#1a1a1a"
            }
        }
      },
      async (err, result) => {
        if (!err && result && result.event === "success") {
          const img = result.info.secure_url;
          try {
            await setDoc(doc(db, collectionPath, user.uid), { photoURL: img }, { merge: true });
            setProfileData((prev) => ({ ...prev, photoURL: img }));
            toast.success("Photo updated");
          } catch (err) {
            toast.error("Failed to save photo");
          }
        }
      }
    );
    widget.open();
  };

  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Please log in to view your profile.</p>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
    </div>
  );

  return (
    <div className="bg-black min-h-screen flex flex-col font-sans text-gray-100">
      <Header />
      
      <main className="flex-grow relative pt-28 pb-20 px-4">
        {/* --- Background --- */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-900/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10">
            
            {/* --- Top Control Bar --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    My Identity
                </h1>
                <div className="flex items-center gap-4">
                     <ConnectButton accountStatus="address" showBalance={false} />
                     <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-xl transition-all"
                     >
                        <Edit2 size={16} />
                        <span>Edit Profile</span>
                     </button>
                </div>
            </div>

            {/* --- Main Profile Card --- */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
                {/* Banner/Header of Card */}
                <div className="h-40 bg-gradient-to-r from-purple-900/50 to-blue-900/50 relative">
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>

                <div className="px-8 pb-8">
                    {/* Avatar & Key Info */}
                    <div className="relative flex flex-col md:flex-row items-end md:items-center gap-6 -mt-16 mb-8">
                        <div className="relative group">
                            <img
                                src={profileData.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${profileData.fullName}`}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-black bg-black object-cover shadow-lg shadow-purple-500/20"
                            />
                            <button 
                                onClick={handleCloudinaryUpload}
                                className="absolute bottom-1 right-1 bg-gray-800 p-2 rounded-full border border-gray-600 text-white hover:bg-purple-600 transition-colors"
                            >
                                <Camera size={16} />
                            </button>
                        </div>
                        
                        <div className="flex-1 mb-2">
                            <h2 className="text-3xl font-bold text-white">{profileData.fullName || "Anonymous User"}</h2>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                    role === "lender" 
                                    ? "bg-blue-500/10 border-blue-500/50 text-blue-400" 
                                    : "bg-purple-500/10 border-purple-500/50 text-purple-400"
                                }`}>
                                    {role}
                                </span>
                                {profileData.walletAddress && (
                                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs">
                                        <Wallet size={12} />
                                        Connected
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <User size={14} /> About Me
                        </h3>
                        <p className="text-gray-200 leading-relaxed">
                            {profileData.bio || "No bio added yet. Click edit to tell us about yourself."}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DetailCard 
                            icon={<Mail className="text-blue-400" />} 
                            label="Email Address" 
                            value={profileData.email} 
                        />
                        <DetailCard 
                            icon={<Phone className="text-purple-400" />} 
                            label="Phone Number" 
                            value={profileData.phone || "Not Verified"} 
                        />
                        <DetailCard 
                            icon={<CreditCard className="text-pink-400" />} 
                            label="PAN / Tax ID" 
                            value={profileData.panId || "Not Provided"} 
                            isSecure
                        />
                         <DetailCard 
                            icon={<Wallet className="text-green-400" />} 
                            label="Wallet Address" 
                            value={profileData.walletAddress ? `${profileData.walletAddress.slice(0, 6)}...${profileData.walletAddress.slice(-4)}` : "No Wallet Connected"} 
                        />
                    </div>
                </div>
            </motion.div>
        </div>
      </main>

      {/* --- Edit Modal --- */}
      <AnimatePresence>
        {isEditModalOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                >
                    <div className="flex justify-between items-center p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                        <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <InputGroup label="Full Name" value={profileData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
                        <InputGroup label="Bio" value={profileData.bio} onChange={(e) => handleChange("bio", e.target.value)} isTextArea />
                        <InputGroup label="Phone Number" value={profileData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                        <InputGroup label="PAN ID" value={profileData.panId} onChange={(e) => handleChange("panId", e.target.value)} />
                    </div>

                    <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                        <button 
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-purple-900/20 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Save Changes
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// --- Sub-Components ---

function DetailCard({ icon, label, value, isSecure }) {
    return (
        <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:border-purple-500/30 transition-colors">
            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                {icon}
            </div>
            <div className="overflow-hidden">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-white font-medium truncate">
                    {isSecure && value && value.length > 4 
                        ? `•••• •••• ${value.slice(-4)}` 
                        : value}
                </p>
            </div>
        </div>
    )
}

function InputGroup({ label, value, onChange, isTextArea }) {
    return (
        <div>
            <label className="block text-sm text-gray-400 mb-1.5 ml-1">{label}</label>
            {isTextArea ? (
                <textarea 
                    value={value} 
                    onChange={onChange}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
            ) : (
                <input 
                    type="text" 
                    value={value} 
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
            )}
        </div>
    )
}