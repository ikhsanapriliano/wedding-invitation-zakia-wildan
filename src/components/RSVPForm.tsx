import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import {
  CheckCircle,
  Calendar,
  MessageSquare,
  ArrowRight,
  Share2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface RSVPFormProps {
  guestNameFromUrl: string;
}

export default function RSVPForm({ guestNameFromUrl }: RSVPFormProps) {
  const [name, setName] = useState(guestNameFromUrl || "");
  const [attendance, setAttendance] = useState<"hadir" | "tidak_hadir">(
    "hadir",
  );
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRsvp, setSubmittedRsvp] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Mohon masukkan nama Anda.");
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg("Mohon masukkan nomor WhatsApp Anda.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Generate a secure, beautiful custom RSVP ID
    const customId =
      "rsvp-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const pathForWrite = `rsvps`;

    const rsvpData = {
      name: name.trim(),
      attendance,
      guestsCount: attendance === "hadir" ? Number(guestsCount) : 0,
      phoneNumber: phoneNumber.trim(),
      createdAt: serverTimestamp(),
      checkedIn: false,
      checkInTime: null,
    };

    try {
      // Direct setDoc for strict validation
      const docRef = doc(db, pathForWrite, customId);
      await setDoc(docRef, rsvpData);

      setSubmittedRsvp({
        id: customId,
        ...rsvpData,
        createdAt: new Date(),
      });

      // Automatically trigger WhatsApp share redirect URL
      const waText = encodeURIComponent(
        `Halo Wildan & Zakia! ✨\n\nSaya *${name.trim()}* mengonfirmasi bahwa saya akan *${
          attendance === "hadir"
            ? `HADIR (Membawa ${guestsCount} Orang)`
            : "TIDAK HADIR"
        }* di acara pernikahan bahagia kalian.\n\nID RSVP saya: *${customId}*\n\nTerima kasih, sampai jumpa di Kampung Bareto! 🌸`,
      );

      // Keep WA URL ready for user to click
      const waUrl = `https://api.whatsapp.com/send?phone=${phoneNumber.trim().replace(/[^0-9]/g, "") || "628123456789"}&text=${waText}`;
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Gagal menyimpan RSVP. Pastikan koneksi internet Anda stabil.",
      );
      handleFirestoreError(
        err,
        OperationType.CREATE,
        `${pathForWrite}/${customId}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWaUrl = () => {
    if (!submittedRsvp) return "#";
    const waText = encodeURIComponent(
      `Halo Wildan & Zakia! ✨\n\nSaya *${submittedRsvp.name}* mengonfirmasi bahwa saya akan *${
        submittedRsvp.attendance === "hadir"
          ? `HADIR (Membawa ${submittedRsvp.guestsCount} Orang)`
          : "TIDAK HADIR"
      }* di acara pernikahan bahagia kalian.\n\nID RSVP saya: *${submittedRsvp.id}*\n\nSampai jumpa di Kampung Bareto! 🌸`,
    );
    return `https://api.whatsapp.com/send?text=${waText}&phone=62895321469740`;
  };

  return (
    <div
      id="rsvp-root"
      className="px-5 py-8 bg-[#FDFBF7] rounded-3xl border border-theory-clay/20 shadow-sm mx-4 relative overflow-hidden"
    >
      {/* Decorative Red String loop in top corner of RSVP Form */}
      <div className="absolute -top-4 -left-4 w-16 h-16 pointer-events-none opacity-20">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          className="text-theory-red w-full h-full"
        >
          <path
            d="M 0,0 Q 50,80 100,0"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {!submittedRsvp ? (
          <motion.div
            key="rsvp-form-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="font-serif text-2xl font-bold text-theory-espresso text-center tracking-wide mb-1">
              Konfirmasi Kehadiran
            </h3>

            {errorMsg && (
              <div
                id="rsvp-error"
                className="mb-4 p-3 text-xs bg-red-50 text-theory-red rounded-xl border border-red-100 text-center font-medium"
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-sans text-theory-clay mb-1 tracking-wider uppercase font-bold">
                  Nama Lengkap
                </label>
                <input
                  id="rsvp-input-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-4 py-3 bg-[#FCFAF6] border border-theory-clay/20 rounded-xl text-theory-espresso text-sm font-medium focus:outline-none focus:ring-1 focus:ring-theory-red/40 focus:border-theory-red"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans text-theory-clay mb-1 tracking-wider uppercase font-bold">
                  Nomor WhatsApp / Telp
                </label>
                <input
                  id="rsvp-input-phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full px-4 py-3 bg-[#FCFAF6] border border-theory-clay/20 rounded-xl text-theory-espresso text-sm font-medium focus:outline-none focus:ring-1 focus:ring-theory-red/40 focus:border-theory-red"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans text-theory-clay mb-1 tracking-wider uppercase font-bold">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="rsvp-btn-hadir"
                    type="button"
                    onClick={() => setAttendance("hadir")}
                    className={`py-3 text-xs rounded-xl font-bold tracking-wider uppercase transition-all ${
                      attendance === "hadir"
                        ? "bg-theory-red text-white shadow-md shadow-theory-red/10"
                        : "bg-white text-theory-espresso border border-theory-clay/25"
                    }`}
                  >
                    Hadir
                  </button>
                  <button
                    id="rsvp-btn-tidak"
                    type="button"
                    onClick={() => setAttendance("tidak_hadir")}
                    className={`py-3 text-xs rounded-xl font-bold tracking-wider uppercase transition-all ${
                      attendance === "tidak_hadir"
                        ? "bg-theory-red text-white shadow-md shadow-theory-red/10"
                        : "bg-white text-theory-espresso border border-theory-clay/25"
                    }`}
                  >
                    Tidak Hadir
                  </button>
                </div>
              </div>

              {attendance === "hadir" && (
                <motion.div
                  id="rsvp-guests-count-container"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-[10px] font-sans text-theory-clay mb-1 tracking-wider uppercase font-bold">
                    Jumlah Tamu (Pax)
                  </label>
                  <select
                    id="rsvp-select-guests"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#FCFAF6] border border-theory-clay/20 rounded-xl text-theory-espresso text-sm font-medium focus:outline-none focus:ring-1 focus:ring-theory-red/40 focus:border-theory-red"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Orang
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}

              <button
                id="rsvp-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 bg-theory-red hover:bg-theory-maroon text-white font-bold rounded-xl text-xs tracking-widest uppercase shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-stone-300 disabled:text-stone-500"
              >
                {isSubmitting ? "Menyimpan..." : "Kirim Konfirmasi"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="rsvp-success-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 space-y-5"
          >
            <div className="flex justify-center">
              <div className="bg-theory-cream text-theory-red p-3.5 rounded-full border border-theory-clay/20">
                <CheckCircle className="h-10 w-10 text-theory-red fill-theory-cream" />
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-theory-espresso tracking-wide">
                Terima Kasih Banyak!
              </h3>
              <p className="text-xs text-theory-clay font-sans mt-1 max-w-xs mx-auto leading-relaxed font-semibold">
                RSVP Anda telah berhasil dikirimkan dan disimpan dalam sistem
                buku tamu digital real-time kami.
              </p>
            </div>

            {/* WhatsApp Direct Action Button */}
            <div className="pt-2">
              <a
                id="rsvp-wa-share-btn"
                href={getWaUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl shadow-md transition-all"
              >
                <Share2 className="h-4 w-4 text-white" />
                Kirim Notifikasi WhatsApp
              </a>
              <p className="text-[9px] text-theory-clay/80 font-sans mt-2.5 leading-relaxed font-semibold">
                *Klik tombol di atas untuk mengirimkan konfirmasi kehadiran
                real-time ini ke kontak WhatsApp Anda / Mempelai secara
                otomatis.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
