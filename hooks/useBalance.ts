"use client";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/firebase/config";

export function useBalance() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const deductBalance = useCallback(
    async (amount: number): Promise<boolean> => {
      if (!user) return false;
      if (user.balance < amount) {
        toast.error("Saldo tidak cukup");
        return false;
      }
      setLoading(true);
      try {
        await updateDoc(doc(db, "users", user.uid), {
          balance: increment(-amount)
        });
        return true;
      } catch {
        toast.error("Gagal memotong saldo");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const addBalance = useCallback(
    async (uid: string, amount: number): Promise<boolean> => {
      setLoading(true);
      try {
        await updateDoc(doc(db, "users", uid), {
          balance: increment(amount)
        });
        return true;
      } catch {
        toast.error("Gagal menambah saldo");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { deductBalance, addBalance, loading };
}
