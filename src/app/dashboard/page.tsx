"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Calendar, CheckCircle, BookOpen, Clock } from "lucide-react";

export default function StudentDashboard() {
  const { data: session, isPending } = useSession();
  const user = session?.user as any;

  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchStudentBookings = async () => {
      try {
        const res = await api.get("/bookings");
        // নিশ্চিত করা হলো যেন ডাটা সবসময় অ্যারে হিসেবে সেট হয়
        const data = res.data.bookings || res.data;
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch dashboard bookings:", err);
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchStudentBookings();
  }, []);

  if (isPending || loadingBookings) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." size="xl" />;
  }

  // সেফটি চেক সহ ফিল্টার করা
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const upcomingCount = safeBookings.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED").length;
  const completedCount = safeBookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name || "Student"}! 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Here is the summary of your learning activities and upcoming sessions.</p>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <Calendar className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Upcoming Sessions</p>
            <h3 className="text-2xl font-bold">{upcomingCount}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Completed Sessions</p>
            <h3 className="text-2xl font-bold">{completedCount}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
            <BookOpen className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Total Bookings</p>
            <h3 className="text-2xl font-bold">{safeBookings.length}</h3>
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Your Recent Bookings</h2>
        {safeBookings.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm border border-dashed rounded-xl border-border/60">
            No bookings found yet. Explore tutors and book your first session!
          </div>
        ) : (
          <div className="space-y-3">
            {safeBookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/20">
                <div className="flex items-center gap-3">
                  <Clock className="size-5 text-indigo-600" />
                  <div>
                    <p className="font-semibold text-sm">
                      {booking.tutor?.name || `Tutor ID: ${booking.tutorId}`}
                    </p>
                    <p className="text-xs text-muted-foreground">Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  {booking.status || "PENDING"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}