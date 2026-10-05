"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderPlus, Layers } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      const data = res.data?.categories || res.data?.data || res.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      // অ্যাডমিন রাউটে রিকোয়েস্ট পাঠানো হচ্ছে
      const res = await api.post("/admin/categories", { 
        name: name.trim(), 
        description: description.trim() 
      });
      
      if (res.data?.success || res.status === 201 || res.status === 200) {
        setName("");
        setDescription("");
        await fetchCategories(); // লিস্ট রিফ্রেশ করা
      }
    } catch (err: any) {
      console.error("Error creating category:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to create category. Make sure you are logged in as Admin.";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading categories..." size="xl" />;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Manage Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">Create and manage mentoring subject categories.</p>
      </div>

      {/* Create Category Form */}
      <form onSubmit={handleCreateCategory} className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base">Add New Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input 
            placeholder="Category Name (e.g. Physics)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="rounded-xl py-5 border-border/80"
          />
          <Input 
            placeholder="Description (Optional)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="rounded-xl py-5 border-border/80"
          />
        </div>
        <Button 
          type="submit" 
          disabled={submitting} 
          className="rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
        >
          <FolderPlus className="mr-2 size-4" /> {submitting ? "Creating..." : "Create Category"}
        </Button>
      </form>

      {/* Categories Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full p-8 text-center border border-dashed rounded-2xl border-border/60 text-muted-foreground text-sm">
            No categories found. Create your first category above!
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id || Math.random()} className="p-5 rounded-2xl border border-border/60 bg-background shadow-sm flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 font-bold shrink-0 dark:bg-violet-950">
                <Layers className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base">{cat.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{cat.description || "No description provided."}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}