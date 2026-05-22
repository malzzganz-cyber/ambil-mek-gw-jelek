"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Globe, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/modals/Modal";
import OrderCard from "@/components/cards/OrderCard";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { useBalance } from "@/hooks/useBalance";
import { formatCurrency } from "@/lib/utils";
import {
  collection, addDoc, serverTimestamp, doc,
  updateDoc, increment, query, where, orderBy, onSnapshot
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type { Order } from "@/types";
import toast from "react-hot-toast";

interface Service {
  id: string;
  name: string;
  price: number;
  priceWithMarkup: number;
  count: number;
}

export default function OrderPage() {
  const { user } = useAuth();
  const { deductBalance } = useBalance();

  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [ordering, setOrdering] = useState(false);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      where("status", "in", ["pending", "waiting"]),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setActiveOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
    });
    return () => unsub();
  }, [user?.uid]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services?country=id");
      const json = await res.json();
      if (json.success) setServices(json.data);
    } catch {
      toast.error("Gagal memuat layanan");
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!selectedService || !user) return;
    const price = selectedService.priceWithMarkup;

    if (user.balance < price) {
      toast.error("Saldo tidak cukup. Silakan top up terlebih dahulu.");
      setSelectedService(null);
      return;
    }

    setOrdering(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          countryCode: "id",
          userId: user.uid,
          price: selectedService.price
        })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      await deductBalance(price);

      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        number: json.data.number,
        countryCode: "id",
        status: "waiting",
        price,
        rumahOrderId: json.data.orderId,
        createdAt: serverTimestamp()
      });

      toast.success(`Nomor berhasil dibeli: ${json.data.number}`);
      setSelectedService(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal membuat order";
      toast.error(msg);
    } finally {
      setOrdering(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      const order = activeOrders.find((o) => o.id === orderId);
      if (!order) return;

      await fetch(`/api/orders?id=${orderId}`, { method: "DELETE" });
      await updateDoc(doc(db, "orders", orderId), { status: "cancelled" });
      await updateDoc(doc(db, "users", user!.uid), { balance: increment(order.price) });

      toast.success("Order dibatalkan, saldo dikembalikan");
    } catch {
      toast.error("Gagal membatalkan order");
    }
  };

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Beli Nomor Virtual</h1>
          <p className="text-slate-400 text-sm">
            Pilih layanan, bayar otomatis dari saldo, nomor langsung aktif
          </p>
        </div>

        {activeOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
              Order Aktif
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} onCancel={handleCancel} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <Input
            placeholder="Cari layanan... (WhatsApp, Telegram, dll)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<Search className="w-4 h-4" />}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
              <p className="text-slate-400 text-sm">Memuat layanan...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Layanan tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((service, i) => (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedService(service)}
                className="glass rounded-xl p-4 text-left glass-hover space-y-2 group"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                    {service.name}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-green-400">
                    {formatCurrency(service.priceWithMarkup)}
                  </p>
                  <Badge variant="info" className="text-xs">
                    {service.count > 0 ? `${service.count}` : "Ada"}
                  </Badge>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </main>

      <Modal
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
        title="Konfirmasi Order"
      >
        {selectedService && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Layanan</span>
                <span className="text-white font-medium">{selectedService.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Harga</span>
                <span className="text-green-400 font-bold">
                  {formatCurrency(selectedService.priceWithMarkup)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Saldo kamu</span>
                <span className={user && user.balance >= selectedService.priceWithMarkup ? "text-white" : "text-red-400"}>
                  {formatCurrency(user?.balance ?? 0)}
                </span>
              </div>
            </div>

            {user && user.balance < selectedService.priceWithMarkup && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>Saldo tidak cukup. Top up dulu ya!</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setSelectedService(null)}
                disabled={ordering}
              >
                Batal
              </Button>
              <Button
                fullWidth
                loading={ordering}
                onClick={handleOrder}
                disabled={!user || user.balance < selectedService.priceWithMarkup}
              >
                <ShoppingCart className="w-4 h-4" />
                Beli Sekarang
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
