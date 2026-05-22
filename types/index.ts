export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  balance: number;
  isAdmin: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceWithMarkup?: number;
  available: number;
  image?: string;
  category?: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  flag?: string;
}

export interface Operator {
  id: string;
  name: string;
  countryCode: string;
}

export interface Order {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  number: string;
  countryCode: string;
  status: "pending" | "waiting" | "received" | "cancelled" | "expired";
  price: number;
  otp?: string;
  createdAt: string;
  expiredAt?: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  amount: number;
  method: "qris" | "transfer";
  status: "pending" | "confirmed" | "rejected";
  proofUrl?: string;
  qrisCode?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  method: string;
  accountNumber: string;
  accountName: string;
  status: "pending" | "processed" | "rejected";
  createdAt: string;
  processedAt?: string;
}

export interface MarkupSettings {
  default: number;
  services: Record<string, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RumahOTPBalance {
  balance: number;
}

export interface RumahOTPNumber {
  id: string;
  number: string;
  service: string;
  country: string;
  expires: string;
}

export interface RumahOTPSms {
  id: string;
  text: string;
  code: string;
  from: string;
  receivedAt: string;
}
