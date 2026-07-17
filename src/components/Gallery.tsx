import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ZoomIn } from "lucide-react";

export default function Gallery() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const images = [
    {
      src: "/moment/moment-1.jpg",
      title: "Menyambut Hari Bahagia",
      desc: "Langkah mantap menuju masa depan cerah bersama.",
      rotate: "rotate-[-2deg]",
      caption: "Menatap Pada Satu Arah yang Sama",
    },
    {
      src: "/moment/moment-2.jpg",
      title: "Di Arena Kehidupan",
      desc: "Walau terkadang ada perbedaan, kita bisa melewatinya.",
      rotate: "rotate-[1.5deg]",
      caption: "Kita Adalah Pemenang",
    },
    {
      src: "/moment/moment-3.jpg",
      title: "Cerita yang Jauh Lebih Panjang Baru Saja Dimulai",
      desc: "Dua hati yang berjanji untuk saling menjaga selamanya.",
      rotate: "rotate-[-1.5deg]",
      caption: "Satu Babak Telah Usai",
    },
    {
      src: "/moment/moment-4.jpg",
      title: "Dan Cerita Kecil Setiap Harinya",
      desc: "Romansa tidak melulu tentang kejutan mewah.",
      rotate: "rotate-[1.5deg]",
      caption: "Cinta Hidup dalam Tawa Sederhana",
    },
  ];

  return (
    <div
      id="gallery-root-container"
      className="px-6 py-12 relative overflow-hidden"
    >
      {/* Decorative Red String Path behind Polaroid photos */}
      <div className="absolute inset-x-0 top-1/3 h-24 pointer-events-none opacity-35 z-0">
        <svg
          viewBox="0 0 400 100"
          className="w-full h-full text-theory-red"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M -20,20 C 100,80 200,10 420,70"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M -20,20 C 100,80 200,10 420,70"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeDasharray="3 3"
          />
        </svg>
      </div>

      <div className="text-center space-y-1 relative z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-theory-clay font-bold font-sans block">
          Galeri Kebahagiaan
        </span>
        <h3 className="font-serif text-2xl font-bold text-theory-espresso">
          Momen Indah Kami
        </h3>
        <p className="text-theory-clay font-sans text-xs max-w-xs mx-auto tracking-wide leading-relaxed">
          Sekilas momen indah yang mengiringi langkah perjalanan cinta kami.
        </p>
      </div>

      {/* Polaroid Grid Layout matching reference image style */}
      <div className="grid grid-cols-1 gap-10 mt-10 relative z-10 max-w-xs mx-auto">
        {images.map((img, index) => (
          <motion.div
            key={index}
            id={`gallery-card-${index}`}
            className="bg-white p-4 pb-8 shadow-xl border border-stone-100 rounded-xl cursor-pointer"
            initial={{
              opacity: 0,
              y: 20,
              rotate:
                img.rotate === "rotate-[-2deg]"
                  ? -2
                  : img.rotate === "rotate-[1.5deg]"
                    ? 1.5
                    : -1.5,
            }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, rotate: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            viewport={{ once: true }}
            onClick={() => setSelectedImg(img.src)}
          >
            {/* The Photo slot */}
            <div className="relative overflow-hidden bg-stone-50 aspect-[4/3] rounded-sm border border-stone-100">
              <img
                src={img.src}
                alt={img.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-theory-red/5 mix-blend-multiply" />
            </div>

            {/* Custom Polaroid Handwritten Overlay/Label */}
            <div className="mt-4 text-center space-y-1">
              <span className="font-script text-2xl text-theory-red block leading-none">
                {img.caption}
              </span>
              <span className="font-serif text-xs font-semibold text-theory-espresso tracking-wider block mt-1">
                {img.title}
              </span>
              <span className="text-[10px] text-theory-clay font-sans leading-tight block">
                {img.desc}
              </span>
            </div>

            <div className="absolute top-6 right-6 bg-theory-red/10 p-2 rounded-full backdrop-blur-sm opacity-60">
              <ZoomIn className="h-4 w-4 text-theory-red" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox / Fullscreen Overlay */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            id="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-theory-espresso/95 p-4 backdrop-blur-md"
            onClick={() => setSelectedImg(null)}
          >
            <button
              id="lightbox-close-btn"
              className="absolute top-6 right-6 text-stone-400 hover:text-white transition-colors bg-white/10 p-2 rounded-full"
              onClick={() => setSelectedImg(null)}
            >
              <X className="h-6 w-6" />
            </button>

            <motion.div
              id="lightbox-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-h-[85vh] max-w-full overflow-hidden rounded-2xl shadow-2xl border border-stone-800"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImg}
                alt="Enlarged"
                referrerPolicy="no-referrer"
                className="max-h-[80vh] w-auto max-w-full object-contain mx-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
