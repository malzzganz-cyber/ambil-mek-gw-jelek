import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Shield, Clock, Smartphone, ArrowRight, Check, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Malzz Nokos — Jasa Nomor Virtual OTP Murah Tercepat di Indonesia",
  description:
    "Beli nomor virtual untuk OTP WhatsApp, Telegram, Instagram, dan 100+ aplikasi lainnya. Proses otomatis, bayar QRIS, harga mulai Rp 500."
};

const FEATURES = [
  {
    icon: Zap,
    title: "OTP Realtime",
    desc: "Kode OTP langsung masuk dalam hitungan detik. Tidak perlu menunggu lama."
  },
  {
    icon: Shield,
    title: "Aman & Terpercaya",
    desc: "Sistem kami memastikan privasi kamu terjaga. Nomor tidak bisa dilacak ke identitasmu."
  },
  {
    icon: Clock,
    title: "24/7 Tersedia",
    desc: "Layanan aktif sepanjang waktu. Order kapanpun kamu butuh, tanpa gangguan."
  },
  {
    icon: Smartphone,
    title: "100+ Layanan",
    desc: "WhatsApp, Telegram, Gojek, Shopee, TikTok, dan ratusan aplikasi lainnya tersedia."
  }
];

const SERVICES = [
  { name: "WhatsApp", icon: "💬", price: "Rp 1.500" },
  { name: "Telegram", icon: "✈️", price: "Rp 800" },
  { name: "Instagram", icon: "📸", price: "Rp 2.000" },
  { name: "Gojek", icon: "🟢", price: "Rp 1.200" },
  { name: "Shopee", icon: "🛒", price: "Rp 1.000" },
  { name: "TikTok", icon: "🎵", price: "Rp 900" },
  { name: "Line", icon: "💚", price: "Rp 750" },
  { name: "Grab", icon: "🚗", price: "Rp 1.100" }
];

const REVIEWS = [
  { name: "Agus S.", rating: 5, text: "Cepat banget! OTP langsung masuk, tidak sampai 10 detik. Recommended!" },
  { name: "Rina M.", rating: 5, text: "Sudah pakai berkali-kali, selalu berhasil. Harga murah, kualitas bagus." },
  { name: "Budi P.", rating: 5, text: "QRIS nya praktis, langsung top up dan langsung bisa order. Top!" }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-dark-900 overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">
              Malzz<span className="gradient-text">Nokos</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-brand-900/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-400 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            OTP Otomatis & Realtime
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Nomor Virtual OTP{" "}
            <span className="gradient-text">Paling Murah</span>
            <br />
            di Indonesia
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Beli nomor virtual untuk verifikasi OTP semua aplikasi. Proses otomatis,
            bayar via QRIS, harga mulai{" "}
            <span className="text-white font-semibold">Rp 500</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl text-base transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 active:scale-95"
            >
              Mulai Sekarang — Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl text-base border border-white/10 transition-all"
            >
              Sudah Punya Akun?
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
            {["Tanpa Kartu Kredit", "Bayar QRIS", "Support 24/7"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Kenapa Pilih <span className="gradient-text">Malzz Nokos</span>?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Platform nokos terpercaya dengan sistem otomatis, harga transparan, dan respons instan.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass rounded-2xl p-6 space-y-3 glass-hover">
                <div className="w-11 h-11 rounded-xl bg-brand-500/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-dark-800/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Layanan Populer</h2>
            <p className="text-slate-400">Tersedia 100+ layanan dari berbagai platform</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SERVICES.map(({ name, icon, price }) => (
              <div
                key={name}
                className="glass rounded-xl p-4 text-center glass-hover space-y-2"
              >
                <span className="text-3xl">{icon}</span>
                <p className="font-semibold text-white text-sm">{name}</p>
                <p className="text-xs text-green-400 font-medium">Mulai {price}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all text-sm font-medium"
            >
              Lihat Semua Layanan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Kata Mereka</h2>
            <p className="text-slate-400">Ribuan pengguna sudah mempercayai Malzz Nokos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {REVIEWS.map(({ name, rating, text }) => (
              <div key={name} className="glass rounded-2xl p-5 space-y-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">"{text}"</p>
                <p className="text-xs font-medium text-slate-400">— {name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-brand-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Siap Mulai Nokos?
            </h2>
            <p className="text-slate-400 mb-8">
              Daftar sekarang, top up saldo via QRIS, dan langsung beli nomor virtual.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-brand-500/30"
            >
              Daftar Sekarang — Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-white/5 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Malzz Nokos. Semua hak dilindungi.
        </p>
      </footer>
    </main>
  );
}
