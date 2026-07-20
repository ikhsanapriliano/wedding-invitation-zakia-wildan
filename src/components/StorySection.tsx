'use client';

import React from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";

interface Milestone {
  date: string;
  title: string;
  desc: string;
  image: string;
  rotate: string;
}

export default function StorySection() {
  const milestones: Milestone[] = [
    {
      date: "Mei 2024",
      title: "First Meet",
      desc: "Pertemuan pertama yang tak pernah direncanakan. Di bawah hangatnya mentari bulan Mei, sepasang mata saling bertemu dan memulai obrolan ringan yang perlahan berubah menjadi ketertarikan yang mendalam.",
      image: "/images/meet.jpg",
      rotate: "rotate-[-2deg]",
    },
    {
      date: "Februari 2026",
      title: "Engaged",
      desc: "Setelah melewati sekian banyak musim dan saling meyakinkan satu sama lain, kami memutuskan untuk membawa hubungan ini ke jenjang yang lebih serius. Sebuah janji suci diikat dengan cincin di jari manis, disaksikan oleh keluarga tercinta.",
      image: "/images/enggaged.png",
      rotate: "rotate-[2deg]",
    },
    {
      date: "Agustus 2026",
      title: "New Chapter Of Us",
      desc: "Kini, benang merah takdir telah menautkan langkah kami sepenuhnya. Kami memulai lembaran baru sebagai suami istri, siap mengarungi samudera kehidupan bersama-sama, saling melengkapi dan menyayangi selamanya.",
      image: "/images/married.jpg",
      rotate: "rotate-[-1.5deg]",
    },
  ];

  return (
    <div
      id="love-story-section"
      className="py-16 px-6 bg-[#FCFAF6] relative overflow-hidden"
    >
      {/* Red Thread running through the timeline */}
      <div className="absolute top-36 bottom-20 left-1/2 -translate-x-1/2 w-[2px] pointer-events-none z-0">
        <svg
          viewBox="0 0 10 1000"
          preserveAspectRatio="none"
          className="w-full h-full text-theory-red opacity-55"
        >
          <line
            x1="5"
            y1="0"
            x2="5"
            y2="1000"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      <div className="text-center space-y-1 relative z-10 mb-12">
        <h3 className="font-serif text-4xl font-bold text-theory-espresso">
          Story Line
        </h3>
        <div className="flex justify-center mt-2">
          <Heart className="h-4 w-4 text-theory-red fill-theory-red animate-pulse" />
        </div>
      </div>

      <div className="space-y-16 relative z-10">
        {milestones.map((milestone, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={idx}
              className="flex flex-col items-center text-center space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2, delay: 0.1 }}
            >
              {/* Date Badge over the line */}
              <div className="bg-theory-red text-white text-[10px] font-mono font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md z-10">
                {milestone.date}
              </div>

              {/* Title */}
              <h4 className="font-serif text-lg font-bold text-theory-espresso leading-none mt-1">
                {milestone.title}
              </h4>

              {/* Polaroid Photo Framing */}
              <motion.div
                className="bg-white p-3 pb-6 shadow-xl border border-stone-200/40 rounded-xl max-w-[240px] cursor-pointer"
                initial={{
                  rotate:
                    milestone.rotate === "rotate-[-2deg]"
                      ? -2
                      : milestone.rotate === "rotate-[2deg]"
                        ? 2
                        : -1.5,
                  scale: 0.96,
                }}
                whileHover={{ scale: 1.05, rotate: 0, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="h-52 w-44 overflow-hidden rounded-md bg-stone-50 border border-stone-100 relative">
                  <img
                    src={milestone.image}
                    alt={milestone.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-theory-red/5 mix-blend-multiply pointer-events-none" />
                </div>
                <span className="font-script text-base text-theory-red block mt-3">
                  {milestone.date}
                </span>
              </motion.div>

              {/* Description */}
              <p className="text-xs text-theory-clay font-medium leading-relaxed max-w-xs px-4">
                {milestone.desc}
              </p>

              {/* Thread knot indicator on the timeline if not the last item */}
              {idx < milestones.length - 1 && (
                <div className="w-3 h-3 rounded-full bg-theory-red border-2 border-white shadow-sm mt-4 z-10" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
