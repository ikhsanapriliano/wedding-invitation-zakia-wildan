import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, Copy, Check, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function GiftSection() {
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const bankAccount = "8090481721";
  const ewalletNumber = "0895321469740";

  const handleCopyBank = () => {
    navigator.clipboard.writeText(bankAccount);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(ewalletNumber);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div
      id="gift-root"
      className="px-5 py-8 mx-4 bg-theory-cream rounded-3xl border border-theory-clay/20 shadow-sm relative overflow-hidden"
    >
      {/* Red fate loop drawing decorative line */}
      <div className="absolute -bottom-6 -right-6 w-20 h-20 pointer-events-none opacity-20">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          className="text-theory-red w-full h-full"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <Gift className="h-5 w-5 text-theory-red animate-pulse" />
        <h3 className="font-serif text-2xl font-bold text-theory-espresso tracking-wide">
          Kirim Kado Digital
        </h3>
      </div>
      <p className="text-theory-clay font-sans text-xs text-center mb-6 max-w-xs mx-auto tracking-wide leading-relaxed font-semibold">
        Doa restu Anda adalah karunia terindah bagi kami. Namun jika ingin
        memberikan tanda kasih, Anda dapat mengirimkannya secara cashless
        melalui rekening di bawah ini:
      </p>

      <div className="space-y-4 max-w-xs mx-auto">
        {/* Bank BCA Card */}
        <motion.div
          id="bank-bca-card"
          className="bg-white border border-theory-clay/15 rounded-2xl p-4 shadow-sm relative overflow-hidden"
          whileHover={{ y: -2 }}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                Bank BCA
              </span>
              <p className="text-sm font-serif font-bold text-theory-espresso mt-1">
                Wildan Mulkan Hakim
              </p>
            </div>
            <span className="text-[9px] text-theory-clay font-mono font-bold">
              IDR Account
            </span>
          </div>

          <div className="flex items-center justify-between bg-stone-50 rounded-xl p-3 border border-stone-100">
            <span
              id="bank-acc-no"
              className="font-mono text-sm tracking-wider text-theory-espresso font-bold"
            >
              {bankAccount}
            </span>
            <button
              id="copy-bank-btn"
              onClick={handleCopyBank}
              className="text-theory-clay hover:text-theory-red transition-colors"
            >
              {copiedBank ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {copiedBank && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-4 bottom-1 text-[9px] text-emerald-600 font-bold"
              >
                No. Rekening berhasil disalin!
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* E-Wallet Card */}
        <motion.div
          id="ewallet-card"
          className="bg-white border border-theory-clay/15 rounded-2xl p-4 shadow-sm relative overflow-hidden"
          whileHover={{ y: -2 }}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                DANA / OVO
              </span>
              <p className="text-sm font-serif font-bold text-theory-espresso mt-1">
                Wildan Mulkan Hakim
              </p>
            </div>
            <span className="text-[9px] text-theory-clay font-mono font-bold">
              E-Wallet
            </span>
          </div>

          <div className="flex items-center justify-between bg-stone-50 rounded-xl p-3 border border-stone-100 mb-2">
            <span
              id="wallet-acc-no"
              className="font-mono text-sm tracking-wider text-theory-espresso font-bold"
            >
              {ewalletNumber}
            </span>
            <button
              id="copy-wallet-btn"
              onClick={handleCopyPhone}
              className="text-theory-clay hover:text-theory-red transition-colors"
            >
              {copiedPhone ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            id="toggle-qr-btn"
            onClick={() => setShowQR(!showQR)}
            className="w-full py-2 bg-theory-red hover:bg-theory-maroon text-white font-bold rounded-xl text-[11px] tracking-wider flex items-center justify-center gap-1 transition-all shadow-sm"
          >
            <QrCode className="h-3.5 w-3.5" />
            {showQR ? "Sembunyikan QR Code" : "Tampilkan QR Angpao"}
          </button>

          <AnimatePresence>
            {showQR && (
              <motion.div
                id="ewallet-qr-box"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden flex flex-col items-center pt-3 mt-3 border-t border-stone-100"
              >
                <div className="bg-white p-2 border border-theory-clay/20 rounded-xl shadow-inner">
                  <QRCodeSVG
                    value={`https://qr.dana.id/v1/281012012024080527510725`}
                    size={130}
                    bgColor="#ffffff"
                    fgColor="#261414"
                    level="H"
                  />
                </div>
                <span className="text-[8px] text-theory-clay font-sans mt-1.5 uppercase tracking-widest font-bold">
                  Scan QR Dana untuk Transfer Cepat
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {copiedPhone && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-4 bottom-1 text-[9px] text-emerald-600 font-bold"
              >
                No. HP berhasil disalin!
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
