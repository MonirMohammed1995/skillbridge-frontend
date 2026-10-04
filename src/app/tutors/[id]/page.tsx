"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Star, GraduationCap, Calendar, Clock, CheckCircle2, DollarSign } from "lucide-react";

export default function TutorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // বুকিং ফর্ম স্টেট (স্কিমা অনুযায়ী date, startTime, endTime)
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const res = await api.get(`/tutors/${id}`);
        setTutor(res.data.tutor || res.data);
      } catch (err) {
        console.error("Failed to fetch tutor details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTutorDetails();
  }, [id]);

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !startTime || !endTime) {
      alert("Please select date, start time, and end time.");
      return;
    }

    setBookingLoading(true);
    try {
      await api.post("/bookings", {
        tutorId: id,
        date: new Date(bookingDate).toISOString(),
        startTime,
        endTime,
      });
      setSuccessMessage("Session booked successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard/bookings");
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to book session. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading tutor profile..." size="xl" />;
  }

  if (!tutor) {
    return <div className="text-center py-20 text-muted-foreground">Tutor not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Tutor Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border/60 bg-background p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 font-bold text-3xl uppercase">
                {tutor.name?.charAt(0)}
              </div>
              <div className="text-center sm:text-left space-y-2">
                <h1 className="text-2xl font-extrabold text-foreground">{tutor.name}</h1>
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                  {tutor.category?.name || "Professional Tutor"}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-muted-foreground pt-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="size-4 fill-amber-500" />
                    <span>4.9 Rating</span>
                  </div>
                  <div className="flex items-center gap-1 text-foreground font-bold">
                    <DollarSign className="size-3.5 text-indigo-600" />
                    <span>${tutor.hourlyRate || 50} / hour</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border/40 pt-6 space-y-2">
              <h3 className="font-bold text-lg">About Me</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {tutor.bio || "This tutor has not added a bio yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-xl sticky top-24 space-y-6">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Book 1-on-1 Session</h3>
              <p className="text-xs text-muted-foreground mt-1">Choose your preferred date and time range.</p>
            </div>

            {successMessage ? (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="size-5 shrink-0" />
                {successMessage}
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Select Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-10 rounded-xl py-5 border-border/80"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Start Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                      <Input
                        type="time"
                        className="pl-10 rounded-xl py-5 border-border/80 text-xs"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      End Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                      <Input
                        type="time"
                        className="pl-10 rounded-xl py-5 border-border/80 text-xs"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-4 font-medium">
                    <span className="text-muted-foreground">Total Fee:</span>
                    <span className="font-bold text-foreground">${tutor.hourlyRate || 50}.00</span>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={bookingLoading}
                    className="w-full rounded-xl py-6 font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    {bookingLoading ? "Confirming..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}