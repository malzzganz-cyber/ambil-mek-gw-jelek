"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, Users, Wallet, ShoppingCart, Check, X,
  TrendingUp, RefreshCw, Loader2, Settings, DollarSign
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import {
  collection, query, where, orderBy, onSnapshot,
  doc, updateDoc, increment, getDocs
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type { DepositRequest, WithdrawRequest } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"deposit" | "withdraw" | "settings">("deposit");
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [withdraws, setWithdraws] = useState<WithdrawRequest[]>([]);
  const [markup, setMarkup] = useState("10");
  const [rumahBalance, setRumahBalance] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.isAdmin) return;

    const depQ = query(
      collection(db, "deposits"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    const unsubDep = onSnapshot(depQ, (snap) => {
      setDeposits(snap.docs.map((d) => ({ id: d.id, ...d.data() } as DepositRequest)));
    });

    const wdQ = query(
      collection(db, "withdraws"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    const unsubWd = onSnapshot(wdQ, (snap) => {
      setWithdraws(snap.docs.map((d) => ({ id: d.id, ...d.data() } as WithdrawRequest)));
    });

    fetchRumahBalance();

    return () => { unsubDep(); unsubWd(); };
  }, [user?.isAdmin]);

  const fetchRumahBalance = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin?action=balance");
      const json = await res.json();
      if (json.success) setRumahBalance(json.data.balance);
    } catch {}
    setStatsLoading(false);
  };

  const confirmDeposit = async (dep: DepositRequest) => {
    setProcessing(dep.id);
    try {
      await updateDoc(doc(db, "deposits", dep.id), {
        status: "confirmed",
        confirmedAt: new Date().toISOString()
      });
      await updateDoc(doc(db, "users", dep.userId), {
        balance: increment(dep.amount)
      });
      toast.success(`Deposit ${formatCurrency(dep.amount)} dikonfirmasi`);
    } catch {
      toast.error("Gagal konfirmasi deposit");
    } finally {
      setProcessing(null);
    }
  };

  const rejectDeposit = async (depId: string) => {
    setProcessing(depId);
    try {
      await updateDoc(doc(db, "deposits", depId), { status: "rejected" });
      toast.success("Deposit ditolak");
    } catch {
      toast.error("Gagal menolak deposit");
    } finally {
      setProcessing(null);
    }
  };

  const processWithdraw = async (wd: WithdrawRequest) => {
    setProcessing(wd.id);
    try {
      await updateDoc(doc(db, "withdraws", wd.id), {
        status: "processed",
        processedAt: new Date().toISOString()
      });
      toast.success("Withdraw diproses");
    } catch {
      toast.error("Gagal memproses withdraw");
    } finally {
      setProcessing(null);
    }
  };

  const saveMarkup = async () => {
    const val = parseInt(markup);
    if (isNaN(val) || val < 0 || val > 100) {
      return toast.error("Markup harus antara 0-100%");
    }
    try {
      await updateDoc(doc(db, "settings", "app"), { markup: val });
      toast.success("Markup disimpan");
    } catch {
      toast.error("Gagal menyimpan markup");
    }
  };

  if (loading || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400 text-sm">Kelola deposit, withdraw, dan pengaturan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Saldo RumahOTP</p>
              <p className="text-lg font-bold text-amber-400">
                {statsLoading ? "..." : rumahBalance !== null ? formatCurrency(rumahBalance) : "N/A"}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Deposit Pending</p>
              <p className="text-lg font-bold text-yellow-400">{deposits.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Withdraw Pending</p>
              <p className="text-lg font-bold text-red-400">{withdraws.length}</p>
            </div>
          </Card>
        </div>

        <div className="flex gap-2 mb-6">
          {(["deposit", "withdraw", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                tab === t
                  ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                  : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
              }`}
            >
              {t === "deposit" ? `Deposit (${deposits.length})` : t === "withdraw" ? `Withdraw (${withdraws.length})` : "Pengaturan"}
            </button>
          ))}
        </div>

        {tab === "deposit" && (
          <div className="space-y-4">
            {deposits.length === 0 ? (
              <div className="text-center py-12 text-slate-500 glass rounded-2xl">
                <Check className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Tidak ada deposit pending</p>
              </div>
            ) : (
              deposits.map((dep) => (
                <motion.div
                  key={dep.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white font-bold text-xl">{formatCurrency(dep.amount)}</p>
                      <p className="text-slate-400 text-sm">{dep.userId}</p>
                      <p className="text-xs text-slate-500">{formatDate(dep.createdAt)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="warning">Pending</Badge>
                      <span className="text-xs text-slate-400 uppercase">{dep.method}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="success"
                      size="sm"
                      fullWidth
                      loading={processing === dep.id}
                      onClick={() => confirmDeposit(dep)}
                    >
                      <Check className="w-4 h-4" />
                      Konfirmasi
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      loading={processing === dep.id}
                      onClick={() => rejectDeposit(dep.id)}
                    >
                      <X className="w-4 h-4" />
                      Tolak
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {tab === "withdraw" && (
          <div className="space-y-4">
            {withdraws.length === 0 ? (
              <div className="text-center py-12 text-slate-500 glass rounded-2xl">
                <Check className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Tidak ada withdraw pending</p>
              </div>
            ) : (
              withdraws.map((wd) => (
                <motion.div key={wd.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-bold text-xl">{formatCurrency(wd.amount)}</p>
                      <p className="text-slate-300 text-sm">{wd.accountName}</p>
                      <p className="text-slate-400 text-sm font-mono">{wd.method} — {wd.accountNumber}</p>
                      <p className="text-xs text-slate-500">{formatDate(wd.createdAt)}</p>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <Button
                    variant="success"
                    size="sm"
                    fullWidth
                    loading={processing === wd.id}
                    onClick={() => processWithdraw(wd)}
                  >
                    <Check className="w-4 h-4" />
                    Tandai Sudah Diproses
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className="space-y-5">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-brand-400" />
                <h2 className="font-semibold text-white">Markup Harga</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Persentase keuntungan yang ditambahkan ke harga RumahOTP
              </p>
              <div className="flex gap-3">
                <Input
                  type="number"
                  value={markup}
                  onChange={(e) => setMarkup(e.target.value)}
                  suffix={<span className="text-sm text-slate-400">%</span>}
                  className="max-w-xs"
                />
                <Button onClick={saveMarkup}>Simpan</Button>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-5 h-5 text-green-400" />
                <h2 className="font-semibold text-white">Saldo RumahOTP</h2>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-2xl font-bold text-green-400">
                  {rumahBalance !== null ? formatCurrency(rumahBalance) : "Tidak tersedia"}
                </p>
                <Button variant="secondary" size="sm" onClick={fetchRumahBalance} loading={statsLoading}>
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
