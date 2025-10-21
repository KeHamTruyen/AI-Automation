import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, ArrowRight } from "lucide-react";
import PerformanceDashboard from "./PerformanceDashboard";

export default function PerformanceClient() {
  return (
    <>
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-purple-100 text-purple-700">
            📊 Quản lý hiệu suất
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Quản lý & thống kê
            <br />
            hiệu quả nội dung
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Theo dõi hiệu suất nội dung với báo cáo chi tiết, phân tích insights
            và tối ưu chiến lược marketing dựa trên dữ liệu thực tế.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Xem báo cáo
            </Button>
            <Button size="lg" variant="outline">
              <Download className="w-5 h-5 mr-2" />
              Xuất dữ liệu
            </Button>
          </div>
        </div>
      </section>
      {/* Dashboard */}
      <PerformanceDashboard />

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tối ưu hiệu suất với AI Analytics
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Theo dõi, phân tích và cải thiện hiệu quả marketing với insights từ
            AI thông minh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Xem dashboard ngay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
            >
              Tải báo cáo mẫu
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
