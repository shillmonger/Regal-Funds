"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Shield, UserCog, Users, ChevronDown, Edit, X, DollarSign, TrendingUp, Calendar, Mail, User, Key, Wallet, Award } from "lucide-react";
import AdminHeader from "@/components/ui/admin-header";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminNav from "@/components/ui/admin-nav";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminRoleManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    balance: 0,
    totalEarnings: 0,
    totalInvested: 0,
  });

  // 🧩 Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 🛠️ Handle role update
  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Failed to update user role");
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
      toast.success("Role updated");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  // 🛠️ Handle user details update
  const handleUserDetailsUpdate = async () => {
    if (
      editForm.balance < 0 ||
      editForm.totalEarnings < 0 ||
      editForm.totalInvested < 0
    ) {
      toast.error("All financial values must be non-negative");
      return;
    }

    if (
      isNaN(editForm.balance) ||
      isNaN(editForm.totalEarnings) ||
      isNaN(editForm.totalInvested)
    ) {
      toast.error("All financial values must be valid numbers");
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to update user details");
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id ? { ...u, ...editForm } : u
        )
      );

      toast.success("User details updated successfully");
      setEditModalOpen(false);
      setEditingUser(null);
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.message || "Update failed. Please try again.");
    }
  };

  // 🛠️ Open edit modal
  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditForm({
      balance: user.balance || 0,
      totalEarnings: user.totalEarnings || 0,
      totalInvested: user.totalInvested || 0,
    });
    setEditModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 font-inter">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Role Management{" "}
              <Shield className="inline w-8 h-8 text-[#72a210]" />
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Promote or demote users by changing their role below.
            </p>
          </div>

          {/* Users Table Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#72a210]" />
                All Users
              </h2>
              <UserCog className="w-5 h-5 text-[#72a210]" />
            </div>

            {/* Scrollable Table Wrapper */}
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-5 py-3 whitespace-nowrap">
                      Name
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-5 py-3 whitespace-nowrap">
                      Email
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-5 py-3 whitespace-nowrap">
                      Balance
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-5 py-3 whitespace-nowrap">
                      Total Earnings
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-5 py-3 whitespace-nowrap">
                      Role
                    </th>
                    <th className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-5 py-3 whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-gray-500 dark:text-gray-400"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#72a210] border-t-transparent rounded-full animate-spin" />
                          Loading users...
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-gray-500 dark:text-gray-400"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user, idx) => (
                      <tr
                        key={user.id}
                        className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 ${
                          idx % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-gray-50/40 dark:bg-gray-900/60"
                        }`}
                      >
                        {/* Name */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#72a210]/20 to-[#72a210]/40 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-[#72a210]">
                                {user.name?.[0]?.toUpperCase() || "U"}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                              {user.name}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </span>
                        </td>

                        {/* Balance */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold">
                              <DollarSign className="w-3.5 h-3.5" />
                              {user.balance?.toLocaleString() || 0}
                            </span>
                          </div>
                        </td>

                        {/* Total Earnings */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-semibold">
                              <TrendingUp className="w-3.5 h-3.5" />
                              {user.totalEarnings?.toLocaleString() || 0}
                            </span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                              user.role === "admin"
                                ? "bg-[#72a210]/10 text-[#72a210] dark:bg-[#72a210]/20 ring-1 ring-[#72a210]/30"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:border-[#72a210] hover:text-[#72a210] dark:hover:border-[#72a210] dark:hover:text-[#72a210] transition-colors"
                              >
                                Actions
                                <ChevronDown className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400">
                                Manage User
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(user.id, "user")}
                                className="cursor-pointer text-sm"
                              >
                                Change Role to User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(user.id, "admin")
                                }
                                className="cursor-pointer text-sm"
                              >
                                Change Role to Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditModal(user)}
                                className="cursor-pointer flex items-center gap-2 text-sm"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                Edit User Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {!loading && users.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {users.length}
                  </span>{" "}
                  user{users.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  ← Scroll to see more
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <AdminNav />
      </div>

      {/* Edit User Details Modal */}
      {editModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10 rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#72a210]" />
                Edit User Details
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditModalOpen(false)}
                className="cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* User Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Name
                  </Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 text-sm font-medium border border-gray-200 dark:border-gray-700">
                    {editingUser.name}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 text-sm border border-gray-200 dark:border-gray-700">
                    {editingUser.email}
                  </div>
                </div>
              </div>

              {/* User Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    Referral Code
                  </Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 text-sm border border-gray-200 dark:border-gray-700">
                    {editingUser.referralCode || "N/A"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Member Since
                  </Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 text-sm border border-gray-200 dark:border-gray-700">
                    {editingUser.createdAt
                      ? new Date(editingUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* Wallet Info */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5" />
                  BTC Wallet
                </Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm border border-gray-200 dark:border-gray-700 break-all">
                  {editingUser.wallets?.btc || "Not set"}
                </div>
              </div>

              {/* Editable Financial Info */}
              <div className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-5">
                <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#72a210]" />
                  Financial Information
                  <span className="text-xs font-normal text-[#72a210] bg-[#72a210]/10 px-2 py-0.5 rounded-full">
                    Editable
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="balance"
                      className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      Balance ($)
                    </Label>
                    <Input
                      id="balance"
                      type="number"
                      value={editForm.balance}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          balance: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="cursor-text border-gray-300 dark:border-gray-600 focus:border-[#72a210] focus:ring-[#72a210] text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="totalEarnings"
                      className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      Total Earnings ($)
                    </Label>
                    <Input
                      id="totalEarnings"
                      type="number"
                      value={editForm.totalEarnings}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          totalEarnings: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="cursor-text border-gray-300 dark:border-gray-600 focus:border-[#72a210] focus:ring-[#72a210] text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="totalInvested"
                      className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      Total Invested ($)
                    </Label>
                    <Input
                      id="totalInvested"
                      type="number"
                      value={editForm.totalInvested}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          totalInvested: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="cursor-text border-gray-300 dark:border-gray-600 focus:border-[#72a210] focus:ring-[#72a210] text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* User Status Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-800 pt-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        editingUser.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {editingUser.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    2FA Enabled
                  </Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        editingUser.twoFactorEnabled
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {editingUser.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Welcome Bonus
                  </Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        editingUser.welcomeBonusGranted
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {editingUser.welcomeBonusGranted
                        ? "Granted"
                        : "Not Granted"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900 rounded-b-2xl">
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                className="cursor-pointer border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUserDetailsUpdate}
                className="cursor-pointer bg-[#72a210] hover:bg-[#5a8108] active:bg-[#4a6a07] text-white text-sm font-semibold shadow-sm transition-colors"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}