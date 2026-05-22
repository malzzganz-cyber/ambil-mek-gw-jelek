"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCw, X, Clock, CheckCircle, XCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatDate, formatPhone, getStatusLabel } from "@/lib/utils";
import type { Order } from "@/types";
import toast from "react-hot-toast";

interface OrderCardProps {
  order: Order;
  onCancel?: (id: string) => void;
}

export default function OrderCard({ order, onCancel }: OrderCardProps) {
  const [otp, setOtp] = useState(order.otp ?? null);
  const [polling, setPolling] = useState(!order.otp && order.status === "waiting");
  const [status, setStatus] = useState(order.status);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin!");
  };

  const pollOTP = useCallback(async () => {
    try {
      const res = await fetch(`/api/otp?orderId=${order.id}`);
      const json = await res.json();
      if (json.success && json.data.otp) {
        setOtp(json.data.otp);
        setStatus("received");
        setPolling(false);
        toast.success("OTP diterima!");
      } else if (json.data?.status === "cancelled" || json.data?.status === "expired") {
        setStatus(json.data.status);
        setPolling(false);
      }
    } catch {}
  }, [order.id]);

  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(pollOTP, 5000);
    return () => clearInterval(interval);
  }, [polling, pollOTP]);

  const badgeVariant =
    status === "received"
      ? "success"
      : status === "waiting"
      ? "info"
      : status === "cancelled" || status === "expired"
      ? "danger"
      : "warning";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 space-y-3"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white font-semibold">{order.serviceName}</p>
          <p className="text-sm text-slate-400 mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <Badge variant={badgeVariant}>{getStatusLabel(status)}</Badge>
      </div>

      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
        <div>
          <p className="text-xs text-slate-400">Nomor</p>
          <p className="text-white font-mono font-medium">{formatPhone(order.number)}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(order.number)}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      {otp ? (
        <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div>
            <p className="text-xs text-green-400">Kode OTP</p>
            <p className="text-2xl font-bold font-mono tracking-widest text-green-400">{otp}</p>
          </div>
          <Button
            variant="success"
            size="sm"
            onClick={() => copyToClipboard(otp)}
          >
            <Copy className="w-4 h-4" />
            Salin
          </Button>
        </div>
      ) : status === "waiting" ? (
        <div className="flex items-center gap-3 p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl">
          <RefreshCw className="w-4 h-4 text-brand-400 animate-spin" />
          <p className="text-sm text-brand-400">Menunggu OTP masuk...</p>
        </div>
      ) : null}

      {(status === "waiting" || status === "pending") && onCancel && (
        <Button
          variant="danger"
          size="sm"
          onClick={() => onCancel(order.id)}
          className="w-full"
        >
          <X className="w-4 h-4" />
          Batalkan Order
        </Button>
      )}
    </motion.div>
  );
}
