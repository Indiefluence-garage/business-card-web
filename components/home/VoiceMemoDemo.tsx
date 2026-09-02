'use client';

import { useState, useEffect } from 'react';
import { 
  Mic, 
  Calendar, 
  CheckCircle2, 
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export function VoiceMemoDemo() {
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Speak your mind. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">
            Let the app do the typing.
          </span>
        </h2>
        <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
          Record a quick voice note after meeting someone. The system automatically creates a to-do list and schedules follow-ups in your calendar.
        </p>
      </div>

      {/* Interactive Visual Showcase - Premium Glassmorphic Container */}
      <div className="relative p-6 sm:p-10 lg:p-12 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Decorative Background Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center relative z-10">
          
          {/* Step 1: The Voice Note (Left Side) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center relative">
                {isPlaying && (
                  <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping opacity-75" />
                )}
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/40 z-10">
                  <Mic className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Voice Note</h3>
                <p className="text-xs text-muted-foreground font-mono">00:07 Recording...</p>
              </div>
            </div>
            
            <div className="bg-background/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl w-full max-w-sm relative overflow-hidden">
              {/* Animated Audio Waveform */}
              <div className="flex items-center h-10 gap-1.5 mb-5 opacity-80">
                {[1, 3, 2, 5, 4, 2, 6, 3, 1, 4, 2, 5, 3].map((bar, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: isPlaying ? bar * 6 + 10 : 10 }}
                    transition={{ duration: 0.2, repeat: isPlaying ? Infinity : 0, repeatType: "reverse", delay: i * 0.05 }}
                    className="w-1.5 bg-primary rounded-full"
                  />
                ))}
              </div>
              <p className="text-sm font-medium leading-relaxed text-foreground/90">
                "Met Marcus at the tech summit. Send him the whitepaper before our demo next Tuesday at 3 PM."
              </p>
            </div>
          </div>

          {/* Connection Animation (Middle) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0 relative h-full">
            {/* Horizontal Line for Desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 -translate-y-1/2">
              <motion.div 
                className="w-1/3 h-full bg-primary blur-[2px]"
                animate={{ x: ['-100%', '300%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            {/* Vertical Line for Mobile */}
            <div className="block lg:hidden w-[2px] h-16 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0">
              <motion.div 
                className="w-full h-1/3 bg-primary blur-[2px]"
                animate={{ y: ['-100%', '300%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="hidden lg:flex w-10 h-10 rounded-full bg-card border border-white/10 items-center justify-center z-10 shadow-lg text-primary">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Step 3: The Result (Right Side) */}
          <div className="lg:col-span-5 flex flex-col gap-5 items-center lg:items-end">
            
            {/* Task Card */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-background/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-xl w-full max-w-sm hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Send Whitepaper</h4>
                    <p className="text-xs text-muted-foreground">To: <span className="font-medium text-foreground">Marcus Vance</span></p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs bg-card rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Task Created
                </div>
                <span className="text-muted-foreground font-mono">High Priority</span>
              </div>
            </motion.div>

            {/* Calendar Event Card */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-background/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-xl w-full max-w-sm hover:border-indigo-500/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Product Demo</h4>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Next Tue · 3:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs bg-card rounded-lg p-2.5 border border-white/5">
                <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Calendar Synced
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
