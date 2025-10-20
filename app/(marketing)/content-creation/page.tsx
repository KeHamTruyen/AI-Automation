// app/content-creation/page.tsx
import type { Metadata } from "next";
import ContentCreationClient from "./ContentCreationClient";

export const metadata: Metadata = {
  title: "AI Content Creation | Tạo nội dung tự động với AI",
  description:
    "Tạo nội dung marketing, social media, video script, email và bài viết tự động bằng AI.",
};
export default function ContentCreationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <ContentCreationClient />
    </main>
  );
}
