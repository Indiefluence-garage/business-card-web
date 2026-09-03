'use client';

import { useRef, useState, useEffect } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles,
  Camera,
  ArrowRight
} from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const businessCards = [
  {
    name: 'Elena Rostova',
    title: 'Managing Partner',
    company: 'Apex Horizon',
    email: 'elena@apexhorizon.vc',
    phone: '(415) 890-3421',
    location: 'San Francisco, CA',
  },
  {
    name: 'Marcus Chen',
    title: 'Chief Tech Officer',
    company: 'Nexus Dynamics',
    email: 'm.chen@nexus.io',
    phone: '(212) 555-0198',
    location: 'New York, NY',
  },
  {
    name: 'Sarah Jenkins',
    title: 'Design Director',
    company: 'Creative Studio',
    email: 'sarah@creative.co',
    phone: '(310) 555-0142',
    location: 'Los Angeles, CA',
  }
];

export function ScannerDemo() {
  const containerRef = useRef(null);
  // trigger animation only when at least 50% of the section is visible
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return; // Only cycle when in view

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % businessCards.length);
    }, 7000); // 7 seconds per card

    return () => clearInterval(interval);
  }, [isInView]);

  const activeCard = businessCards[currentIndex];

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 relative"
    >
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />


      {/* Main interactive flex layout (Centering everything perfectly) */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-8 relative z-10 w-full">
        
        {/* Left: The Phone Scanner */}
        <div className="relative w-full max-w-[280px] lg:max-w-[310px] shrink-0">
          {/* Phone Frame Mockup */}
          <div className="relative aspect-[9/16] rounded-[2.5rem] lg:rounded-[3rem] border-[6px] lg:border-[8px] border-slate-800 bg-black shadow-[0_0_60px_-15px_rgba(34,211,238,0.3)] overflow-hidden flex flex-col justify-center items-center">
            {/* Camera notch */}
            <div className="absolute top-0 w-1/3 h-5 lg:h-6 bg-slate-900 rounded-b-xl z-30" />
            
            {/* Viewfinder Overlay (Corner targets only) */}
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col p-6 lg:p-8">
              <div className="flex-1 relative rounded-lg border-2 border-white/10">
                {/* Corner targets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white/70 rounded-tl-sm" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white/70 rounded-tr-sm" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white/70 rounded-bl-sm" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white/70 rounded-br-sm" />
              </div>
              
              {/* Overlay UI elements */}
              <div className="absolute top-12 lg:top-14 left-0 right-0 flex justify-center">
                <span className="text-white/90 text-[10px] lg:text-xs font-semibold tracking-widest flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Camera className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> POINT AT CARD
                </span>
              </div>
              <div className="absolute bottom-10 lg:bottom-12 left-0 right-0 flex justify-center">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full border-[3px] border-white/50 bg-white/10 backdrop-blur-sm" />
              </div>
            </div>
            
            {/* Camera content: The business card being scanned */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10 overflow-hidden">
              <div className="relative w-[70%] aspect-[1.75/1]">
                <AnimatePresence>
                  {/* Physical Card Representation - shrunk width to stay within viewfinder bounds */}
                  <motion.div 
                    key={currentIndex}
                    initial={{ opacity: 1, x: "150%" }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 1, x: "-150%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-none bg-[#f8f9fa] shadow-2xl p-4 flex flex-col justify-between overflow-hidden text-left"
                  >
                    
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold tracking-tight text-slate-900 leading-tight truncate">{activeCard.name}</h3>
                        <p className="text-[9px] text-slate-500 font-medium mt-0.5 truncate">{activeCard.title}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[8px] font-extrabold uppercase tracking-widest text-primary">{activeCard.company}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-200 pt-2">
                      <div className="space-y-0.5 text-[8px] text-slate-600 font-medium">
                        <p>{activeCard.email}</p>
                        <p>{activeCard.phone}</p>
                      </div>
                      <div className="text-[8px] text-slate-400">
                        <p>{activeCard.location}</p>
                      </div>
                    </div>

                    {/* Scanning Laser Animation - Blue laser, triggers strictly via isInView */}
                    <motion.div 
                      initial={{ top: '-10%' }}
                      animate={isInView ? { top: '110%' } : { top: '-10%' }}
                      transition={{ duration: 2, ease: "linear", delay: 0.7 }}
                      className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_12px_2px_rgba(59,130,246,0.8)] z-20"
                    />
                    {/* Laser trailing glow */}
                    <motion.div 
                      initial={{ top: '-10%', height: 0 }}
                      animate={isInView ? { top: '110%', height: '40px' } : { top: '-10%', height: 0 }}
                      transition={{ duration: 2, ease: "linear", delay: 0.7 }}
                      className="absolute left-0 right-0 bg-gradient-to-t from-blue-500/30 to-transparent z-10 -translate-y-full"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Center: The Connecting Glowing Line (Structurally centered between flex items) */}
        <motion.div
          key={`connector-${currentIndex}`}
          className="hidden lg:flex w-24 shrink-0 items-center justify-center z-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, delay: 2.2 }}
        >
          <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-primary" />
          <div className="w-10 h-10 rounded-full border-2 border-primary/60 flex items-center justify-center bg-primary/20 shadow-[0_0_25px_rgba(34,211,238,0.5)] z-10 mx-[-2px] backdrop-blur-sm">
            <ArrowRight className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)]" />
          </div>
          <div className="flex-1 h-[2px] bg-gradient-to-r from-primary to-transparent" />
        </motion.div>

        {/* Right: The Extracted Digital Contact */}
        <div className="w-full max-w-[420px] shrink-0 relative flex flex-col justify-center min-h-[400px]">
          
          {/* Ambient background glow for the floating cards */}
          <div className="absolute top-0 right-10 w-72 h-72 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

          {/* Staggered Reveal Content */}
          <div key={`details-${currentIndex}`} className="space-y-4 relative z-10">
            
            {/* Field: Name & Company (Delay: 2.7s) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 2.7 }}
              className="flex items-center gap-4 p-4 lg:p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/[0.15] hover:border-white/[0.3] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_rgba(34,211,238,0.2)] group"
            >
              <div className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/50 text-white flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all duration-300">
                {activeCard.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-[17px] font-semibold text-white tracking-tight leading-tight">{activeCard.name}</p>
                <p className="text-[13px] text-slate-400 mt-1 flex items-center gap-1.5 leading-snug">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  {activeCard.title} at {activeCard.company}
                </p>
              </div>
            </motion.div>

            {/* Field: Email (Delay: 2.9s) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 2.9 }}
              className="flex items-center gap-4 p-4 lg:p-5 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-2xl border border-white/[0.1] hover:border-indigo-500/50 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_rgba(99,102,241,0.25)] group cursor-default"
            >
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500/40 to-indigo-500/10 border border-indigo-500/50 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all duration-300">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300/70 mb-0.5">Email</p>
                <p className="text-sm font-medium text-slate-200">{activeCard.email}</p>
              </div>
            </motion.div>

            {/* Field: Phone (Delay: 3.1s) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 3.1 }}
              className="flex items-center gap-4 p-4 lg:p-5 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-2xl border border-white/[0.1] hover:border-emerald-500/50 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_rgba(16,185,129,0.25)] group cursor-default"
            >
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-500/40 to-emerald-500/10 border border-emerald-500/50 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all duration-300">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/70 mb-0.5">Phone</p>
                <p className="text-sm font-medium text-slate-200">{activeCard.phone}</p>
              </div>
            </motion.div>

            {/* Field: Location (Delay: 3.3s) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 3.3 }}
              className="flex items-center gap-4 p-4 lg:p-5 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-2xl border border-white/[0.1] hover:border-amber-500/50 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_rgba(245,158,11,0.25)] group cursor-default"
            >
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-amber-500/40 to-amber-500/10 border border-amber-500/50 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all duration-300">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300/70 mb-0.5">Location</p>
                <p className="text-sm font-medium text-slate-200">{activeCard.location}</p>
              </div>
            </motion.div>

          </div>
          
          {/* Loading State Overlay (Skeleton) */}
          <motion.div
            key={`loading-${currentIndex}`}
            initial={{ opacity: 1 }}
            animate={isInView ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.4, delay: 2.6 }}
            className="absolute inset-0 z-20 pointer-events-none space-y-4 flex flex-col justify-center"
          >
            {/* Skeleton 1: Name & Company */}
            <div className="flex items-center gap-4 p-4 lg:p-5 rounded-2xl border border-white/[0.12] bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-full bg-white/[0.08] animate-pulse shrink-0" />
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-white/[0.08] rounded-md w-1/2 animate-pulse" />
                <div className="h-3 bg-white/[0.08] rounded-md w-3/4 animate-pulse" />
              </div>
            </div>
            
            {/* Skeleton 2: Email */}
            <div className="flex items-center gap-4 p-4 lg:p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="w-11 h-11 rounded-full bg-white/[0.08] animate-pulse shrink-0" />
              <div className="space-y-3 flex-1">
                <div className="h-2.5 bg-white/[0.08] rounded-md w-1/4 animate-pulse" />
                <div className="h-3.5 bg-white/[0.08] rounded-md w-2/3 animate-pulse" />
              </div>
            </div>

            {/* Skeleton 3: Phone */}
            <div className="flex items-center gap-4 p-4 lg:p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="w-11 h-11 rounded-full bg-white/[0.08] animate-pulse shrink-0" />
              <div className="space-y-3 flex-1">
                <div className="h-2.5 bg-white/[0.08] rounded-md w-1/4 animate-pulse" />
                <div className="h-3.5 bg-white/[0.08] rounded-md w-1/2 animate-pulse" />
              </div>
            </div>

            {/* Skeleton 4: Location */}
            <div className="flex items-center gap-4 p-4 lg:p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="w-11 h-11 rounded-full bg-white/[0.08] animate-pulse shrink-0" />
              <div className="space-y-3 flex-1">
                <div className="h-2.5 bg-white/[0.08] rounded-md w-1/4 animate-pulse" />
                <div className="h-3.5 bg-white/[0.08] rounded-md w-3/4 animate-pulse" />
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
