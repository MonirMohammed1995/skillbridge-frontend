"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorsRes, categoriesRes] = await Promise.all([
          api.get("/tutors"),
          api.get("/categories").catch(() => ({ data: [] }))
        ]);
        
        const tutorData = tutorsRes.data.tutors || tutorsRes.data;
        setTutors(Array.isArray(tutorData) ? tutorData : []);
        
        const catData = categoriesRes.data.categories || categoriesRes.data;
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (err) {
        console.error("Failed to fetch tutors or categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // সার্চ এবং ক্যাটাগরি অনুযায়ী ট্যুটর ফিল্টার করা
  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch = 
      tutor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory 
      ? tutor.categoryId === selectedCategory || tutor.category?.name === selectedCategory 
      : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner fullScreen text="Exploring expert tutors..." size="xl" />;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Explore Expert Tutors</h1>
        <p className="text-sm text-muted-foreground">
          Find and connect with professional mentors to accelerate your learning journey and achieve your goals.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-background p-4 rounded-2xl border border-border/60 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl py-5 border-border/80"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("")}
            className="rounded-xl shrink-0"
          >
            All Categories
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id || selectedCategory === cat.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-xl shrink-0"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Tutors Grid */}
      {filteredTutors.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-3xl border-border/60 text-muted-foreground text-sm space-y-3">
          <p>No tutors found matching your criteria.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory(""); }} className="rounded-xl">
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm flex flex-col justify-between space-y-6 transition-all hover:shadow-md hover:border-indigo-500/50 group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 font-extrabold text-2xl uppercase">
                    {tutor.name?.charAt(0)}
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    Available
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-indigo-600 transition-colors">
                    {tutor.name}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    {tutor.category?.name || "Expert Mentor"}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {tutor.bio || "Professional mentor ready to guide you through personalized 1-on-1 sessions."}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="size-4 fill-amber-500" />
                    <span>4.9 (Verified)</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-foreground font-bold text-sm">
                    <DollarSign className="size-4 text-indigo-600" />
                    <span>{tutor.hourlyRate || 50} / hr</span>
                  </div>
                </div>

                <Link href={`/tutors/${tutor.id}`} className="block">
                  <Button className="w-full rounded-xl py-5 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm group-hover:shadow-md transition-all">
                    View Profile & Book <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}