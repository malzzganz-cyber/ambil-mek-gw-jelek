import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Malzz Nokos — Jasa Nomor Virtual OTP Murah",
    template: "%s | Malzz Nokos"
  },
  description:
    "Platform nomor virtual OTP otomatis dengan QRIS dan OTP realtime tercepat di Indonesia. Nokos murah, cepat, dan terpercaya.",
  keywords: [
    "nokos murah",
    "nokos whatsapp",
    "nomor virtual indonesia",
    "otp murah",
    "virtual number indonesia",
    "rumahotp",
    "nokos realtime",
    "beli nomor virtual",
    "sewa nomor hp"
  ],
  authors: [{ name: "Malzz" }],
  creator: "Malzz",
  publisher: "Malzz Nokos",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://malzznokos.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://malzznokos.vercel.app",
    siteName: "Malzz Nokos",
    title: "Malzz Nokos — Jasa Nomor Virtual OTP Murah",
    description:
      "Platform nomor virtual OTP otomatis dengan QRIS dan OTP realtime tercepat di Indonesia.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Malzz Nokos"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Malzz Nokos — Jasa Nomor Virtual OTP Murah",
    description:
      "Platform nomor virtual OTP otomatis dengan QRIS dan OTP realtime tercepat di Indonesia.",
    images: ["/og-image.png"]
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-icon-180.png", sizes: "180x180" }]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport: Viewport = {
  themeColor: "#3d48f5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1c27",
              color: "#f8fafc",
              border: "1px solid rgba(255,255,255,0.1)"
            },
            success: { iconTheme: { primary: "#22c55e", secondary: "#0a0b0f" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#0a0b0f" } }
          }}
        />
      </body>
    </html>
  );
}
