"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      const data = res.data.users || res.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}`, { isBanned: !currentStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !currentStatus } : u));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update user status.");
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading users..." size="xl" />;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Manage Users</h1>
        <p className="text-sm text-muted-foreground mt-1">View platform users and manage account status (Ban/Unban).</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background shadow-sm overflow-hidden">
        <div className="divide-y divide-border/60">
          {users.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No users found.</div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email} • <span className="font-semibold text-indigo-600">{user.role}</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.isBanned ? 'bg-red-50 text-red-600 dark:bg-red-950/50' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50'}`}>
                    {user.isBanned ? 'Banned' : 'Active'}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleToggleBan(user.id, user.isBanned)}
                    className="rounded-xl text-xs"
                  >
                    {user.isBanned ? "Unban" : "Ban"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}