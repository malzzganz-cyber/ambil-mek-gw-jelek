"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Search, Filter, Loader2 } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import OrderCard from "@/components/cards/OrderCard";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, formatCurrency, getStatusLabel } from "@/lib/utils";
import {
  collection, query, where, orderBy, onSnapshot
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type { Order } from "@/types";

const FILTERS = [
  { label: "Semua", value: "all" },
  { label: "Menunggu", value: "waiting" },
  { label: "Diterima", value: "received" },
  { label: "Dibatalkan", value: "cancelled" }
];

export default function HistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    });
    return () => unsub();
  }, [user?.uid]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      o.number?.includes(search) ||
      o.otp?.includes(search);
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Riwayat Order</h1>
          <p className="text-slate-400 text-sm">Semua transaksi nomor virtual kamu</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Cari layanan, nomor, atau OTP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              prefix={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === value
                    ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                    : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <History className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Tidak ada order</p>
            <p className="text-sm mt-1">
              {search || filter !== "all" ? "Coba ubah filter atau kata kunci" : "Mulai beli nomor virtual sekarang"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
            <p className="text-center text-xs text-slate-500 pt-4">
              {filtered.length} order ditampilkan
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
