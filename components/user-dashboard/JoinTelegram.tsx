"use client";

import React from "react";
import { Send } from "lucide-react";

export default function JoinTelegram() {
  return (
    <a
      href="https://t.me/+cX9cZuER651hOGZk"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-22 lg:bottom-10 right-2 lg:right-4 z-50 bg-[#0088cc] hover:bg-[#0077b5] text-white p-3 rounded-2xl shadow-lg transition-all hover:scale-110 cursor-pointer group"
      title="Join our Telegram"
    >
      <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
    </a>
  );
}
