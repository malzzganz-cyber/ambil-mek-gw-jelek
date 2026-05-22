"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Wallet, Shield, LogOut, Camera, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { logout, resetPassword } from "@/firebase/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "@/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { formatCurrency, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(user?.displayName ?? "");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleUpdateName = async () => {
    if (!name.trim() || !auth.currentUser || !user) return;
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      await updateDoc(doc(db, "users", user.uid), { displayName: name });
      toast.success("Nama berhasil diperbarui");
      setEditName(false);
    } catch {
      toast.error("Gagal memperbarui nama");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    setResetLoading(true);
    try {
      await resetPassword(user.email);
      toast.success(`Link reset password dikirim ke ${user.email}`);
    } catch {
      toast.error("Gagal mengirim email reset");
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    toast.success("Berhasil logout");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Profil</h1>
          <p className="text-slate-400 text-sm">Kelola akun dan pengaturan kamu</p>
        </div>

        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-brand-400" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">{user.displayName}</p>
                <p className="text-slate-400 text-sm">{user.email}</p>
                {user.isAdmin && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full mt-1">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-5 h-5 text-green-400" />
                <h2 className="font-semibold text-white">Saldo</h2>
              </div>
              <p className="text-3xl font-bold text-green-400">{formatCurrency(user.balance)}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => router.push("/deposit")}
              >
                Top Up Saldo
              </Button>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-brand-400" />
                <h2 className="font-semibold text-white">Informasi Akun</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1.5">Nama</p>
                  {editName ? (
                    <div className="flex gap-2">
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" loading={loading} onClick={handleUpdateName}>
                        Simpan
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditName(false)}>
                        Batal
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-white">{user.displayName}</span>
                      <button
                        onClick={() => setEditName(true)}
                        className="text-xs text-brand-400 hover:text-brand-300"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1.5">Email</p>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-white">{user.email}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1.5">Terdaftar</p>
                  <div className="p-3 bg-white/5 rounded-xl text-white text-sm">
                    {user.createdAt ? formatDate(user.createdAt) : "-"}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-5 h-5 text-amber-400" />
                <h2 className="font-semibold text-white">Keamanan</h2>
              </div>
              <Button
                variant="secondary"
                size="sm"
                loading={resetLoading}
                onClick={handleResetPassword}
              >
                Kirim Link Reset Password
              </Button>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Button variant="danger" fullWidth onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
