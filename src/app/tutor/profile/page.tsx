"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, CheckCircle2, DollarSign } from "lucide-react";

export default function TutorProfileEditPage() {
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/tutor/profile");
        setBio(res.data.bio || "");
        setHourlyRate(res.data.hourlyRate || "50");
      } catch (err) {
        console.error("Failed to fetch tutor profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    try {
      await api.patch("/tutor/profile", { bio, hourlyRate: Number(hourlyRate) });
      setSuccess(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading profile editor..." size="xl" />;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1">Edit Tutor Profile</h1>
        <p className="text-sm text-muted-foreground">Update your bio and hourly pricing to attract more students.</p>
      </div>

      <form onSubmit={handleUpdateProfile} className="rounded-3xl border border-border/60 bg-background p-8 shadow-sm space-y-5">
        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="size-4" /> Profile updated successfully!
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Hourly Rate ($ USD)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
            <Input 
              type="number" 
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              required
              className="pl-10 rounded-xl py-5 border-border/80"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Professional Bio
          </label>
          <textarea 
            rows={5}
            placeholder="Write a short summary about your teaching experience and expertise..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className="w-full rounded-xl border border-border/80 bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
          />
        </div>

        <Button 
          type="submit" 
          disabled={submitting}
          className="w-full rounded-xl py-6 font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/25 transition-all"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}