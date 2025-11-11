"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import ContentCreationForm from "./ContentCreationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Share2,
  Play,
  ArrowRight,
  Wand2,
  TrendingUp,
} from "lucide-react";
export default function ContentCreationClient() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-700">
            🎨 Tạo nội dung AI
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Tạo nội dung tự động
            <br />
            với AI thông minh
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI tạo bài viết, video, note và social post tự động theo lịch trình.
            Đăng bài trên nhiều nền tảng chỉ với 1 nút bấm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Tạo nội dung ngay
            </Button>
            <Button size="lg" variant="outline">
              <Play className="w-5 h-5 mr-2" />
              Xem demo
            </Button>
          </div>
        </div>
      </section>

      {/* Form + Logic */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <ContentCreationForm />
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tính năng nổi bật</h2>
            <p className="text-xl text-gray-600">
              Tạo nội dung chuyên nghiệp với AI tiên tiến
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">AI Content Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tạo nội dung chất lượng cao với AI GPT-4 trong vài giây
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Lên lịch đăng bài tự động vào thời gian tối ưu nhất
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Multi-Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Đăng bài trên nhiều nền tảng cùng lúc chỉ với 1 click
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Theo dõi hiệu suất và tối ưu nội dung liên tục
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng tạo nội dung với AI?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Bắt đầu tạo nội dung chuyên nghiệp và tự động hóa marketing ngay hôm
            nay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Tạo nội dung miễn phí
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
            >
              Xem tất cả tính năng
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
