import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export interface AppSettings {
  markup: number;
  serviceMarkups: Record<string, number>;
  minDeposit: number;
  maxDeposit: number;
  qrisCode?: string;
  qrisNote?: string;
  transferNote?: string;
  isMaintenanceMode: boolean;
  announcement?: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  markup: parseInt(process.env.DEFAULT_MARKUP ?? "10"),
  serviceMarkups: {},
  minDeposit: 10000,
  maxDeposit: 5000000,
  isMaintenanceMode: false
};

export async function getSettings(): Promise<AppSettings> {
  try {
    const snap = await getDoc(doc(db, "settings", "app"));
    if (snap.exists()) {
      return { ...DEFAULT_SETTINGS, ...snap.data() } as AppSettings;
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(settings: Partial<AppSettings>): Promise<void> {
  await setDoc(doc(db, "settings", "app"), settings, { merge: true });
}

export function getMarkupForService(
  settings: AppSettings,
  serviceId: string
): number {
  return settings.serviceMarkups[serviceId] ?? settings.markup;
}
