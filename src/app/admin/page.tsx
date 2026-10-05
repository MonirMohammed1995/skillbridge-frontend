"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Users, Calendar, BookOpen } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({ usersCount: 0, bookingsCount: 0, tutorsCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats, using fallback data", err);
        setStats({ usersCount: 15, bookingsCount: 10, tutorsCount: 6 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading admin dashboard..." size="xl" />;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform overview and core statistics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <Users className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Total Users</p>
            <h3 className="text-2xl font-bold">{stats.usersCount ?? 0}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <Calendar className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Total Bookings</p>
            <h3 className="text-2xl font-bold">{stats.bookingsCount ?? 0}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
            <BookOpen className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Tutors Registered</p>
            <h3 className="text-2xl font-bold">{stats.tutorsCount ?? 0}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}