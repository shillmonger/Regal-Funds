"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail, Users, Send, X, Check, ChevronDown } from "lucide-react";
import AdminHeader from "@/components/ui/admin-header";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminNav from "@/components/ui/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function MailUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
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
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 🛠️ Handle user selection
  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
    setSelectAll(newSelected.size === users.length);
  };

  // 🛠️ Handle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map((u) => u.id)));
    }
    setSelectAll(!selectAll);
  };

  // 🛠️ Handle send email
  const handleSendEmail = async () => {
    if (selectedUsers.size === 0) {
      toast.error("Please select at least one user");
      return;
    }

    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast.error("Please fill in subject and message");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/send-bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: Array.from(selectedUsers),
          subject: emailForm.subject,
          message: emailForm.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send emails");
      }

      toast.success(`Email sent to ${data.successful} user(s)${data.failed > 0 ? `, ${data.failed} failed` : ""}`);
      setEmailForm({ subject: "", message: "" });
      setSelectedUsers(new Set());
      setSelectAll(false);
    } catch (err: any) {
      console.error("Failed to send email:", err);
      toast.error(err.message || "Failed to send emails");
    } finally {
      setSending(false);
    }
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
              Mail Users{" "}
              <Mail className="inline w-8 h-8 text-[#72a210]" />
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Send emails to selected users from your database。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Users Selection Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
              {/* Card Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#72a210]" />
                  Select Users
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({selectedUsers.size} selected)
                  </span>
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSelectAll}
                  className="cursor-pointer text-sm"
                >
                  {selectAll ? "Deselect All" : "Select All"}
                </Button>
              </div>

              {/* Users List */}
              <div className="max-h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#72a210] border-t-transparent rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No users found.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.map((user, idx) => (
                      <div
                        key={user.id}
                        className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                          idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/40 dark:bg-gray-900/60"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#72a210] focus:ring-[#72a210] cursor-pointer"
                        />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#72a210]/20 to-[#72a210]/40 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#72a210]">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-[#72a210]/10 text-[#72a210] dark:bg-[#72a210]/20 ring-1 ring-[#72a210]/30"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              {!loading && users.length > 0 && (
                <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total: <span className="font-semibold text-gray-700 dark:text-gray-300">{users.length}</span> users
                  </p>
                </div>
              )}
            </div>

            {/* Email Composition Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
              {/* Card Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#72a210]" />
                  Compose Email
                </h2>
              </div>

              {/* Email Form */}
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Enter email subject..."
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm((prev) => ({ ...prev, subject: e.target.value }))}
                    className="cursor-text border-gray-300 dark:border-gray-600 focus:border-[#72a210] focus:ring-[#72a210]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    value={emailForm.message}
                    onChange={(e) => setEmailForm((prev) => ({ ...prev, message: e.target.value }))}
                    rows={12}
                    className="cursor-text border-gray-300 dark:border-gray-600 focus:border-[#72a210] focus:ring-[#72a210] resize-none"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSendEmail}
                    disabled={sending || selectedUsers.size === 0}
                    className="cursor-pointer p-5 w-full bg-[#72a210] hover:bg-[#5a8108] active:bg-[#4a6a07] text-white font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Email{selectedUsers.size > 1 ? `s (${selectedUsers.size})` : ""}
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  <p>Emails will be sent using the configured SMTP settings from your environment variables.</p>
                  <p className="mt-1">Logo: https://i.postimg.cc/bNychjPg/dark-logo.png</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <AdminNav />
      </div>
    </div>
  );
}
