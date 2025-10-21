import type { Metadata } from "next";
import PerformanceClient from "./PerformanceClient";

export const metadata: Metadata = {
  title: "Quản lý hiệu suất | AI Marketing Engine",
  description:
    "Theo dõi hiệu suất nội dung, phân tích insights và tối ưu chiến lược marketing.",
  openGraph: {
    title: "AI Marketing Engine - Performance Management",
    description:
      "Dashboard quản lý hiệu suất nội dung và chiến dịch marketing.",
    url: "https://yourdomain.com/performance-management",
    siteName: "AI Marketing Engine",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Performance Dashboard",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default async function PerformanceManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <PerformanceClient />
    </div>
  );
}
