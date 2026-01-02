import { Link } from "react-router-dom";
import { Twitter, Linkedin, Github } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About", to: "/about" },
        { name: "Team", to: "/team" },
        { name: "Careers", to: "/careers" },
        { name: "Press", to: "/press" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", to: "/blog" },
        { name: "FAQ", to: "/faq" },
        { name: "Support", to: "/support" },
        { name: "Documentation", to: "/documents" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", to: "/privacy" },
        { name: "Terms", to: "/terms" },
        { name: "Security", to: "/security" },
        { name: "Compliance", to: "/compliance" },
      ],
    },
  ];

  const socialLinks = [
    { 
      name: "X (Twitter)", 
      icon: <Twitter className="w-5 h-5" />, 
      to: "https://x.com/i_arnab_g" 
    },
    { 
      name: "LinkedIn", 
      icon: <Linkedin className="w-5 h-5" />, 
      to: "https://www.linkedin.com/in/arnab-g/" 
    },
    { 
      name: "GitHub", 
      icon: <Github className="w-5 h-5" />, 
      to: "https://github.com/tulu-g559" 
    },
  ];

  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* --- Background Elements --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column (Span 4) */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-full"></div>
                    <img
                    src="/tlogofinal.png"
                    alt="TrustBridge Logo"
                    className="h-10 w-auto relative z-10"
                    />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                TrustBridge
                </span>
            </Link>
            
            <p className="text-gray-400 mb-8 max-w-sm leading-relaxed text-sm poppins-regular">
              Reimagining financial inclusion through AI and blockchain. We help underserved individuals build credit and access capital without boundaries.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-purple-500/50 p-2.5 rounded-full transition-all duration-300"
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Spacer (Span 1) */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Columns (Span 7) */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((column, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase opacity-90">
                    {column.title}
                </h3>
                <ul className="space-y-4">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.to} 
                        className="text-gray-500 hover:text-purple-400 transition-colors text-sm flex items-center group"
                      >
                        <span className="relative">
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} TrustBridge. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy" className="text-gray-600 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-600 hover:text-white text-sm transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}