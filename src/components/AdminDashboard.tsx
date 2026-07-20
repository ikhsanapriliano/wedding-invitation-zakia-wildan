import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import {
  db,
  auth,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { RSVP } from "../types";
import {
  Users,
  UserCheck,
  UserX,
  AlertCircle,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Search,
  Trash2,
  CalendarCheck,
  HelpCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkInIdInput, setCheckInIdInput] = useState("");
  const [checkInMessage, setCheckInMessage] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Default backup passcode matching the wedding date "010826" or "10826" (1 August 2026)
  const CORRECT_PASSCODE = "10826";

  useEffect(() => {
    // Listen for auth state changes to support secure Google sign-in
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email === "wildandamang@gmail.com") {
        setIsLoggedIn(true);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Real-time synchronization for guest RSVPs
    const rsvpQuery = query(
      collection(db, "rsvps"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribeRsvps = onSnapshot(
      rsvpQuery,
      (snapshot) => {
        const rsvpList: RSVP[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          rsvpList.push({
            id: doc.id,
            name: data.name,
            attendance: data.attendance,
            guestsCount: data.guestsCount,
            phoneNumber: data.phoneNumber,
            createdAt: data.createdAt?.toDate() || new Date(),
            checkedIn: data.checkedIn || false,
            checkInTime: data.checkInTime?.toDate() || null,
          });
        });
        setRsvps(rsvpList);
      },
      (error) => {
        console.error(error);
        // Fallback or handle
      },
    );

    return () => unsubscribeRsvps();
  }, [isLoggedIn]);

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === CORRECT_PASSCODE) {
      setIsLoggedIn(true);
      setLoginError(null);
    } else {
      setLoginError(
        "Passcode salah! Silakan masukkan kode tanggal pernikahan (10826).",
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email === "wildandamang@gmail.com") {
        setIsLoggedIn(true);
        setLoginError(null);
      } else {
        setLoginError(
          "Hanya email wildandamang@gmail.com yang diizinkan untuk masuk sebagai admin.",
        );
        await signOut(auth);
      }
    } catch (error) {
      setLoginError(
        "Login Google gagal. Silakan gunakan Kode Akses Cepat di bawah.",
      );
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setPasscode("");
    setCurrentUser(null);
  };

  // Perform check-in via RSVP ID manual input (verification scan simulator)
  const handleVerifyCheckIn = async (idToVerify: string) => {
    const cleanId = idToVerify.trim().toUpperCase();
    if (!cleanId) return;

    const targetRsvp = rsvps.find(
      (r) => r.id === cleanId || r.id?.toUpperCase() === cleanId,
    );

    if (!targetRsvp) {
      setCheckInMessage({
        status: "error",
        text: `Data RSVP dengan ID "${cleanId}" tidak ditemukan.`,
      });
      return;
    }

    if (targetRsvp.checkedIn) {
      setCheckInMessage({
        status: "error",
        text: `Tamu "${targetRsvp.name}" sudah melakukan check-in pada pukul ${new Date(targetRsvp.checkInTime).toLocaleTimeString("id-ID")}.`,
      });
      return;
    }

    try {
      const rsvpDocRef = doc(db, "rsvps", targetRsvp.id!);
      await updateDoc(rsvpDocRef, {
        checkedIn: true,
        checkInTime: serverTimestamp(),
      });

      setCheckInMessage({
        status: "success",
        text: `Berhasil! "${targetRsvp.name}" (${targetRsvp.guestsCount} Pax) terverifikasi & berhasil masuk.`,
      });
      setCheckInIdInput("");
    } catch (err) {
      setCheckInMessage({
        status: "error",
        text: "Gagal memproses check-in. Hubungi admin database.",
      });
      handleFirestoreError(err, OperationType.UPDATE, `rsvps/${targetRsvp.id}`);
    }
  };

  const handleDeleteRsvp = async (id: string, name: string) => {
    if (
      !window.confirm(`Apakah Anda yakin ingin menghapus RSVP dari "${name}"?`)
    )
      return;
    try {
      await deleteDoc(doc(db, "rsvps", id));
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.DELETE, `rsvps/${id}`);
    }
  };

  // Compute stats
  const totalRsvps = rsvps.length;
  const totalAttendingDocs = rsvps.filter(
    (r) => r.attendance === "hadir",
  ).length;
  const totalNotAttendingDocs = rsvps.filter(
    (r) => r.attendance === "tidak_hadir",
  ).length;
  const totalCheckedIn = rsvps.filter((r) => r.checkedIn).length;
  const totalPax = rsvps.reduce(
    (acc, curr) => acc + (curr.attendance === "hadir" ? curr.guestsCount : 0),
    0,
  );

  const filteredRsvps = rsvps.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phoneNumber.includes(searchQuery),
  );

  return (
    <div
      id="admin-root"
      className="px-4 py-8 max-w-lg mx-auto bg-stone-100 min-h-screen"
    >
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-stone-200 p-6 rounded-3xl shadow-xl mt-12 space-y-6"
          >
            <div className="text-center space-y-1">
              <div className="inline-flex p-3 bg-stone-50 rounded-full text-amber-800 border border-stone-200">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="font-serif text-2xl text-stone-800 tracking-wide mt-2">
                Dashboard Admin
              </h2>
              <p className="text-xs text-stone-400 font-sans tracking-wide">
                Gunakan Kode Akses atau Akun Google untuk Masuk
              </p>
            </div>

            {loginError && (
              <div
                id="login-error"
                className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 text-center flex items-center gap-1.5 justify-center"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Passcode Login Form */}
            <form onSubmit={handlePasscodeLogin} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-widest mb-1">
                  Kode Akses Cepat (PIN)
                </label>
                <input
                  id="admin-passcode-input"
                  type="password"
                  required
                  placeholder="Masukkan Kode Tanggal Nikah (ex: 10826)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 text-center font-mono tracking-widest text-lg"
                />
              </div>

              <button
                id="admin-login-btn"
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-stone-100 font-medium rounded-xl text-xs tracking-widest uppercase transition-colors"
              >
                Masuk Dengan PIN
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink mx-3 text-[10px] text-stone-400 font-sans uppercase tracking-widest">
                ATAU
              </span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            {/* Google Authentication Option */}
            <button
              id="admin-google-btn"
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Icon"
                className="h-4 w-4"
              />
              Masuk dengan Google (wildandamang@gmail.com)
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-20"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-stone-200/50">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-serif font-bold text-stone-800 tracking-wide">
                  Zakia & Wildan Admin
                </span>
              </div>
              <button
                id="admin-logout-btn"
                onClick={handleLogout}
                className="text-stone-500 hover:text-red-600 transition-colors flex items-center gap-1 text-[11px] font-sans"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>

            {/* Quick RSVP Verification Scanner Box */}
            <div className="bg-stone-900 text-stone-100 p-5 rounded-3xl shadow-lg border border-stone-800 space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-amber-400" />
                <h3 className="font-serif text-base tracking-wide text-white">
                  Verifikasi Check-In Tamu
                </h3>
              </div>
              <p className="text-[10px] text-stone-400 font-sans leading-normal">
                Ketik atau paste ID RSVP unik dari undangan tamu untuk
                memverifikasi kedatangan di lokasi acara secara langsung.
              </p>

              <div className="flex gap-2">
                <input
                  id="admin-scan-input"
                  type="text"
                  placeholder="Contoh: RSVP-XXXXXX"
                  value={checkInIdInput}
                  onChange={(e) => setCheckInIdInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white font-mono text-sm uppercase placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  id="admin-scan-btn"
                  onClick={() => handleVerifyCheckIn(checkInIdInput)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold uppercase rounded-xl tracking-wider transition-colors"
                >
                  Verifikasi
                </button>
              </div>

              {checkInMessage && (
                <div
                  id="admin-scan-msg"
                  className={`p-3 rounded-xl text-xs border ${
                    checkInMessage.status === "success"
                      ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
                      : "bg-red-950/80 border-red-500/30 text-red-300"
                  }`}
                >
                  {checkInMessage.text}
                </div>
              )}
            </div>

            {/* Real-time stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-3">
                <div className="bg-stone-50 p-2 rounded-xl text-stone-700 border border-stone-100">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-sans text-stone-400 uppercase tracking-wider block">
                    Total RSVP
                  </span>
                  <span className="text-xl font-bold font-serif text-stone-800">
                    {totalRsvps}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-3">
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 border border-emerald-100">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-sans text-stone-400 uppercase tracking-wider block">
                    Hadir (Pax)
                  </span>
                  <span className="text-xl font-bold font-serif text-emerald-800">
                    {totalAttendingDocs} ({totalPax})
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-3">
                <div className="bg-red-50 p-2 rounded-xl text-red-600 border border-red-100">
                  <UserX className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-sans text-stone-400 uppercase tracking-wider block">
                    Tidak Hadir
                  </span>
                  <span className="text-xl font-bold font-serif text-red-800">
                    {totalNotAttendingDocs}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-3">
                <div className="bg-amber-50 p-2 rounded-xl text-amber-600 border border-amber-100">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-sans text-stone-400 uppercase tracking-wider block">
                    Checked In
                  </span>
                  <span className="text-xl font-bold font-serif text-amber-800">
                    {totalCheckedIn}
                  </span>
                </div>
              </div>
            </div>

            {/* List Guests */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/50 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-base text-stone-800">
                  Daftar Tamu Undangan
                </h4>
                <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded-full font-mono text-stone-500">
                  {filteredRsvps.length} Tamu
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                <input
                  id="admin-search"
                  type="text"
                  placeholder="Cari nama, ID rsvp, atau nomor telp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              {/* Guest Rows */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {filteredRsvps.length === 0 ? (
                  <div className="text-center py-8 text-xs text-stone-400 font-sans italic">
                    Belum ada data tamu yang cocok.
                  </div>
                ) : (
                  filteredRsvps.map((rsvp, idx) => (
                    <div
                      key={rsvp.id || idx}
                      className="bg-stone-50 border border-stone-200/30 p-3 rounded-2xl space-y-2 relative"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-serif text-xs font-bold text-stone-800">
                            {rsvp.name}
                          </h5>
                          <span className="text-[9px] font-mono text-stone-400 tracking-wider block mt-0.5">
                            ID: {rsvp.id} | Telp: {rsvp.phoneNumber}
                          </span>
                        </div>

                        <button
                          id={`delete-guest-btn-${idx}`}
                          onClick={() => handleDeleteRsvp(rsvp.id!, rsvp.name)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-[10px] pt-1 border-t border-stone-100">
                        <div className="flex gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full font-medium ${
                              rsvp.attendance === "hadir"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                            }`}
                          >
                            {rsvp.attendance === "hadir"
                              ? `Hadir (${rsvp.guestsCount} Pax)`
                              : "Tidak Hadir"}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full font-medium ${
                              rsvp.checkedIn
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-stone-100 text-stone-400"
                            }`}
                          >
                            {rsvp.checkedIn ? "Checked-In ✓" : "Belum Datang"}
                          </span>
                        </div>

                        {!rsvp.checkedIn && rsvp.attendance === "hadir" && (
                          <button
                            id={`checkin-guest-btn-${idx}`}
                            onClick={() => handleVerifyCheckIn(rsvp.id!)}
                            className="bg-stone-900 hover:bg-stone-800 text-stone-100 px-2 py-0.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider transition-all"
                          >
                            Check-In
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
