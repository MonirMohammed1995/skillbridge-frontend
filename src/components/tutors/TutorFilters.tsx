"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TutorFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

export function TutorFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}: TutorFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name or expertise..."
          className="pl-10 rounded-xl py-5 border-border/80 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === "ALL"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}