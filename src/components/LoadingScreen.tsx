import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";

export default function LoadingScreen() {
  const [displayText, setDisplayText] = useState(
    "Mengikat benang merah takdir...",
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayText("Menyatukan dua belahan jiwa...");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      id="red-string-loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#FCFAF6] flex flex-col items-center justify-center p-6 text-center overflow-hidden"
    >
      {/* Decorative Traditional Asian Border Accents */}
      <div className="absolute top-8 left-8 right-8 bottom-8 border border-stone-200/50 rounded-3xl pointer-events-none flex items-center justify-center">
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-red-300"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-red-300"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-red-300"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-red-300"></div>
      </div>

      <div className="relative max-w-xs flex flex-col items-center space-y-8">
        {/* Animated Red Thread of Fate SVG */}
        <div className="relative w-48 h-24 flex items-center justify-center">
          <svg
            viewBox="0 0 200 100"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background faint guideline */}
            <path
              d="M 10 50 C 40 20, 60 80, 100 50 C 140 20, 160 80, 190 50"
              stroke="#fee2e2"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* The animated Red String of Fate */}
            <motion.path
              d="M 10 50 C 40 20, 60 80, 100 50 C 140 20, 160 80, 190 50"
              stroke="#dc2626"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
            />

            {/* Glowing end particles representing the two destined souls */}
            <motion.circle
              cx="10"
              cy="50"
              r="4"
              fill="#991b1b"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />

            <motion.circle
              cx="190"
              cy="50"
              r="4"
              fill="#991b1b"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            />
          </svg>

          {/* Absolute Center Heart Pulse Icon */}
          <motion.div
            className="absolute flex items-center justify-center bg-[#FCFAF6] p-1.5 rounded-full border border-red-100 shadow-sm"
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{
              scale: { type: "spring", stiffness: 200, delay: 0.8 },
              rotate: { ease: "easeInOut", duration: 2, delay: 0.8 },
            }}
          >
            <Heart className="h-5 w-5 text-red-600 fill-red-600 animate-pulse" />
          </motion.div>
        </div>

        {/* Dynamic & poetic Text display */}
        <div className="space-y-3">
          <motion.span
            className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 font-sans font-bold block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            The Red String of Fate
          </motion.span>

          <motion.h3
            key={displayText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="font-serif text-base font-medium text-stone-800 tracking-wide"
          >
            {displayText}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[11px] text-stone-400 italic font-sans max-w-[220px] mx-auto leading-relaxed"
          >
            "Utas merah yang tak terlihat menghubungkan mereka yang ditakdirkan
            bertemu, tak peduli waktu, tempat, ataupun keadaan."
          </motion.p>
        </div>

        {/* Loading Bar progress */}
        <div className="w-32 h-[3px] bg-red-100 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-red-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
