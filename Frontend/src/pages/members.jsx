import { motion } from "framer-motion";
import { Github, Linkedin, Code2, Cpu, Palette, Terminal } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

const teamMembers = [
  {
    name: "Ayon Paul",
    role: "Frontend Dev",
    image: "/ayon.jpg",
    icon: <Code2 className="w-4 h-4" />,
    socials: { github: "#", linkedin: "#" }
  },
  {
    name: "Arnab Ghosh",
    role: "FullStack Dev",
    image: "/arnab.jpg",
    icon: <Terminal className="w-4 h-4" />,
    socials: { github: "https://github.com/tulu-g559", linkedin: "#" } // Added your github based on context
  },
  {
    name: "Archak Khandayit",
    role: "Fullstack Dev",
    image: "/archak.jpg",
    icon: <Cpu className="w-4 h-4" />,
    socials: { github: "#", linkedin: "#" }
  },
  // Uncomment when ready
  // {
  //   name: "Soumi Das",
  //   role: "UI/UX Designer",
  //   image: "/soumi.jpg",
  //   icon: <Palette className="w-4 h-4" />,
  // },
  // {
  //   name: "Archismita Das",
  //   role: "Project Manager",
  //   image: "/archismita.jpg",
  //   icon: <Users className="w-4 h-4" />,
  // },
];

export default function MembersPage() {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow relative py-24 md:py-32 overflow-hidden">
        {/* --- Background Elements --- */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight michroma-regular"
            >
              The Minds Behind <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient-x rubik-maze-regular">
                TrustBridge
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto poppins-regular"
            >
              A passionate team of developers and designers building the future of decentralized finance.
            </motion.p>
          </div>

          {/* Team Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group relative w-full max-w-xs"
              >
                {/* Card Container */}
                <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]">
                  
                  {/* Image Area */}
                  <div className="relative mb-6 mx-auto w-40 h-40">
                    {/* Glowing ring behind image */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* The Image */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="relative w-full h-full object-cover rounded-full border-2 border-black/50 z-10"
                    />
                    
                    {/* Role Icon Badge */}
                    <div className="absolute bottom-0 right-0 z-20 bg-black border border-white/20 p-2 rounded-full text-purple-400 shadow-lg group-hover:scale-110 transition-transform">
                        {member.icon}
                    </div>
                  </div>

                  {/* Text Info */}
                  <div className="text-center relative z-10">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-6">
                      {member.role}
                    </p>

                    {/* Social Links (Slide up on hover) */}
                    <div className="flex justify-center gap-4 pt-4 border-t border-white/10">
                      <a href={member.socials?.github || "#"} className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
                        <Github className="w-5 h-5" />
                      </a>
                      <a href={member.socials?.linkedin || "#"} className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  
                  {/* Decorative background grain/noise */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}