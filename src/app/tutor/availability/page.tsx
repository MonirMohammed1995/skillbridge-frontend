"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Plus, CheckCircle2, Calendar } from "lucide-react";
import { api } from "@/lib/api";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function TutorAvailabilityPage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // সুন্দর ফরম্যাটে টাইম স্লট তৈরি করা (ഉദാ: Monday: 10:00 AM - 12:00 PM)
    const formattedSlot = `${selectedDay}: ${startTime} - ${endTime}`;

    try {
      // প্রথমে প্রাইমারি এন্ডপয়েন্টে রিকোয়েস্ট পাঠানো
      await api.post("/tutor/availability", { timeSlot: formattedSlot });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.warn("Primary endpoint failed, trying fallback...", err);
      try {
        // ফলব্যাক এন্ডপয়েন্ট (যদি /api প্রিফিক্স প্রয়োজন হয়)
        await api.post("/api/tutor/availability", { timeSlot: formattedSlot });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (innerErr: any) {
        alert(innerErr.response?.data?.message || "Failed to add availability slot.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1">Manage Availability</h1>
        <p className="text-sm text-muted-foreground">Select your available days and time ranges so students can book sessions seamlessly.</p>
      </div>

      <form onSubmit={handleAddSlot} className="rounded-3xl border border-border/60 bg-background p-8 shadow-sm space-y-6">
        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="size-4" /> Time slot added successfully!
          </div>
        )}

        {/* Day Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Select Day
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-3.5 size-4 text-muted-foreground pointer-events-none" />
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-background py-3 pl-10 pr-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Range Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Start Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3.5 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="pl-10 rounded-xl py-5 border-border/80"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              End Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3.5 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="pl-10 rounded-xl py-5 border-border/80"
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full rounded-xl py-6 font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/25 transition-all"
        >
          <Plus className="mr-2 size-4" /> {loading ? "Adding Slot..." : "Add Availability Slot"}
        </Button>
      </form>
    </div>
  );
}