import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

export function formatPhone(number: string): string {
  if (!number) return "-";
  const cleaned = number.replace(/\D/g, "");
  if (cleaned.length > 10) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)}-${cleaned.slice(5, 9)}-${cleaned.slice(9)}`;
  }
  return number;
}

export function applyMarkup(price: number, markupPercent: number): number {
  return Math.ceil(price * (1 + markupPercent / 100));
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10",
    waiting: "text-blue-400 bg-blue-400/10",
    received: "text-green-400 bg-green-400/10",
    cancelled: "text-red-400 bg-red-400/10",
    expired: "text-gray-400 bg-gray-400/10",
    confirmed: "text-green-400 bg-green-400/10",
    rejected: "text-red-400 bg-red-400/10",
    processed: "text-green-400 bg-green-400/10"
  };
  return map[status] ?? "text-gray-400 bg-gray-400/10";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Menunggu",
    waiting: "Menunggu OTP",
    received: "OTP Diterima",
    cancelled: "Dibatalkan",
    expired: "Kadaluarsa",
    confirmed: "Dikonfirmasi",
    rejected: "Ditolak",
    processed: "Diproses"
  };
  return map[status] ?? status;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
