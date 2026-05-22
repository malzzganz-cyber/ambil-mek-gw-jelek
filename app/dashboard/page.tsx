"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet, ShoppingCart, History, TrendingUp,
  ArrowRight, Zap, RefreshCw, Clock
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import type { Order, DepositRequest } from "@/types";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentDeposits, setRecentDeposits] = useState<DepositRequest[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const ordersQ = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const unsubOrders = onSnapshot(ordersQ, (snap) => {
      setRecentOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
    });

    const depositsQ = query(
      collection(db, "deposits"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(3)
    );
    const unsubDeposits = onSnapshot(depositsQ, (snap) => {
      setRecentDeposits(snap.docs.map((d) => ({ id: d.id, ...d.data() } as DepositRequest)));
    });

    return () => { unsubOrders(); unsubDeposits(); };
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center animate-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <p className="text-slate-400 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  const STATS = [
    {
      label: "Saldo",
      value: formatCurrency(user?.balance ?? 0),
      icon: Wallet,
      color: "text-green-400",
      bg: "bg-green-500/10",
      href: "/deposit"
    },
    {
      label: "Total Order",
      value: recentOrders.length.toString(),
      icon: ShoppingCart,
      color: "text-brand-400",
      bg: "bg-brand-500/10",
      href: "/history"
    },
    {
      label: "OTP Diterima",
      value: recentOrders.filter((o) => o.status === "received").length.toString(),
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      href: "/history"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Halo, {user?.displayName?.split(" ")[0] ?? "Kamu"} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Selamat datang di Malzz Nokos</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {STATS.map(({ label, value, icon: Icon, color, bg, href }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={href}>
                <Card hover className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/order"
            className="lg:col-span-2 glass rounded-2xl p-6 flex items-center justify-between glass-hover group"
          >
            <div>
              <p className="text-xs text-slate-400 mb-1">Butuh nomor sekarang?</p>
              <h2 className="text-xl font-bold text-white">Beli Nomor Virtual</h2>
              <p className="text-sm text-slate-400 mt-1">
                100+ layanan tersedia, OTP realtime, harga mulai Rp 500
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center group-hover:bg-brand-500/25 transition-colors ml-4">
              <ArrowRight className="w-6 h-6 text-brand-400" />
            </div>
          </Link>
          <Link
            href="/deposit"
            className="glass rounded-2xl p-6 flex items-center justify-between glass-hover group"
          >
            <div>
              <p className="text-xs text-slate-400 mb-1">Saldo habis?</p>
              <h2 className="text-lg font-bold text-white">Top Up Saldo</h2>
              <p className="text-sm text-slate-400 mt-1">Bayar via QRIS mudah & cepat</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors ml-4">
              <Wallet className="w-6 h-6 text-green-400" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-brand-400" />
                Order Terbaru
              </h2>
              <Link href="/history" className="text-xs text-brand-400 hover:text-brand-300">
                Lihat semua
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Belum ada order</p>
                <Link href="/order" className="text-xs text-brand-400 hover:underline mt-1 block">
                  Beli nomor sekarang
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{order.serviceName}</p>
                      <p className="text-xs text-slate-400">{order.number}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          order.status === "received"
                            ? "success"
                            : order.status === "waiting"
                            ? "info"
                            : order.status === "cancelled"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-green-400" />
                Deposit Terbaru
              </h2>
            </div>
            {recentDeposits.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Wallet className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Belum ada deposit</p>
                <Link href="/deposit" className="text-xs text-brand-400 hover:underline mt-1 block">
                  Top up sekarang
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDeposits.map((dep) => (
                  <div
                    key={dep.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {formatCurrency(dep.amount)}
                      </p>
                      <p className="text-xs text-slate-400 uppercase">{dep.method}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          dep.status === "confirmed"
                            ? "success"
                            : dep.status === "rejected"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {getStatusLabel(dep.status)}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(dep.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
