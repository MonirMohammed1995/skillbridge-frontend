import axios from "axios";

export const api = axios.create({
  // যদি লোকালহস্টে প্রক্সি ব্যবহার করতে চান, তবে baseURL-এ "/api/backend" দিতে পারেন,
  // অথবা সরাসরি ব্যাকএন্ডের ফুল ইউআরএল (http://localhost:4000) রাখতে পারেন যদি CORS properly configured থাকে।
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
});