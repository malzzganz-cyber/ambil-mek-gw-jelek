import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://malzznokos.vercel.app";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/deposit`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/order`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/history`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/profile`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 }
  ];
}
