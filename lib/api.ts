const BASE = process.env.RUMAHOTP_BASE_URL ?? "https://rumahotp.com/api";
const API_KEY = process.env.RUMAHOTP_API_KEY ?? "";

async function rumahFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      ...options?.headers
    },
    next: { revalidate: 0 }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RumahOTP error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function getRumahBalance() {
  return rumahFetch<{ balance: number; currency: string }>("/balance");
}

export async function getRumahServices(countryCode?: string) {
  const query = countryCode ? `?country=${countryCode}` : "";
  return rumahFetch<{ services: Array<{ id: string; name: string; price: number; count: number }> }>(
    `/services${query}`
  );
}

export async function getRumahCountries() {
  return rumahFetch<{ countries: Array<{ code: string; name: string; flag?: string }> }>("/countries");
}

export async function getRumahOperators(countryCode: string) {
  return rumahFetch<{ operators: Array<{ id: string; name: string }> }>(
    `/operators?country=${countryCode}`
  );
}

export async function buyRumahNumber(serviceId: string, countryCode: string = "id") {
  return rumahFetch<{
    id: string;
    number: string;
    service: string;
    country: string;
    expires: string;
    price: number;
  }>("/orders", {
    method: "POST",
    body: JSON.stringify({ service: serviceId, country: countryCode })
  });
}

export async function getRumahSms(orderId: string) {
  return rumahFetch<{
    status: string;
    sms?: { text: string; code: string; from: string; receivedAt: string };
  }>(`/orders/${orderId}`);
}

export async function cancelRumahOrder(orderId: string) {
  return rumahFetch<{ success: boolean }>(`/orders/${orderId}`, {
    method: "DELETE"
  });
}
