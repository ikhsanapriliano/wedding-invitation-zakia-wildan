import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion } from "motion/react";

interface AudioPlayerProps {
  playOnStart: boolean;
}

export default function AudioPlayer({ playOnStart }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Soft piano background track for an elegant wedding feel
  const audioUrl = "/music/worth-it.mp3";

  useEffect(() => {
    // Lazy initialize audio
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = false;
      audioRef.current.volume = 0.2; // Soft volume
    }

    if (playOnStart) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) =>
          console.log("Audio autoplay waiting for user interaction:", err),
        );
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [playOnStart]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Error playing audio:", err));
    }
  };

  return (
    <div id="audio-player-container" className="fixed bottom-6 right-6 z-50">
      <motion.button
        id="audio-toggle-btn"
        onClick={togglePlay}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-900/95 text-stone-100 shadow-xl backdrop-blur-sm hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
        whileTap={{ scale: 0.9 }}
        animate={isPlaying ? { rotate: 360 } : {}}
        transition={
          isPlaying
            ? { repeat: Infinity, duration: 12, ease: "linear" }
            : { duration: 0.2 }
        }
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            <Volume2 className="h-5 w-5 text-amber-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>
        ) : (
          <VolumeX className="h-5 w-5 text-stone-400" />
        )}
      </motion.button>
    </div>
  );
}
