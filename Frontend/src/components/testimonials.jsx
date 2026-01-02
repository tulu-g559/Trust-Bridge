"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "../components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Kenya",
      role: "Retail Owner",
      quote:
        "TrustBridge helped me secure funding for my small business when traditional banks wouldn't even look at my application. Now my shop is thriving!",
      rating: 5,
      loanAmount: "$1,200",
    },
    {
      name: "Miguel Hernandez",
      location: "Mexico",
      role: "Fisherman",
      quote:
        "I needed a small loan to repair my fishing boat. TrustBridge saw my potential when no one else would. I've since repaid and taken a second loan to expand.",
      rating: 5,
      loanAmount: "$800",
    },
    {
      name: "Priya Patel",
      location: "India",
      role: "Artisan",
      quote:
        "As a woman entrepreneur in my village, getting loans was impossible. TrustBridge gave me a chance based on who I am, not my lack of credit history.",
      rating: 5,
      loanAmount: "$650",
    },
    {
      name: "Emmanuel Okafor",
      location: "Nigeria",
      role: "Tech Student",
      quote:
        "The Trust Score system is revolutionary! I've been able to fund my education and start a small tech repair business thanks to TrustBridge.",
      rating: 4,
      loanAmount: "$1,500",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      handleNext()
    }, 6000)

    return () => clearInterval(interval)
  }, [autoplay, currentIndex])

  const handlePrev = () => {
    setAutoplay(false)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setAutoplay(false) // Pause autoplay on manual interaction
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  return (
    <section className="relative py-24 bg-black text-white overflow-hidden">
      {/* --- Background Elements --- */}
      
      {/* 1. Consistent Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* 2. Spotlight Glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight poppins-regular"
          >
            Real Stories{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 michroma-regular">
              Real Impact
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg poppins-regular"
          >
            See how decentralized lending is unlocking opportunities for ambitious individuals worldwide.
          </motion.p>
        </div>

        {/* Carousel Area */}
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-8 md:p-14 shadow-2xl"
            >
              {/* Decorative Big Quote Icon */}
              <Quote className="absolute top-6 right-8 w-24 h-24 text-white/5 rotate-180 pointer-events-none" />

              <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-900/50">
                    <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <span className="text-4xl font-bold text-white font-mono">
                        {testimonials[currentIndex].name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-full px-4 py-1 border border-white/5">
                     <span className="text-xs font-mono text-purple-300 uppercase tracking-widest">Verified Borrower</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start mb-4 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonials[currentIndex].rating 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-700"
                        }`}
                      />
                    ))}
                  </div>

                  <blockquote className="text-xl md:text-2xl font-light italic mb-8 text-gray-200 leading-relaxed">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>

                  <div className="flex flex-col md:flex-row md:items-end justify-between border-t border-white/10 pt-6">
                    <div>
                      <p className="text-2xl font-bold text-white mb-1">{testimonials[currentIndex].name}</p>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-sm">
                        <span>{testimonials[currentIndex].role}</span>
                        <span>•</span>
                        <span>{testimonials[currentIndex].location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end">
                      <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Funded Amount</span>
                      <span className="font-mono text-2xl font-bold text-green-400 shadow-green-900/20 drop-shadow-lg">
                        {testimonials[currentIndex].loanAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 px-4">
            
            {/* Left Arrow */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="rounded-full text-gray-400 hover:text-white hover:bg-white/10 w-12 h-12 border border-white/10 transition-all hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Dots */}
            <div className="flex items-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAutoplay(false)
                    setCurrentIndex(index)
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === index 
                      ? "w-8 h-2 bg-gradient-to-r from-purple-500 to-blue-500" 
                      : "w-2 h-2 bg-gray-700 hover:bg-gray-500"
                  }`}
                >
                  <span className="sr-only">Testimonial {index + 1}</span>
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="rounded-full text-gray-400 hover:text-white hover:bg-white/10 w-12 h-12 border border-white/10 transition-all hover:scale-110"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}