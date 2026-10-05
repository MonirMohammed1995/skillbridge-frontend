"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Calendar } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/admin/bookings").catch(() => api.get("/bookings"));
        const data = res.data.bookings || res.data;
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading bookings..." size="xl" />;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">All Platform Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor all mentoring sessions and bookings across the platform.</p>
      </div>

      <div className="space-y-3">
        {bookings.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-2xl border-border/60 text-muted-foreground text-sm">No bookings found.</div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="p-4 rounded-2xl border border-border/60 bg-background shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Student: {booking.student?.name || booking.studentId}</p>
                  <p className="text-xs text-muted-foreground">Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50">
                {booking.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}