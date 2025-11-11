import type { Metadata } from "next";
import AiRepresentativeClient from "./AiRepresentativeClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Representative | Brand Avatar Creator",
  description:
    "Tạo AI đại diện thương hiệu của bạn với Avatar, Voice AI và hành vi tự nhiên.",
};

export default function AiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50">
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-pink-100 text-pink-700">
            🤖 AI đại diện thương hiệu
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Phát triển AI đại diện
            <br />
            cho thương hiệu
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Tạo AI Avatar, Voice AI, video clips và chatbot thông minh để đại
            diện cho thương hiệu của bạn. Tương tác tự nhiên và chuyên nghiệp
            24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              <Bot className="w-5 h-5 mr-2" />
              Tạo AI Avatar
            </Button>
            <Button size="lg" variant="outline">
              <Play className="w-5 h-5 mr-2" />
              Xem demo
            </Button>
          </div>
        </div>
      </section>
      {/*  Ai Client */}
      <AiRepresentativeClient />
    </div>
  );
}
