"use client";

import PromotionPopup from "@/components/user-dashboard/PromotionPopup";
import JoinTelegram from "@/components/user-dashboard/JoinTelegram";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isGiftMemberOpen, setIsGiftMemberOpen] = useState(false);

  // Hide JoinTelegram on wallet connection pages
  const isWalletConnectionPage = pathname?.startsWith('/user-dashboard/link-wallet/');

  // Auto-open the gift member modal only on login/signup (not on page navigation)
  useEffect(() => {
    const hasShownPopup = localStorage.getItem('promotionPopupShown');
    
    if (!hasShownPopup) {
      const timer = setTimeout(() => {
        setIsGiftMemberOpen(true);
        localStorage.setItem('promotionPopupShown', 'true');
      }, 2000); // Open after 2 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {children}
      <PromotionPopup 
        isOpen={isGiftMemberOpen} 
        onClose={() => setIsGiftMemberOpen(false)} 
      />
      {!isWalletConnectionPage && <JoinTelegram />}
    </>
  );
}
