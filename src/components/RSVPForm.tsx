"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getSupabase } from "@/lib/supabase";
import {
  CheckCircle,
  Calendar,
  MessageSquare,
  ArrowRight,
  Share2,
} from "lucide-react";

interface RSVPFormProps {
  guestNameFromUrl: string;
  phoneFromUrl: string;
  idFromUrl: string;
}

export default function RSVPForm({
  guestNameFromUrl,
  phoneFromUrl,
  idFromUrl,
}: RSVPFormProps) {
  const [name] = useState(guestNameFromUrl || "");
  const [phone] = useState(phoneFromUrl || "");
  const [attendance, setAttendance] = useState<"hadir" | "tidak_hadir">(
    "hadir",
  );
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRsvp, setSubmittedRsvp] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Mohon masukkan nama Anda.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Mohon masukkan nomor WhatsApp Anda.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const updateData: Record<string, any> = {
      name: name.trim(),
      attendance,
      guests_count: attendance === "hadir" ? Number(guestsCount) : 0,
      phone_number: phone.trim(),
    };

    try {
      const { error } = await getSupabase()
        .from("rsvps")
        .update(updateData)
        .eq("id", idFromUrl);

      if (error) throw error;

      setSubmittedRsvp({ id: idFromUrl, ...updateData });
    } catch (err) {
      console.log(err);
      setErrorMsg(
        "Gagal menyimpan RSVP. Pastikan koneksi internet Anda stabil.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWaUrl = () => {
    if (!submittedRsvp) return "#";
    const waText = encodeURIComponent(
      `Halo Zakia & Wildan! ✨\n\nSaya *${submittedRsvp.name}* mengonfirmasi bahwa saya akan *${
        submittedRsvp.attendance === "hadir"
          ? `HADIR (Membawa ${submittedRsvp.guests_count} Orang)`
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
                  disabled
                  className="w-full px-4 py-3 bg-[#FCFAF6] border border-theory-clay/20 rounded-xl text-theory-espresso text-sm font-medium focus:outline-none focus:ring-1 focus:ring-theory-red/40 focus:border-theory-red opacity-70 cursor-not-allowed"
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
                  value={phone}
                  disabled
                  placeholder="Contoh: 08123456789"
                  className="w-full px-4 py-3 bg-[#FCFAF6] border border-theory-clay/20 rounded-xl text-theory-espresso text-sm font-medium focus:outline-none focus:ring-1 focus:ring-theory-red/40 focus:border-theory-red opacity-70 cursor-not-allowed"
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