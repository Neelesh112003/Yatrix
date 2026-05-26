
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//  Helper to get JWT token from localStorage 

const getToken = (): string | null => {
  if (typeof window === "undefined") return null; // Guard for SSR
  return localStorage.getItem("token");
};

// Core fetch wrapper 
const request = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<unknown> => {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as object) || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ─── Auth API calls ───────────────────────────────────────────────────────────
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request("/auth/me"),
};

// Destination API 
export const destinationAPI = {
  // Get all 4 cities for home/dashboard page
  getAll: () => request("/destinations"),
 
  // Get one city with sub-destinations + trains + hotels + transport
  getByCity: (city: string) => request(`/destinations/${city}`),
 
  // Filtered calls (used on recommendation page Day 3)
  getHotels: (city: string, maxPrice?: number, tripType?: string) => {
    let query = "";
    if (maxPrice) query += `?maxPrice=${maxPrice}`;
    if (tripType) query += `${query ? "&" : "?"}tripType=${tripType}`;
    return request(`/destinations/${city}/hotels${query}`);
  },
  getTrains: (city: string, fromCity?: string) => {
  const query = fromCity ? `?from=${fromCity}` : "";
  return request(`/destinations/${city}/trains${query}`);
},
  getTransport: (city: string) => request(`/destinations/${city}/transport`),
};

// Trip API 

export const tripAPI = {
  // Create new trip + triggers AI itinerary generation
  create: (tripData: object) =>
    request("/trips", { method: "POST", body: JSON.stringify(tripData) }),
 
  // Get all trips for logged-in user
  getAll: () => request("/trips"),
 
  // Get single trip by ID
  getById: (id: string) => request(`/trips/${id}`),
 
  // Save user-edited itinerary
  updateItinerary: (id: string, itinerary: object[]) =>
    request(`/trips/${id}/itinerary`, { method: "PUT", body: JSON.stringify({ itinerary }) }),
 
  // Regenerate AI itinerary for existing trip
  regenerate: (id: string) =>
    request(`/trips/${id}/regenerate`, { method: "POST" }),
 
  // Delete a trip
  delete: (id: string) =>
    request(`/trips/${id}`, { method: "DELETE" }),
};

// ─── Booking API ──────────────────────────────────────────────────────────────
export const bookingAPI = {
  confirm: (tripId: string) =>
    request("/bookings/confirm", { method: "POST", body: JSON.stringify({ tripId }) }),
  getByTrip: (tripId: string) => request(`/bookings/${tripId}`),
  resendEmail: (tripId: string) =>
    request(`/bookings/${tripId}/resend-email`, { method: "POST" }),
};

export default request;