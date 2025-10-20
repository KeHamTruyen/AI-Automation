import React from "react";
import Nav from "@/components/Nav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav /> {/* Thanh điều hướng riêng */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
