const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─────────────────────────────────────────────────────────────
// Helper to get JWT token from localStorage
// ─────────────────────────────────────────────────────────────
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// ─────────────────────────────────────────────────────────────
// Core fetch wrapper (FIXED & PRODUCTION READY)
// ─────────────────────────────────────────────────────────────
const request = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as HeadersInit),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // 🔥 IMPORTANT FIX
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data as T;
  } catch (error: any) {
    // 🔥 This makes debugging MUCH easier
    console.error("API Error:", error.message);
    throw new Error(error.message || "Network error (Failed to fetch)");
  }
};

// ─────────────────────────────────────────────────────────────
// Auth API calls
// ─────────────────────────────────────────────────────────────
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request<any>("/auth/me"),
};

// ─────────────────────────────────────────────────────────────
// Destination API
// ─────────────────────────────────────────────────────────────
export const destinationAPI = {
  getAll: () => request<any>("/destinations"),

  getByCity: (city: string) =>
    request<any>(`/destinations/${city}`),

  getHotels: (city: string, maxPrice?: number, tripType?: string) => {
    let query = "";
    if (maxPrice) query += `?maxPrice=${maxPrice}`;
    if (tripType) query += `${query ? "&" : "?"}tripType=${tripType}`;

    return request<any>(`/destinations/${city}/hotels${query}`);
  },

  getTrains: (city: string, fromCity?: string) => {
    const query = fromCity ? `?from=${fromCity}` : "";
    return request<any>(`/destinations/${city}/trains${query}`);
  },

  getTransport: (city: string) =>
    request<any>(`/destinations/${city}/transport`),
};

// ─────────────────────────────────────────────────────────────
// Trip API
// ─────────────────────────────────────────────────────────────
export const tripAPI = {
  create: (tripData: object) =>
    request<any>("/trips", {
      method: "POST",
      body: JSON.stringify(tripData),
    }),

  getAll: () => request<any>("/trips"),

  getById: (id: string) =>
    request<any>(`/trips/${id}`),

  updateItinerary: (id: string, itinerary: object[]) =>
    request<any>(`/trips/${id}/itinerary`, {
      method: "PUT",
      body: JSON.stringify({ itinerary }),
    }),

  regenerate: (id: string) =>
    request<any>(`/trips/${id}/regenerate`, {
      method: "POST",
    }),

  delete: (id: string) =>
    request<any>(`/trips/${id}`, {
      method: "DELETE",
    }),
};

// ─────────────────────────────────────────────────────────────
// Booking API
// ─────────────────────────────────────────────────────────────
export const bookingAPI = {
  confirm: (tripId: string) =>
    request<any>("/bookings/confirm", {
      method: "POST",
      body: JSON.stringify({ tripId }),
    }),

  getByTrip: (tripId: string) =>
    request<any>(`/bookings/${tripId}`),

  resendEmail: (tripId: string) =>
    request<any>(`/bookings/${tripId}/resend-email`, {
      method: "POST",
    }),
};

export default request;