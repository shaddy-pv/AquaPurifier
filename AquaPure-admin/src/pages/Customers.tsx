import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Mail, 
  Phone, 
  RefreshCw,
  UserCog
} from "lucide-react";
import { adminApi, AdminUser } from "@/lib/api";
import { toast } from "sonner";

export default function Customers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.users.getAll();
      setUsers(data.users || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load customers";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleToggle = async (userId: string, currentRole: "customer" | "admin") => {
    const nextRole = currentRole === "admin" ? "customer" : "admin";
    setUpdatingId(userId);
    try {
      await adminApi.users.updateRole(userId, nextRole);
      toast.success(`User role updated to ${nextRole}`);
      setUsers((prev) => 
        prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update role";
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.toLowerCase().includes(q))
    );
  });

  const adminCount = users.filter((u) => u.role === "admin").length;
  const customerCount = users.filter((u) => u.role === "customer").length;

  return (
    <AdminLayout 
      title="Customer & Account Directory" 
      description="View registered accounts, verify access levels, manage administrative permissions"
    >
      <div className="space-y-6">
        {/* Metric Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-sky-100 bg-white shadow-soft">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Total User Base</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{users.length}</h3>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-sky-50 border border-sky-100 text-primary flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-sky-100 bg-white shadow-soft">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Customers</p>
                <h3 className="text-2xl font-bold text-emerald-600 mt-1">{customerCount}</h3>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                <UserCheck className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-sky-100 bg-white shadow-soft">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">System Administrators</p>
                <h3 className="text-2xl font-bold text-indigo-600 mt-1">{adminCount}</h3>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Directory Bar */}
        <Card className="border border-sky-100 bg-white">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base text-slate-900 font-bold">User Accounts</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs border-sky-100"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={loading}
                className="border-sky-100 text-slate-600 hover:text-primary"
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-sky-50/60 text-xs uppercase tracking-wider text-slate-500 border-b border-sky-100">
                  <tr>
                    <th className="py-3.5 px-6">Account Holder</th>
                    <th className="py-3.5 px-6">Contact Channels</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No accounts match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-sky-50/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-sm shadow-soft">
                              {u.name[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{u.name}</p>
                              <p className="text-xs text-slate-400">ID: {u.id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Mail className="h-3.5 w-3.5 text-primary" />
                            <span>{u.email}</span>
                          </div>
                          {u.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Phone className="h-3.5 w-3.5 text-primary" />
                              <span>{u.phone}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <Badge 
                            variant="outline"
                            className={
                              u.role === "admin"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }
                          >
                            {u.role === "admin" ? "Administrator" : "Customer"}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={updatingId === u.id}
                            onClick={() => handleRoleToggle(u.id, u.role)}
                            className="text-xs text-slate-600 hover:text-primary hover:bg-sky-50"
                          >
                            <UserCog className="h-3.5 w-3.5 mr-1.5" />
                            {u.role === "admin" ? "Make Customer" : "Promote to Admin"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-sky-50">
              {filteredUsers.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No accounts found.
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <div key={u.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-sm shadow-soft">
                          {u.name[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          u.role === "admin"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 text-xs"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                        }
                      >
                        {u.role}
                      </Badge>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updatingId === u.id}
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        className="w-full text-xs border-sky-100 text-slate-700 hover:text-primary hover:bg-sky-50"
                      >
                        <UserCog className="h-3.5 w-3.5 mr-1.5" />
                        {u.role === "admin" ? "Make Customer" : "Promote to Admin"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
