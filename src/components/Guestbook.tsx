import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  collection,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { GuestMessage } from "../types";
import { Send, MessageSquareHeart, User } from "lucide-react";

export default function Guestbook() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const collectionPath = "messages";

  useEffect(() => {
    // Real-time synchronization
    const q = query(
      collection(db, collectionPath),
      orderBy("createdAt", "desc"),
      limit(50),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messagesList: GuestMessage[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          messagesList.push({
            id: doc.id,
            name: data.name,
            text: data.text,
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        });
        setMessages(messagesList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, collectionPath);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Mohon masukkan nama Anda.");
      return;
    }
    if (!text.trim()) {
      setErrorMsg("Mohon tulis ucapan doa Anda.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const messageId =
      "msg-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    try {
      const docRef = doc(db, collectionPath, messageId);
      await setDoc(docRef, {
        name: name.trim(),
        text: text.trim(),
        createdAt: serverTimestamp(),
      });

      // Clear input text (keep name for convenience)
      setText("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal mengirim doa. Mohon coba lagi.");
      handleFirestoreError(
        err,
        OperationType.CREATE,
        `${collectionPath}/${messageId}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="guestbook-root" className="px-4 py-8 mx-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <MessageSquareHeart className="h-5 w-5 text-theory-red" />
        <h3 className="font-serif text-2xl font-bold text-theory-espresso tracking-wide">
          Ucapan Doa & Harapan
        </h3>
      </div>
      <p className="text-theory-clay font-sans text-xs text-center mb-6 max-w-xs mx-auto tracking-wide leading-relaxed font-semibold">
        Berikan doa restu dan harapan terbaik Anda untuk mengiringi awal
        perjalanan kehidupan kami.
      </p>

      {/* Form Submission */}
      <div
        id="guestbook-form-box"
        className="bg-[#FDFBF7] border border-theory-clay/20 rounded-3xl p-4 shadow-sm mb-6"
      >
        {errorMsg && (
          <div className="mb-3 p-2.5 text-xs bg-red-50 text-theory-red rounded-lg border border-red-100 text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              id="msg-input-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              className="w-full px-3.5 py-2.5 bg-[#FCFAF6] border border-theory-clay/20 rounded-xl text-theory-espresso text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-theory-red/40 focus:border-theory-red"
            />
          </div>
          <div>
            <textarea
              id="msg-input-text"
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tuliskan ucapan selamat dan doa restu Anda..."
              className="w-full px-3.5 py-2.5 bg-[#FCFAF6] border border-theory-clay/20 rounded-xl text-theory-espresso text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-theory-red/40 focus:border-theory-red resize-none"
            />
          </div>
          <button
            id="msg-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-theory-red hover:bg-theory-maroon text-white font-bold rounded-xl text-xs tracking-widest uppercase shadow-md transition-all flex items-center justify-center gap-1.5 disabled:bg-stone-200 disabled:text-stone-400"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Doa Restu"}
            <Send className="h-3 w-3" />
          </button>
        </form>
      </div>

      {/* Display Messages */}
      <div
        id="guestbook-messages-list"
        className="space-y-3 max-h-[350px] overflow-y-auto pr-1"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <div
              id="guestbook-empty"
              className="text-center py-6 text-xs text-theory-clay font-sans italic font-semibold"
            >
              Belum ada ucapan doa. Jadilah yang pertama memberikan restu! ✨
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id || index}
                id={`guestbook-item-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
                className="bg-[#FCFAF6] border border-theory-clay/15 p-4 rounded-2xl flex gap-3 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-theory-cream flex items-center justify-center text-theory-red border border-theory-clay/10">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-bold text-theory-espresso tracking-wide">
                      {msg.name}
                    </span>
                    <span className="text-[9px] text-theory-clay font-sans font-bold">
                      {new Date(msg.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-theory-espresso/90 font-sans font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
