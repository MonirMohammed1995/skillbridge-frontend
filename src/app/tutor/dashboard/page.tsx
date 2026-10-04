"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function TutorDashboardPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchTutorSessions = async () => {
    try {
      // প্রথমে প্রধান এন্ডপয়েন্টে রিকোয়েস্ট পাঠানো
      const res = await api.get("/tutor/sessions");
      const data = res.data.sessions || res.data;
      setSessions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.warn("Primary endpoint failed, trying fallback...", err);
      try {
        // ফলব্যাক এন্ডপয়েন্ট (যদি /api প্রিফিক্স প্রয়োজন হয়)
        const fallbackRes = await api.get("/api/tutor/sessions");
        const fallbackData = fallbackRes.data.sessions || fallbackRes.data;
        setSessions(Array.isArray(fallbackData) ? fallbackData : []);
      } catch (innerErr) {
        console.error("All session endpoints failed:", innerErr);
        setSessions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorSessions();
  }, []);

  const handleUpdateStatus = async (sessionId: string, status: string) => {
    setActionLoading(sessionId);
    try {
      await api.patch(`/tutor/sessions/${sessionId}`, { status });
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status } : s))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update session status.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading tutor dashboard..." size="xl" />;
  }

  const safeSessions = Array.isArray(sessions) ? sessions : [];

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Tutor Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage student booking requests and upcoming 1-on-1 sessions.</p>
      </div>

      {safeSessions.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-2xl border-border/60 text-muted-foreground text-sm">
          No student session requests found yet.
        </div>
      ) : (
        <div className="space-y-4">
          {safeSessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold">
                  <Calendar className="size-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground">
                    Student: {session.student?.name || session.studentName || "Anonymous Student"}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> Requested on: {new Date(session.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  {session.status || "PENDING"}
                </span>

                {session.status === "PENDING" && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                      onClick={() => handleUpdateStatus(session.id, "CONFIRMED")}
                      disabled={actionLoading === session.id}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleUpdateStatus(session.id, "CANCELLED")}
                      disabled={actionLoading === session.id}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}