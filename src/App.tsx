import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  MapPin,
  Music,
  Heart,
  Sparkles,
  ShieldCheck,
  Mail,
  ChevronDown,
  Clock,
} from "lucide-react";
import CountdownTimer from "./components/CountdownTimer";
import AudioPlayer from "./components/AudioPlayer";
import Gallery from "./components/Gallery";
import RSVPForm from "./components/RSVPForm";
import Guestbook from "./components/Guestbook";
import GiftSection from "./components/GiftSection";
import AdminDashboard from "./components/AdminDashboard";
import LoadingScreen from "./components/LoadingScreen";
import StorySection from "./components/StorySection";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("Tamu Kehormatan");
  const [showAdmin, setShowAdmin] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Parse the dynamic guest name from URL query parameter ?to=Nama+Tamu
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get("to") || params.get("nama");
    if (toParam) {
      setGuestName(toParam);
    }
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setAudioStarted(true);
  };

  // Render standard Gregorian calendar block for Agustus 2026
  const renderAgustusCalendar = () => {
    // August 2026 begins on Saturday, August 1
    const daysOfWeek = ["S", "S", "R", "K", "J", "S", "M"]; // Sen, Sel, Rab, Kam, Jum, Sab, Min
    const daysInAugust = Array.from({ length: 31 }, (_, i) => i + 1);

    // Day 1 starts on Saturday (index 5)
    const paddingDays = Array.from({ length: 5 }, () => null);
    const calendarCells = [...paddingDays, ...daysInAugust];

    return (
      <div
        id="calendar-widget"
        className="bg-[#FAF7F1] border border-theory-clay/20 rounded-3xl p-5 shadow-sm max-w-[290px] mx-auto text-center relative overflow-hidden"
      >
        {/* Subtle background red string path decorative accent */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 pointer-events-none opacity-20">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            className="text-theory-red w-full h-full"
          >
            <path
              d="M 0,50 C 40,80 60,20 100,50 C 120,70 140,40 160,80"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <span className="font-serif text-sm font-semibold text-theory-espresso tracking-wider uppercase">
          Agustus 2026
        </span>
        <div className="grid grid-cols-7 gap-1 mt-4 text-[10px] text-theory-clay font-sans font-bold">
          {daysOfWeek.map((d, i) => (
            <span key={i} className={i === 5 ? "text-theory-red" : ""}>
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2.5 gap-x-1 mt-2.5 text-xs font-mono font-medium text-theory-espresso">
          {calendarCells.map((day, idx) => {
            if (day === null) return <span key={`pad-${idx}`}></span>;

            const isTarget = day === 1; // Highlight August 1, 2026

            return (
              <span
                key={`day-${day}`}
                className={`relative flex h-7 w-7 items-center justify-center rounded-full ${
                  isTarget
                    ? "font-bold text-theory-red"
                    : "hover:bg-theory-cream/40 transition-colors"
                }`}
              >
                {isTarget ? (
                  <span className="absolute inset-0 flex items-center justify-center">
                    {/* Beautiful Hand-Drawn Sketchy Circle Highlighter from third reference image */}
                    <svg
                      className="absolute -inset-1 h-9 w-9 pointer-events-none text-theory-red animate-pulse"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                    >
                      <path d="M50,15 C68,17 83,30 82,52 C81,72 63,85 41,81 C23,77 15,53 18,34 C21,16 46,12 68,16 C78,18 84,28 82,41" />
                    </svg>
                    <span className="relative z-10 text-theory-red scale-110 font-bold">
                      1
                    </span>
                  </span>
                ) : (
                  day
                )}
              </span>
            );
          })}
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-theory-red font-sans block mt-5 font-bold">
          Sabtu • Save our date!
        </span>
      </div>
    );
  };

  return (
    <div
      id="app-root-container"
      className="min-h-screen bg-[#FDFBF7] text-stone-700 flex justify-center items-start"
    >
      {/* Animated Loading Screen with Red String Theory Theme */}
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

      {/* Background music controller */}
      <AudioPlayer playOnStart={audioStarted} />

      {/* Main Container Wrapper - strictly locked to a beautiful clean mobile screen layout on desktop */}
      <div className="w-full max-w-md bg-[#FCFAF6] min-h-screen relative shadow-2xl border-x border-stone-200/40 overflow-hidden flex flex-col">
        {/* Toggle Admin Dashboard Button */}
        <button
          id="admin-toggle-fab"
          onClick={() => setShowAdmin(!showAdmin)}
          className="fixed bottom-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-stone-900/10 text-stone-600 shadow-md backdrop-blur-sm hover:bg-stone-900/90 hover:text-white transition-all border border-stone-300/20"
          title="Admin Dashboard"
        >
          <ShieldCheck className="h-5 w-5" />
        </button>

        {/* View Switch Router */}
        <AnimatePresence mode="wait">
          {showAdmin ? (
            <motion.div
              key="admin-dashboard-view"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="flex-1"
            >
              <div className="p-4">
                <button
                  id="admin-back-btn"
                  onClick={() => setShowAdmin(false)}
                  className="mb-4 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-stone-200/60 shadow-sm"
                >
                  ← Kembali Ke Undangan
                </button>
              </div>
              <AdminDashboard />
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Cover Welcome Slide Panel (Halaman Pertama) */}
              <AnimatePresence>
                {!isOpen && (
                  <motion.div
                    key="welcome-cover"
                    id="welcome-overlay"
                    initial={{ opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{
                      duration: 0.95,
                      ease: [0.43, 0.13, 0.23, 0.96],
                    }}
                    className="absolute inset-0 z-40 flex flex-col items-center justify-between p-8 text-center overflow-hidden"
                    style={{
                      backgroundImage: "url('/images/depan.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Dark premium overlay for readability & elegant contrast */}
                    <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-[0.5px] pointer-events-none z-0" />

                    {/* Winding Red String of Fate SVG Background overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                      <svg
                        viewBox="0 0 400 800"
                        className="w-full h-full text-theory-red"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M 200, 0 C 100, 150, 300, 300, 100, 450 C -50, 580, 250, 680, 200, 800"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeDasharray="4 4"
                        />
                        <path
                          d="M 200, 0 C 100, 150, 300, 300, 100, 450 C -50, 580, 250, 680, 200, 800"
                          strokeWidth="0.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* Decorative Top Details - Lowered slightly */}
                    <div className="space-y-1 mt-50 relative z-10">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-stone-200 font-sans font-bold block">
                        The Wedding Invitation of
                      </span>
                      <h2 className="font-serif text-5xl mt-4 font-bold text-white tracking-wide drop-shadow-sm">
                        Zakia & Wildan
                      </h2>
                    </div>

                    {/* Guest Greeting Block */}
                    <div className="space-y-4 w-full px-4 mb-4 relative z-10">
                      <span className="text-[10px] text-stone-200 font-sans uppercase tracking-[0.18em] font-semibold block">
                        TERUNTUK
                      </span>

                      <div className="bg-white/90 border border-white/20 px-6 py-3.5 rounded-2xl backdrop-blur-md shadow-lg max-w-xs mx-auto">
                        <span
                          id="guest-name-display"
                          className="font-serif text-base font-semibold text-stone-900 block tracking-wide"
                        >
                          {guestName}
                        </span>
                      </div>

                      <p className="text-[9px] text-stone-300/90 italic font-sans max-w-xs mx-auto leading-relaxed">
                        *Mohon maaf apabila ada kesalahan pada penulisan nama
                        atau gelar.
                      </p>

                      <motion.button
                        id="open-invitation-btn"
                        onClick={handleOpenInvitation}
                        className="inline-flex items-center gap-2.5 bg-theory-red text-white hover:bg-theory-maroon py-3.5 px-8 rounded-full text-xs font-semibold uppercase tracking-widest shadow-xl transition-all mt-4"
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <Mail className="h-4 w-4 text-white animate-bounce" />
                        Buka Undangan
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Elegant Invitation Content (Exposed after clicking Open) */}
              {isOpen && (
                <motion.div
                  key="main-invitation-scroller"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex-1 flex flex-col"
                >
                  {/* Hero / Header Section */}
                  <div className="relative text-center py-16 px-6 bg-theory-cream flex flex-col items-center overflow-hidden">
                    {/* Winding Red Thread SVG behind Hero */}
                    <div className="absolute inset-x-0 top-12 h-20 pointer-events-none opacity-40">
                      <svg
                        viewBox="0 0 400 100"
                        className="w-full h-full text-theory-red"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M 0,50 C 100,20 150,80 200,50 C 250,20 300,80 400,50"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 0,50 C 100,20 150,80 200,50 C 250,20 300,80 400,50"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeDasharray="3 3"
                        />
                      </svg>
                    </div>

                    <span className="text-[10px] uppercase tracking-[0.25em] text-theory-red font-sans font-extrabold relative z-10">
                      The Wedding of
                    </span>

                    <h1 className="font-serif text-4xl font-extrabold text-theory-espresso tracking-wide mt-4 relative z-10">
                      Zakia & Wildan
                    </h1>

                    <p className="text-xs text-theory-clay font-medium mt-6 max-w-xs leading-relaxed italic font-serif relative z-10">
                      وَمِنْ كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ لَعَلَّكُمْ
                      تَذَكَّرُوْنَ ۝٤٩
                    </p>

                    <p className="text-xs text-theory-clay font-medium max-w-xs leading-relaxed italic font-serif relative z-10">
                      Segala sesuatu Kami ciptakan berpasang-pasangan agar kamu
                      mengingat (kebesaran Allah).
                    </p>

                    <ChevronDown className="h-5 w-5 text-theory-clay mt-8 animate-bounce relative z-10" />
                  </div>

                  {/* Groom & Bride Profiles Section */}
                  <div className="py-16 px-6 space-y-12 bg-[#FCFAF6] text-center relative overflow-hidden">
                    {/* Continuous Red Thread SVG running down the side */}
                    <div className="absolute top-0 bottom-0 left-8 w-4 pointer-events-none opacity-20">
                      <svg
                        viewBox="0 0 100 1000"
                        preserveAspectRatio="none"
                        className="w-full h-full text-theory-red"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M 50,0 C 20,200 80,400 30,600 C 80,800 20,900 50,1000"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="space-y-4 max-w-xs mx-auto relative z-10">
                      <p className="text-xs text-theory-espresso/80 leading-relaxed font-sans font-medium">
                        Berawal dari perjumpaan sederhana yang perlahan bertaut
                        menjadi karsa yang sama, kami sepakat untuk melangkah
                        pada satu alur cerita. Dengan hati yang lapang dan rasa
                        syukur, kami bermaksud merayakan awal perjalanan kami
                        sebagai keluarga.
                      </p>
                    </div>

                    {/* Mempelai Profiles Grid */}
                    <div className="space-y-12 relative z-10">
                      {/* Groom */}
                      <motion.div
                        id="groom-profile-block"
                        className="flex flex-col items-center space-y-4"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        {/* Polaroid card framing for Groom profile */}
                        <motion.div
                          className="bg-white p-3 pb-6 shadow-lg border border-stone-100 rounded-xl cursor-pointer"
                          initial={{ rotate: -1.5, scale: 0.95 }}
                          whileHover={{ scale: 1.03, rotate: 0, y: -5 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <div className="h-56 w-44 overflow-hidden rounded-md bg-stone-50 relative">
                            <img
                              src="/images/groom.jpg"
                              alt="Wildan Mulkan Hakim"
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover scale-102"
                            />
                          </div>
                          <span className="font-script text-lg text-theory-clay block mt-3">
                            The Groom
                          </span>
                        </motion.div>

                        <div className="space-y-1 max-w-xs">
                          <h4 className="font-serif text-3xl font-bold text-theory-espresso">
                            Wildan Mulkan Hakim
                          </h4>
                          <p className="text-xs text-theory-clay font-sans font-semibold">
                            Putra dari Bpk. Ujang Sutisna & Ibu Teti Sugiarti
                          </p>
                        </div>
                      </motion.div>

                      {/* Accent Ampersand tied with a red heart string loop */}
                      <div className="flex justify-center items-center relative py-2">
                        <span className="font-script text-5xl text-theory-clay/40 relative z-10">
                          &
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          {/* Cute red string infinity symbol */}
                          <svg
                            className="w-16 h-8 text-theory-red opacity-60"
                            viewBox="0 0 100 50"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M 10,25 C 10,10 40,10 50,25 C 60,40 90,40 90,25 C 90,10 60,10 50,25 C 40,40 10,40 10,25" />
                          </svg>
                        </div>
                      </div>

                      {/* Bride */}
                      <motion.div
                        id="bride-profile-block"
                        className="flex flex-col items-center space-y-4"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        {/* Polaroid card framing for Bride profile */}
                        <motion.div
                          className="bg-white p-3 pb-6 shadow-lg border border-stone-100 rounded-xl cursor-pointer"
                          initial={{ rotate: 1.5, scale: 0.95 }}
                          whileHover={{ scale: 1.03, rotate: 0, y: -5 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <div className="h-56 w-44 overflow-hidden rounded-md bg-stone-50 relative">
                            <img
                              src="/images/bride.jpg"
                              alt="Zakia Maulia Syaima"
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover scale-102"
                            />
                          </div>
                          <span className="font-script text-lg text-theory-clay block mt-3">
                            The Bride
                          </span>
                        </motion.div>

                        <div className="space-y-1 max-w-xs">
                          <h4 className="font-serif text-3xl font-bold text-theory-espresso">
                            Zakia Maulia Syaima
                          </h4>
                          <p className="text-xs text-theory-clay font-sans font-semibold">
                            Putri dari Bpk. Budi Hadi (Alm) & Ibu Sri Kadarwati
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Love Story Section */}
                  <StorySection />

                  {/* Countdown Timer Block */}
                  <div className="py-12 bg-theory-cream border-y border-theory-clay/25 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none opacity-20">
                      <svg
                        viewBox="0 0 100 100"
                        fill="none"
                        className="text-theory-red"
                      >
                        <circle
                          cx="20"
                          cy="20"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                      </svg>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-theory-clay font-extrabold font-sans">
                      Waktu Menuju Hari Bahagia
                    </span>
                    <CountdownTimer />
                  </div>

                  {/* Schedule Details with Calendar Circle Reference */}
                  <div className="py-16 px-6 space-y-8 bg-white text-center relative">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-theory-clay font-bold font-sans block">
                        Jadwal Acara
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-theory-espresso">
                        Waktu & Lokasi
                      </h3>
                      <span className="font-script text-4xl text-theory-red block">
                        Save our date!
                      </span>
                    </div>

                    {renderAgustusCalendar()}

                    {/* Schedule Cards */}
                    <div className="space-y-4 max-w-sm mx-auto">
                      {/* Akad Card */}
                      <motion.div
                        id="akad-schedule-card"
                        className="bg-theory-cream border border-theory-clay/20 p-5 rounded-3xl text-center space-y-2.5 shadow-sm relative overflow-hidden"
                        whileHover={{ y: -2 }}
                      >
                        <div className="absolute top-0 left-0 w-2 h-full bg-theory-red opacity-80" />
                        <span className="text-lg uppercase font-extrabold text-theory-red tracking-[0.15em] block">
                          Akad Nikah
                        </span>
                        <h4 className="font-serif text-base text-theory-espresso font-bold">
                          Sabtu, 1 Agustus 2026
                        </h4>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-theory-clay font-sans font-medium">
                          <Clock className="h-4 w-4 text-theory-red" />
                          <span>Pukul 08.00 - Selesai</span>
                        </div>
                      </motion.div>

                      {/* Resepsi Card */}
                      <motion.div
                        id="resepsi-schedule-card"
                        className="bg-theory-cream border border-theory-clay/20 p-5 rounded-3xl text-center space-y-2.5 shadow-sm relative overflow-hidden"
                        whileHover={{ y: -2 }}
                      >
                        <div className="absolute top-0 left-0 w-2 h-full bg-theory-clay opacity-80" />
                        <span className="text-lg uppercase font-extrabold text-theory-clay tracking-[0.15em] block">
                          Resepsi Pernikahan
                        </span>
                        <h4 className="font-serif text-base text-theory-espresso font-bold">
                          Sabtu, 1 Agustus 2026
                        </h4>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-theory-clay font-sans font-medium">
                          <Clock className="h-4 w-4 text-theory-red" />
                          <span>Pukul 11.00 - 14.00</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Location Info */}
                    <div className="space-y-4 max-w-sm mx-auto pt-4">
                      <div className="flex justify-center">
                        <div className="bg-theory-cream p-3 rounded-full text-theory-red border border-theory-clay/20 shadow-sm">
                          <MapPin className="h-6 w-6 text-theory-red animate-bounce" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="font-serif text-2xl font-bold text-theory-espresso">
                          Kampung Bareto
                        </h4>
                        <p className="text-xs text-theory-clay leading-relaxed font-sans font-medium px-4">
                          Jl. Padasuka Atas No.21, Cimenyan, Kec. Cimenyan,
                          Kabupaten Bandung, Jawa Barat 40197
                        </p>
                      </div>

                      {/* Google Maps Iframe */}
                      <div
                        id="gmaps-box"
                        className="overflow-hidden rounded-2xl border border-theory-clay/20 shadow-sm aspect-[16/9]"
                      >
                        <iframe
                          title="Kampung Bareto Location Map"
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.025732104381!2d107.65345717441584!3d-6.887532393111458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e7b993358369%3A0xc3c5b525db86903e!2sKampung%20Bareto!5e0!3m2!1sid!2sid!4v1720050000000!5m2!1sid!2sid"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        ></iframe>
                      </div>

                      <a
                        id="gmaps-nav-link"
                        href="https://maps.app.goo.gl/YfS9W28jZ35K4hV7A"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-theory-red hover:bg-theory-maroon text-white text-xs font-semibold uppercase tracking-wider py-3 px-6 rounded-xl shadow-md transition-all"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        Buka Google Maps
                      </a>
                    </div>
                  </div>

                  {/* Photo Gallery Section */}
                  <div className="bg-[#FAF7F1] border-y border-stone-200/30">
                    <Gallery />
                  </div>

                  {/* Real-time RSVP Section */}
                  <div className="py-16 bg-white">
                    <RSVPForm guestNameFromUrl={guestName} />
                  </div>

                  {/* Real-time Guestbook Ucapan Doa */}
                  <div className="bg-[#FAF7F1] py-16 border-y border-stone-200/30">
                    <Guestbook />
                  </div>

                  {/* Gift Section */}
                  <div className="py-16 bg-white">
                    <GiftSection />
                  </div>

                  {/* Closing Words */}
                  <div className="py-20 px-8 bg-[#FAF7F1] text-center space-y-6">
                    <div className="flex justify-center">
                      <Sparkles className="h-7 w-7 text-amber-800" />
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed font-sans max-w-xs mx-auto">
                      "Mengiringi langkah pertama kami dengan restu Anda adalah
                      sebuah kehormatan yang tak terhingga nilainya bagi kami."
                    </p>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-sans">
                        Kami Yang Berbahagia,
                      </p>
                      <h4 className="font-serif text-xl text-stone-800 font-bold">
                        Wildan & Zakia
                      </h4>
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-sans">
                        Beserta Keluarga
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-stone-900 text-stone-400 py-6 text-center text-[10px] font-sans border-t border-stone-800">
                    <p>© 2026 Wildan & Zakia. All Rights Reserved.</p>
                    <p className="text-stone-600 mt-1">
                      Made with elegance and real-time support
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
