import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function CountdownTimer() {
  // Target date: August 1, 2026 at 08:00:00 AM (WIB / GMT+7)
  const targetDate = new Date("2026-08-01T08:00:00+07:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isOver: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div
      id="countdown-container"
      className="flex flex-col items-center justify-center my-6"
    >
      {timeLeft.isOver ? (
        <motion.div
          id="countdown-over-msg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-theory-espresso font-serif text-lg tracking-wider italic text-center"
        >
          Hari Bahagia Telah Tiba ✨
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
          className="relative w-full max-w-[320px] h-[90px] flex items-center justify-center px-4"
        >
          {/* Hand-drawn double-bordered capsule background SVG */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <svg
              viewBox="0 0 320 90"
              fill="none"
              className="w-full h-full text-theory-red opacity-90"
              preserveAspectRatio="none"
            >
              {/* Primary sketchy outline */}
              <path
                d="M 28,12 C 100,6 220,7 292,12 C 308,13 313,20 311,35 C 309,50 311,66 292,74 C 220,80 100,79 28,74 C 9,70 7,53 9,35 C 11,17 15,13 28,12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Bottom shadow line creating depth like the doodle */}
              <path
                d="M 12,60 C 50,74 120,78 180,77 C 240,76 285,71 306,58"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Core Content Layer */}
          <div className="relative z-10 w-full flex items-center justify-between px-3 text-theory-espresso">
            {/* Days Block */}
            <div className="flex flex-col items-center flex-1 justify-center">
              <span className="font-serif text-2xl font-bold text-theory-espresso leading-none tracking-tight">
                {timeLeft.days}
              </span>
              <span className="font-script text-base text-theory-clay leading-none mt-1 select-none">
                hari
              </span>
            </div>

            {/* Doodle Colon divider */}
            <div className="flex flex-col justify-center items-center h-8 w-4 select-none opacity-80 shrink-0 mb-1 pb-2">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-theory-red mb-1.5" />
              <div className="w-2.5 h-2.5 rounded-full border-2 border-theory-red" />
            </div>

            {/* Hours Block */}
            <div className="flex flex-col items-center flex-1 justify-center">
              <span className="font-serif text-2xl font-bold text-theory-espresso leading-none tracking-tight">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="font-script text-base text-theory-clay leading-none mt-1 select-none">
                jam
              </span>
            </div>

            {/* Doodle Colon divider */}
            <div className="flex flex-col justify-center items-center h-8 w-4 select-none opacity-80 shrink-0 pb-2">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-theory-red mb-1.5" />
              <div className="w-2.5 h-2.5 rounded-full border-2 border-theory-red" />
            </div>

            {/* Minutes Block */}
            <div className="flex flex-col items-center flex-1 justify-center">
              <span className="font-serif text-2xl font-bold text-theory-espresso leading-none tracking-tight">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="font-script text-base text-theory-clay leading-none mt-1 select-none">
                menit
              </span>
            </div>

            {/* Doodle Colon divider */}
            <div className="flex flex-col justify-center items-center h-8 w-4 select-none opacity-80 shrink-0 pb-2">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-theory-red mb-1.5" />
              <div className="w-2.5 h-2.5 rounded-full border-2 border-theory-red" />
            </div>

            {/* Seconds Block */}
            <div className="flex flex-col items-center flex-1 justify-center">
              <span className="font-serif text-2xl font-bold text-theory-espresso leading-none tracking-tight">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="font-script text-base text-theory-clay leading-none mt-1 select-none">
                detik
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
