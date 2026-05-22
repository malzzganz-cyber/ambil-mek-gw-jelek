"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, QrCode, CreditCard, Copy, CheckCircle, Clock, X, Upload } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import {
  collection, addDoc, serverTimestamp, query,
  where, orderBy, onSnapshot
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type { DepositRequest } from "@/types";
import toast from "react-hot-toast";

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000, 200000, 500000];

export default function DepositPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"qris" | "transfer">("qris");
  const [step, setStep] = useState<"form" | "payment">("form");
  const [loading, setLoading] = useState(false);
  const [depositId, setDepositId] = useState("");
  const [history, setHistory] = useState<DepositRequest[]>([]);

  const QRIS_CODE = "00020101021226580014ID.CO.BCA.WWW011893600014000093571502150009357150303UMI51440014ID.CO.QRIS.WWW0215ID10220507748590303UMI5204562253033605802ID5906Malzz6013JAKARTA PUSAT61051234062070703A0163044B44";

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "deposits"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() } as DepositRequest)));
    });
    return () => unsub();
  }, [user?.uid]);

  const handleDeposit = async () => {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount < 10000) return toast.error("Minimum deposit Rp 10.000");
    if (numAmount > 5000000) return toast.error("Maksimum deposit Rp 5.000.000");
    if (!user) return;

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "deposits"), {
        userId: user.uid,
        amount: numAmount,
        method,
        status: "pending",
        createdAt: serverTimestamp()
      });

      setDepositId(docRef.id);
      setStep("payment");
    } catch {
      toast.error("Gagal membuat request deposit");
    } finally {
      setLoading(false);
    }
  };

  const copyQris = () => {
    navigator.clipboard.writeText(QRIS_CODE);
    toast.success("Kode QRIS disalin!");
  };

  const confirmDeposit = () => {
    toast.success("Konfirmasi diterima! Admin akan memverifikasi dalam 1-5 menit.");
    setStep("form");
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Top Up Saldo</h1>
          <p className="text-slate-400 text-sm">
            Saldo kamu:{" "}
            <span className="text-green-400 font-semibold">{formatCurrency(user?.balance ?? 0)}</span>
          </p>
        </div>

        {step === "form" ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-white">Pilih Metode Pembayaran</h2>
              <div className="grid grid-cols-2 gap-3">
                {(["qris", "transfer"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      method === m
                        ? "border-brand-500/60 bg-brand-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {m === "qris" ? (
                        <QrCode className={`w-5 h-5 ${method === m ? "text-brand-400" : "text-slate-400"}`} />
                      ) : (
                        <CreditCard className={`w-5 h-5 ${method === m ? "text-brand-400" : "text-slate-400"}`} />
                      )}
                      <span className={`font-medium text-sm uppercase ${method === m ? "text-brand-400" : "text-white"}`}>
                        {m === "qris" ? "QRIS" : "Transfer"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {m === "qris" ? "Scan & bayar via QRIS" : "Transfer bank manual"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-white">Jumlah Deposit</h2>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a.toString())}
                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                      amount === a.toString()
                        ? "bg-brand-500/20 border border-brand-500/40 text-brand-400"
                        : "bg-white/5 border border-white/10 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    {formatCurrency(a)}
                  </button>
                ))}
              </div>
              <Input
                type="number"
                placeholder="Atau masukkan jumlah lain..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                prefix={<span className="text-sm">Rp</span>}
              />
              <Button fullWidth loading={loading} onClick={handleDeposit}>
                <Wallet className="w-4 h-4" />
                Lanjutkan Deposit
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-6 space-y-5">
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-1">Bayar sejumlah</p>
              <p className="text-3xl font-bold text-green-400">{formatCurrency(parseInt(amount))}</p>
              <p className="text-xs text-slate-500 mt-1">ID: {depositId}</p>
            </div>

            {method === "qris" ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 p-5 bg-white rounded-2xl">
                  <div className="w-52 h-52 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center p-4">
                      <QrCode className="w-16 h-16 text-dark-900 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">QRIS Malzz Nokos</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={copyQris}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm text-brand-400 hover:text-brand-300"
                >
                  <Copy className="w-4 h-4" />
                  Salin Kode QRIS
                </button>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400">
                  <p className="font-medium mb-1">Cara bayar:</p>
                  <ol className="space-y-1 list-decimal list-inside">
                    <li>Buka aplikasi bank / e-wallet kamu</li>
                    <li>Pilih menu "Scan QR" atau "QRIS"</li>
                    <li>Scan QR di atas, masukkan nominal yang sesuai</li>
                    <li>Konfirmasi pembayaran</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-4 bg-white/5 rounded-xl text-sm">
                <p className="font-semibold text-white mb-2">Rekening Tujuan</p>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bank</span>
                  <span className="text-white font-medium">BCA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">No. Rekening</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono font-medium">1234567890</span>
                    <button onClick={() => { navigator.clipboard.writeText("1234567890"); toast.success("Disalin!"); }}>
                      <Copy className="w-3.5 h-3.5 text-brand-400" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">A/N</span>
                  <span className="text-white font-medium">Malzz Nokos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Nominal</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-bold">{formatCurrency(parseInt(amount))}</span>
                    <button onClick={() => { navigator.clipboard.writeText(amount); toast.success("Disalin!"); }}>
                      <Copy className="w-3.5 h-3.5 text-brand-400" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-amber-400">Transfer nominal TEPAT sesuai di atas untuk mempercepat verifikasi.</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setStep("form")}>
                <X className="w-4 h-4" />
                Batal
              </Button>
              <Button fullWidth onClick={confirmDeposit}>
                <CheckCircle className="w-4 h-4" />
                Sudah Bayar
              </Button>
            </div>
          </motion.div>
        )}

        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="font-semibold text-white mb-4">Riwayat Deposit</h2>
            <div className="space-y-3">
              {history.slice(0, 10).map((dep) => (
                <div key={dep.id} className="flex items-center justify-between p-4 glass rounded-xl">
                  <div>
                    <p className="text-white font-semibold">{formatCurrency(dep.amount)}</p>
                    <p className="text-xs text-slate-400 uppercase">{dep.method} • {formatDate(dep.createdAt)}</p>
                  </div>
                  <Badge
                    variant={dep.status === "confirmed" ? "success" : dep.status === "rejected" ? "danger" : "warning"}
                  >
                    {getStatusLabel(dep.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
