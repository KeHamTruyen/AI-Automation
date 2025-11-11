"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Brain, Upload, BarChart3, Lightbulb, Eye } from "lucide-react";

export default function BrandAnalysisClient() {
  const [analysisStep, setAnalysisStep] = useState(1);
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700">
            🎯 Phân tích thương hiệu AI
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Phân tích chân dung thương hiệu
            <br />
            với AI tiên tiến
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI phân tích sâu định hướng, phong cách và nội dung phù hợp với
            thương hiệu của bạn. Từ đó đưa ra chiến lược marketing hiệu quả và
            nhất quán.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setAnalysisStep(1)}
            >
              <Brain className="w-5 h-5 mr-2" />
              Bắt đầu phân tích
            </Button>
            <Button size="lg" variant="outline">
              <Eye className="w-5 h-5 mr-2" />
              Xem demo
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Quy trình phân tích thương hiệu
            </h2>
            <p className="text-xl text-gray-600">
              AI phân tích thương hiệu qua 4 bước đơn giản
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                1. Thu thập thông tin
              </h3>
              <p className="text-gray-600">
                Nhập thông tin cơ bản về thương hiệu, sản phẩm và mục tiêu
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. AI phân tích</h3>
              <p className="text-gray-600">
                AI xử lý và phân tích dữ liệu để hiểu sâu về thương hiệu
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Tạo báo cáo</h3>
              <p className="text-gray-600">
                Sinh ra báo cáo chi tiết về chân dung và chiến lược thương hiệu
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                4. Đề xuất chiến lược
              </h3>
              <p className="text-gray-600">
                Cung cấp gợi ý nội dung và chiến lược marketing cụ thể
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
