"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Trash2 } from "lucide-react";

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      // ব্যাকএন্ডের রেসপন্স ফরম্যাট অনুযায়ী সেফ ডাটা এক্সট্রাকশন
      const data = res.data?.bookings || res.data;
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    setActionLoading(bookingId);
    try {
      await api.delete(`/bookings/${bookingId}`);
      // লোকাল স্টেট থেকে ইনস্ট্যান্ট রিমুভ করা
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="size-3.5" /> Confirmed
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="size-3.5" /> Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
            <XCircle className="size-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="size-3.5" /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your sessions..." size="xl" />;
  }

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">My Booked Sessions</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and manage all your scheduled 1-on-1 learning sessions.</p>
      </div>

      {safeBookings.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-2xl border-border/60 text-muted-foreground text-sm space-y-3">
          <p>No bookings found yet.</p>
          <a href="/tutors">
            <Button variant="outline" size="sm" className="rounded-xl">Explore Tutors Now</Button>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {safeBookings.map((booking) => (
            <div 
              key={booking.id || Math.random()} 
              className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold text-lg">
                  <Calendar className="size-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground">
                    {booking.tutor?.user?.name || booking.tutor?.name || `Tutor ID: ${booking.tutorId}`}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> Booked: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40">
                {getStatusBadge(booking.status)}
                
                {booking.status === "PENDING" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={actionLoading === booking.id}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}