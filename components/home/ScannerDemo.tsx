'use client';

import { useRef } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles,
  Camera,
  ArrowRight
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const activeCard = {
  name: 'Elena Rostova',
  title: 'Managing Partner',
  company: 'Apex Horizon',
  email: 'elena@apexhorizon.vc',
  phone: '(415) 890-3421',
  location: 'San Francisco, CA',
};

export function ScannerDemo() {
  const containerRef = useRef(null);
  // trigger animation only when at least 50% of the section is visible
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-6xl mx-auto rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 px-4 sm:px-6 lg:px-8 py-4 lg:py-6 shadow-2xl relative overflow-hidden"
    >
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Extracted instantly</span>
        </div>
      </div>

      {/* Main interactive flex layout (Centering everything perfectly) */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-8 relative z-10 w-full">
        
        {/* Left: The Phone Scanner */}
        <div className="relative w-full max-w-[280px] lg:max-w-[310px] shrink-0">
          {/* Phone Frame Mockup */}
          <div className="relative aspect-[9/16] rounded-[2.5rem] lg:rounded-[3rem] border-[6px] lg:border-[8px] border-slate-900 bg-black shadow-2xl overflow-hidden flex flex-col justify-center items-center">
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
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
              {/* Physical Card Representation - shrunk width to stay within viewfinder bounds */}
              <div className="w-[70%] aspect-[1.75/1] rounded-none bg-[#f8f9fa] shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden text-left">
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">{activeCard.name}</h3>
                    <p className="text-[9px] text-slate-500 font-medium mt-0.5">{activeCard.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-primary">{activeCard.company}</p>
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
                  transition={{ duration: 2, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_12px_2px_rgba(59,130,246,0.8)] z-20"
                />
                {/* Laser trailing glow */}
                <motion.div 
                  initial={{ top: '-10%', height: 0 }}
                  animate={isInView ? { top: '110%', height: '40px' } : { top: '-10%', height: 0 }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="absolute left-0 right-0 bg-gradient-to-t from-blue-500/30 to-transparent z-10 -translate-y-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: The Connecting Glowing Line (Structurally centered between flex items) */}
        <motion.div
          className="hidden lg:flex w-24 shrink-0 items-center justify-center z-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, delay: 2.0 }}
        >
          <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent to-primary/50" />
          <div className="w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center bg-background shadow-[0_0_15px_rgba(34,211,238,0.3)] z-10 mx-[-1px]">
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
        </motion.div>

        {/* Right: The Extracted Digital Contact */}
        <div className="w-full max-w-[420px] shrink-0 bg-background/80 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-xl border border-white/5 relative">
          
          {/* Staggered Reveal Content */}
          <div className="space-y-5 relative z-10">
            
            {/* Field: Name & Company (Delay: 2.5s) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 2.5 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-white/5"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                {activeCard.name.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{activeCard.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {activeCard.title} at {activeCard.company}
                </p>
              </div>
            </motion.div>

            {/* Field: Email (Delay: 2.7s) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 2.7 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-white/5 group hover:border-primary/30 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Email</p>
                <p className="text-sm font-medium text-foreground">{activeCard.email}</p>
              </div>
            </motion.div>

            {/* Field: Phone (Delay: 2.9s) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 2.9 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-white/5 group hover:border-primary/30 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Phone</p>
                <p className="text-sm font-medium text-foreground">{activeCard.phone}</p>
              </div>
            </motion.div>

            {/* Field: Location (Delay: 3.1s) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 3.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-white/5 group hover:border-primary/30 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Location</p>
                <p className="text-sm font-medium text-foreground">{activeCard.location}</p>
              </div>
            </motion.div>

          </div>
          
          {/* Loading State Overlay (while scanning) */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={isInView ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.4, delay: 2.4 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center z-20 pointer-events-none"
          >
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
            <p className="text-sm font-medium text-primary animate-pulse">Scanning business card...</p>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
