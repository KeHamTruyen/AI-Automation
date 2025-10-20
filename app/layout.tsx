import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Marketing Engine - Nền tảng Marketing AI toàn diện",
  description:
    "Xây dựng thương hiệu với AI Marketing Engine. Phân tích chân dung thương hiệu, tạo nội dung tự động, quản lý đa nền tảng và phát triển AI Avatar đại diện.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
