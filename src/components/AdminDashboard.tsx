"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { RSVP, VisitorStats } from "@/types";
import {
  Users,
  UserCheck,
  UserX,
  AlertCircle,
  LogOut,
  ShieldCheck,
  QrCode,
  Search,
  Trash2,
  CalendarCheck,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  Plus,
  MessageCircle,
  Eye,
} from "lucide-react";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_logged_in") === "true";
    }
    return false;
  });
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkInIdInput, setCheckInIdInput] = useState("");
  const [checkInMessage, setCheckInMessage] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "checkin" | "guests"
  >("dashboard");
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  });

  const CORRECT_PASSCODE = "10826";

  useEffect(() => {
    const stored = localStorage.getItem("admin_logged_in");
    if (stored === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchRsvps = async () => {
      const { data, error } = await getSupabase()
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
        return;
      }

      setRsvps(
        (data || []).map((r: any) => ({
          id: r.id,
          name: r.name,
          attendance: r.attendance,
          guestsCount: r.guests_count,
          phoneNumber: r.phone_number,
          createdAt: r.created_at,
          checkedIn: r.checked_in || false,
          checkInTime: r.check_in_time || null,
          waSent: r.wa_sent || false,
          waSentCount: r.wa_sent_count || 0,
        })),
      );
    };

    fetchRsvps();

    const fetchVisitorStats = async () => {
      const supabase = getSupabase();

      const { count: total } = await supabase
        .from("visitors")
        .select("*", { count: "exact", head: true });

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { count: today } = await supabase
        .from("visitors")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfDay.toISOString());

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const { count: thisWeek } = await supabase
        .from("visitors")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfWeek.toISOString());

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: thisMonth } = await supabase
        .from("visitors")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());

      setVisitorStats({
        total: total ?? 0,
        today: today ?? 0,
        thisWeek: thisWeek ?? 0,
        thisMonth: thisMonth ?? 0,
      });
    };

    fetchVisitorStats();

    const channel = getSupabase()
      .channel("rsvps")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rsvps" },
        () => {
          fetchRsvps();
        },
      )
      .subscribe();

    return () => {
      getSupabase().removeChannel(channel);
    };
  }, [isLoggedIn]);

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === CORRECT_PASSCODE) {
      setIsLoggedIn(true);
      localStorage.setItem("admin_logged_in", "true");
      setLoginError(null);
    } else {
      setLoginError("Passcode salah. Silakan coba lagi.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin_logged_in");
    setPasscode("");
  };

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
        text: `Tamu "${targetRsvp.name}" sudah check-in pada ${new Date(targetRsvp.checkInTime!).toLocaleTimeString("id-ID")}.`,
      });
      return;
    }

    try {
      const { error } = await getSupabase()
        .from("rsvps")
        .update({
          checked_in: true,
          check_in_time: new Date().toISOString(),
        })
        .eq("id", targetRsvp.id!);

      if (error) throw error;

      setCheckInMessage({
        status: "success",
        text: `Berhasil! "${targetRsvp.name}" (${targetRsvp.guestsCount} Pax) terverifikasi.`,
      });
      setCheckInIdInput("");
    } catch (err) {
      setCheckInMessage({
        status: "error",
        text: "Gagal memproses check-in. Hubungi admin.",
      });
    }
  };

  const handleDeleteRsvp = async (id: string, name: string) => {
    if (!window.confirm(`Hapus RSVP dari "${name}"?`)) return;
    try {
      await getSupabase().from("rsvps").delete().eq("id", id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setAddError("Nama harus diisi.");
      return;
    }
    if (!newPhone.trim()) {
      setAddError("Nomor telepon harus diisi.");
      return;
    }

    const id =
      "rsvp-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const { error } = await getSupabase().from("rsvps").insert({
      id,
      name: newName.trim(),
      attendance: "tidak_hadir",
      guests_count: 1,
      phone_number: newPhone.trim(),
      created_at: new Date().toISOString(),
      checked_in: false,
      check_in_time: null,
      wa_sent: false,
      wa_sent_count: 0,
    });

    if (error) {
      setAddError("Gagal menambahkan tamu. Coba lagi.");
      return;
    }

    setNewName("");
    setNewPhone("");
    setShowAddGuest(false);
    setAddError(null);
  };

  const handleSendWa = async (rsvp: RSVP) => {
    const waText = encodeURIComponent(
      `Kepada Yth.\nBapak/Ibu/Saudara/i\n${rsvp.name}\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami.\n\nBerikut link undangan kami, untuk info lengkap dari acara, bisa kunjungi :\n\nhttps://wedding-invitation-zakia-wildan.vercel.app?to=${encodeURIComponent(rsvp.name)}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\n\nMohon maaf perihal undangan hanya di bagikan melalui pesan ini.\n\nTerima Kasih\n\nHormat kami,\nZakia & Wildan`,
    );
    let phone = rsvp.phoneNumber.replace(/[^0-9]/g, "");
    if (phone.startsWith("0")) phone = "62" + phone.slice(1);
    const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${waText}`;
    window.open(waUrl, "_blank");

    const newCount = (rsvp.waSentCount || 0) + 1;
    await getSupabase()
      .from("rsvps")
      .update({ wa_sent: true, wa_sent_count: newCount })
      .eq("id", rsvp.id!);
  };

  const totalRsvps = rsvps.length;
  const totalAttending = rsvps.filter((r) => r.attendance === "hadir").length;
  const totalNotAttending = rsvps.filter(
    (r) => r.attendance === "tidak_hadir",
  ).length;
  const totalCheckedIn = rsvps.filter((r) => r.checkedIn).length;
  const totalWaSent = rsvps.filter((r) => r.waSent).length;
  const totalWaClicks = rsvps.reduce(
    (acc, curr) => acc + (curr.waSentCount || 0),
    0,
  );
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                <ShieldCheck className="h-6 w-6 text-gray-600" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Masukkan kode akses untuk masuk
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handlePasscodeLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Akses
                </label>
                <input
                  id="admin-passcode-input"
                  type="password"
                  required
                  placeholder="Masukkan kode akses"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                id="admin-login-btn"
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-sm transition-colors"
              >
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-900 text-sm">
                Admin Panel
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab("checkin");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                activeTab === "checkin"
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <QrCode className="h-4 w-4" />
              Check-In Verification
            </button>
            <button
              onClick={() => {
                setActiveTab("guests");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                activeTab === "guests"
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Users className="h-4 w-4" />
              Daftar Tamu
            </button>
          </nav>

          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-gray-700">
              Zakia & Wildan Admin
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs">
            <span className="text-gray-500">
              WA Terkirim:{" "}
              <strong className="text-gray-800">{totalWaSent}</strong>
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">
              Total Klik:{" "}
              <strong className="text-gray-800">{totalWaClicks}x</strong>
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Dashboard Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Total RSVP
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {totalRsvps}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <UserCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Hadir
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {totalAttending} ({totalPax})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <UserX className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Tidak Hadir
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {totalNotAttending}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <CalendarCheck className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Checked In
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {totalCheckedIn}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        WA Terkirim
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {totalWaSent} ({totalWaClicks}x)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visitor stats */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Pengunjung Website
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
                  <div className="px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {visitorStats.total}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Total</p>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {visitorStats.today}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Hari Ini</p>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {visitorStats.thisWeek}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Minggu Ini</p>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {visitorStats.thisMonth}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Bulan Ini</p>
                  </div>
                </div>
              </div>

              {/* Recent RSVPs table */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    RSVP Terbaru
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                          Nama
                        </th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                          Pax
                        </th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                          Check-In
                        </th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                          Waktu
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rsvps.slice(0, 10).map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-medium text-gray-900">
                            {rsvp.name}
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                rsvp.attendance === "hadir"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {rsvp.attendance === "hadir"
                                ? "Hadir"
                                : "Tidak Hadir"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-gray-600">
                            {rsvp.guestsCount}
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                rsvp.checkedIn
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-gray-50 text-gray-500"
                              }`}
                            >
                              {rsvp.checkedIn ? "Sudah" : "Belum"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-gray-500 text-xs">
                            {rsvp.createdAt
                              ? new Date(rsvp.createdAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : "-"}
                          </td>
                        </tr>
                      ))}
                      {rsvps.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-gray-400"
                          >
                            Belum ada data RSVP
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "checkin" && (
            <div className="max-w-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Check-In Verification
              </h2>

              <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                <p className="text-sm text-gray-500">
                  Masukkan ID RSVP tamu untuk verifikasi check-in.
                </p>

                <div className="flex gap-2">
                  <input
                    id="admin-scan-input"
                    type="text"
                    placeholder="Contoh: RSVP-XXXXXX"
                    value={checkInIdInput}
                    onChange={(e) => setCheckInIdInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleVerifyCheckIn(checkInIdInput);
                    }}
                  />
                  <button
                    id="admin-scan-btn"
                    onClick={() => handleVerifyCheckIn(checkInIdInput)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Verifikasi
                  </button>
                </div>

                {checkInMessage && (
                  <div
                    className={`p-3 rounded-md text-sm border ${
                      checkInMessage.status === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    {checkInMessage.text}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "guests" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Daftar Tamu
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddGuest(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Tamu
                  </button>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">
                    {filteredRsvps.length} tamu
                  </span>
                </div>
              </div>

              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  id="admin-search"
                  type="text"
                  placeholder="Cari nama, ID, atau no. telp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                          Nama
                        </th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                          No. Telp
                        </th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                          Check-In
                        </th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                          WA
                        </th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                          WA Count
                        </th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredRsvps.map((rsvp, idx) => (
                        <tr key={rsvp.id || idx} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-medium text-gray-900">
                            {rsvp.name}
                          </td>
                          <td className="px-4 py-2.5 text-gray-600">
                            {rsvp.phoneNumber}
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                rsvp.attendance === "hadir"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {rsvp.attendance === "hadir"
                                ? `Hadir (${rsvp.guestsCount})`
                                : "Tidak Hadir"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                rsvp.checkedIn
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-gray-50 text-gray-500"
                              }`}
                            >
                              {rsvp.checkedIn ? "Checked-In" : "Belum"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                rsvp.waSent
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-50 text-gray-400"
                              }`}
                            >
                              {rsvp.waSent ? "Terkirim" : "Belum"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-gray-600 text-xs">
                            {rsvp.waSentCount || 0}
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-1">
                              {!rsvp.checkedIn &&
                                rsvp.attendance === "hadir" && (
                                  <button
                                    id={`checkin-guest-btn-${idx}`}
                                    onClick={() =>
                                      handleVerifyCheckIn(rsvp.id!)
                                    }
                                    className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                  >
                                    Check-In
                                  </button>
                                )}
                              <button
                                id={`wa-guest-btn-${idx}`}
                                onClick={() => handleSendWa(rsvp)}
                                className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                title="Kirim WhatsApp"
                              >
                                <MessageCircle className="h-3 w-3" />
                                WA
                              </button>
                              <button
                                id={`delete-guest-btn-${idx}`}
                                onClick={() =>
                                  handleDeleteRsvp(rsvp.id!, rsvp.name)
                                }
                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredRsvps.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-8 text-center text-gray-400"
                          >
                            {searchQuery
                              ? "Tidak ada tamu yang cocok"
                              : "Belum ada data tamu"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Guest Modal */}
      {showAddGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                Tambah Tamu
              </h3>
              <button
                onClick={() => {
                  setShowAddGuest(false);
                  setAddError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {addError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nama tamu"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddGuest(false);
                    setAddError(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
