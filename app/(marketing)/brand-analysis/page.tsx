"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  Target,
  Users,
  MessageSquare,
  FileText,
  CheckCircle,
  ArrowRight,
  Upload,
  BarChart3,
  Lightbulb,
  Eye,
  Share2,
  Download,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function BrandAnalysisPage() {
  const [analysisStep, setAnalysisStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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

      {/* Analysis Interface */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Tabs value={`step-${analysisStep}`} className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="step-1" onClick={() => setAnalysisStep(1)}>
                  Thông tin cơ bản
                </TabsTrigger>
                <TabsTrigger value="step-2" onClick={() => setAnalysisStep(2)}>
                  Mục tiêu & Đối tượng
                </TabsTrigger>
                <TabsTrigger value="step-3" onClick={() => setAnalysisStep(3)}>
                  Nội dung hiện tại
                </TabsTrigger>
                <TabsTrigger value="step-4" onClick={() => setAnalysisStep(4)}>
                  Kết quả phân tích
                </TabsTrigger>
              </TabsList>

              {/* Step 1: Basic Information */}
              <TabsContent value="step-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Thông tin cơ bản về thương hiệu
                    </CardTitle>
                    <CardDescription>
                      Cung cấp thông tin cơ bản để AI hiểu về thương hiệu của
                      bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="brand-name">Tên thương hiệu *</Label>
                        <Input
                          id="brand-name"
                          placeholder="VD: TechCorp Vietnam"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Ngành nghề *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ngành nghề" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">
                              Công nghệ
                            </SelectItem>
                            <SelectItem value="finance">Tài chính</SelectItem>
                            <SelectItem value="healthcare">Y tế</SelectItem>
                            <SelectItem value="education">Giáo dục</SelectItem>
                            <SelectItem value="retail">Bán lẻ</SelectItem>
                            <SelectItem value="food">Thực phẩm</SelectItem>
                            <SelectItem value="fashion">Thời trang</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand-description">
                        Mô tả thương hiệu *
                      </Label>
                      <Textarea
                        id="brand-description"
                        placeholder="Mô tả ngắn gọn về thương hiệu, sản phẩm/dịch vụ chính và giá trị cốt lõi..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company-size">Quy mô công ty</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quy mô" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="startup">
                              Startup (1-10 người)
                            </SelectItem>
                            <SelectItem value="small">
                              Nhỏ (11-50 người)
                            </SelectItem>
                            <SelectItem value="medium">
                              Vừa (51-200 người)
                            </SelectItem>
                            <SelectItem value="large">
                              Lớn (200+ người)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand-values">Giá trị cốt lõi</Label>
                      <Textarea
                        id="brand-values"
                        placeholder="Những giá trị, nguyên tắc mà thương hiệu theo đuổi..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => setAnalysisStep(2)}>
                        Tiếp theo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 2: Goals & Audience */}
              <TabsContent value="step-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      Mục tiêu & Đối tượng khách hàng
                    </CardTitle>
                    <CardDescription>
                      Xác định mục tiêu marketing và đối tượng khách hàng mục
                      tiêu
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="marketing-goals">
                        Mục tiêu marketing chính *
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          "Tăng nhận diện thương hiệu",
                          "Tăng doanh số bán hàng",
                          "Thu hút khách hàng mới",
                          "Giữ chân khách hàng cũ",
                          "Xây dựng cộng đồng",
                          "Giáo dục thị trường",
                        ].map((goal) => (
                          <label
                            key={goal}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{goal}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="target-age">Độ tuổi khách hàng</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn độ tuổi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="18-25">18-25 tuổi</SelectItem>
                            <SelectItem value="26-35">26-35 tuổi</SelectItem>
                            <SelectItem value="36-45">36-45 tuổi</SelectItem>
                            <SelectItem value="46-55">46-55 tuổi</SelectItem>
                            <SelectItem value="55+">55+ tuổi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="target-income">Thu nhập</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn mức thu nhập" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">
                              Dưới 10 triệu/tháng
                            </SelectItem>
                            <SelectItem value="medium">
                              10-30 triệu/tháng
                            </SelectItem>
                            <SelectItem value="high">
                              30-50 triệu/tháng
                            </SelectItem>
                            <SelectItem value="premium">
                              Trên 50 triệu/tháng
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target-interests">
                        Sở thích & Quan tâm
                      </Label>
                      <Textarea
                        id="target-interests"
                        placeholder="Mô tả sở thích, quan tâm, thói quen của khách hàng mục tiêu..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pain-points">
                        Vấn đề khách hàng gặp phải
                      </Label>
                      <Textarea
                        id="pain-points"
                        placeholder="Những khó khăn, vấn đề mà sản phẩm/dịch vụ của bạn giải quyết..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setAnalysisStep(1)}
                      >
                        Quay lại
                      </Button>
                      <Button onClick={() => setAnalysisStep(3)}>
                        Tiếp theo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 3: Current Content */}
              <TabsContent value="step-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-purple-600" />
                      Nội dung & Kênh truyền thông hiện tại
                    </CardTitle>
                    <CardDescription>
                      Cung cấp thông tin về nội dung và kênh truyền thông đang
                      sử dụng
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-platforms">
                        Nền tảng đang sử dụng *
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          "Facebook",
                          "Instagram",
                          "LinkedIn",
                          "TikTok",
                          "YouTube",
                          "Twitter",
                          "Website/Blog",
                          "Email Marketing",
                          "Google Ads",
                        ].map((platform) => (
                          <label
                            key={platform}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{platform}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content-types">
                        Loại nội dung thường tạo
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          "Bài viết blog",
                          "Social media posts",
                          "Video ngắn",
                          "Infographic",
                          "Podcast",
                          "Email newsletter",
                          "Case study",
                          "Tutorial",
                          "Live stream",
                        ].map((type) => (
                          <label
                            key={type}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content-examples">
                        Ví dụ nội dung hiệu quả
                      </Label>
                      <Textarea
                        id="content-examples"
                        placeholder="Chia sẻ một số ví dụ về nội dung đã tạo và có hiệu quả tốt..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="posting-frequency">
                          Tần suất đăng bài
                        </Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn tần suất" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Hàng ngày</SelectItem>
                            <SelectItem value="few-times-week">
                              Vài lần/tuần
                            </SelectItem>
                            <SelectItem value="weekly">Hàng tuần</SelectItem>
                            <SelectItem value="monthly">Hàng tháng</SelectItem>
                            <SelectItem value="irregular">Không đều</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content-budget">
                          Ngân sách nội dung/tháng
                        </Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ngân sách" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-5m">
                              Dưới 5 triệu
                            </SelectItem>
                            <SelectItem value="5-15m">5-15 triệu</SelectItem>
                            <SelectItem value="15-30m">15-30 triệu</SelectItem>
                            <SelectItem value="over-30m">
                              Trên 30 triệu
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="competitors">
                        Đối thủ cạnh tranh chính
                      </Label>
                      <Input
                        id="competitors"
                        placeholder="Tên các đối thủ cạnh tranh (cách nhau bằng dấu phẩy)"
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setAnalysisStep(2)}
                      >
                        Quay lại
                      </Button>
                      <Button
                        onClick={handleStartAnalysis}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Đang phân tích...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Bắt đầu phân tích
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 4: Analysis Results */}
              <TabsContent value="step-4">
                {isAnalyzing ? (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4">
                        AI đang phân tích thương hiệu của bạn...
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Quá trình này có thể mất vài phút. AI đang xử lý và phân
                        tích dữ liệu để tạo ra báo cáo chi tiết.
                      </p>
                      <div className="max-w-md mx-auto">
                        <Progress value={75} className="mb-2" />
                        <p className="text-sm text-gray-500">
                          Đang phân tích... 75%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : analysisComplete ? (
                  <div className="space-y-8">
                    {/* Analysis Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                          Kết quả phân tích thương hiệu
                        </CardTitle>
                        <CardDescription>
                          AI đã hoàn thành phân tích chân dung thương hiệu của
                          bạn
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                              92%
                            </div>
                            <div className="text-sm text-gray-600">
                              Độ chính xác phân tích
                            </div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              15
                            </div>
                            <div className="text-sm text-gray-600">
                              Insights được tạo
                            </div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                              8
                            </div>
                            <div className="text-sm text-gray-600">
                              Chiến lược đề xuất
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Brand Personality */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Chân dung thương hiệu</CardTitle>
                        <CardDescription>
                          Phân tích tính cách và đặc điểm của thương hiệu
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                Tính chuyên nghiệp
                              </span>
                              <div className="flex items-center space-x-3">
                                <Progress value={85} className="w-32" />
                                <span className="text-sm font-medium">85%</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 ml-4">
                              Thương hiệu thể hiện sự chuyên nghiệp cao, đáng
                              tin cậy trong lĩnh vực công nghệ
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                Tính thân thiện
                              </span>
                              <div className="flex items-center space-x-3">
                                <Progress value={92} className="w-32" />
                                <span className="text-sm font-medium">92%</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 ml-4">
                              Cách giao tiếp gần gũi, dễ tiếp cận, tạo cảm giác
                              thân thiện với khách hàng
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Tính sáng tạo</span>
                              <div className="flex items-center space-x-3">
                                <Progress value={78} className="w-32" />
                                <span className="text-sm font-medium">78%</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 ml-4">
                              Thương hiệu có xu hướng sáng tạo, đổi mới trong
                              cách tiếp cận và giải pháp
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                Tính đáng tin cậy
                              </span>
                              <div className="flex items-center space-x-3">
                                <Progress value={88} className="w-32" />
                                <span className="text-sm font-medium">88%</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 ml-4">
                              Khách hàng có thể tin tưởng vào chất lượng sản
                              phẩm và dịch vụ
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Content Strategy */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Chiến lược nội dung đề xuất</CardTitle>
                        <CardDescription>
                          Gợi ý về loại nội dung và cách tiếp cận phù hợp
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                              Tone of Voice
                            </h4>
                            <div className="space-y-2">
                              <Badge variant="secondary">
                                Chuyên nghiệp nhưng thân thiện
                              </Badge>
                              <Badge variant="secondary">
                                Giải thích đơn giản
                              </Badge>
                              <Badge variant="secondary">
                                Tích cực và động viên
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-3">
                              Sử dụng ngôn ngữ chuyên nghiệp nhưng dễ hiểu,
                              tránh thuật ngữ phức tạp
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <FileText className="w-4 h-4 mr-2 text-green-600" />
                              Loại nội dung ưu tiên
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Tutorial & How-to
                                </span>
                                <Badge className="bg-green-100 text-green-700">
                                  Cao
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Case Study</span>
                                <Badge className="bg-green-100 text-green-700">
                                  Cao
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Behind the scenes
                                </span>
                                <Badge className="bg-blue-100 text-blue-700">
                                  Trung bình
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Industry insights
                                </span>
                                <Badge className="bg-green-100 text-green-700">
                                  Cao
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Platform Recommendations */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Đề xuất nền tảng</CardTitle>
                        <CardDescription>
                          Nền tảng phù hợp nhất cho thương hiệu của bạn
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                  Li
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium">LinkedIn</h4>
                                <p className="text-sm text-gray-600">
                                  Phù hợp cho B2B và nội dung chuyên nghiệp
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">
                              Ưu tiên cao
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                  f
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium">Facebook</h4>
                                <p className="text-sm text-gray-600">
                                  Tốt cho community building và customer support
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">
                              Ưu tiên cao
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                  YT
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium">YouTube</h4>
                                <p className="text-sm text-gray-600">
                                  Lý tưởng cho tutorial và demo sản phẩm
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700">
                              Ưu tiên trung bình
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Items */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Bước tiếp theo</CardTitle>
                        <CardDescription>
                          Những hành động cụ thể để cải thiện thương hiệu
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium">
                                Tạo content calendar
                              </h4>
                              <p className="text-sm text-gray-600">
                                Lập kế hoạch nội dung 30 ngày với focus vào
                                tutorial và case study
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium">
                                Tối ưu LinkedIn presence
                              </h4>
                              <p className="text-sm text-gray-600">
                                Tăng tần suất đăng bài và tương tác trên
                                LinkedIn
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium">
                                Phát triển video content
                              </h4>
                              <p className="text-sm text-gray-600">
                                Tạo series video tutorial về sản phẩm và giải
                                pháp
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Export Options */}
                    <div className="flex justify-center space-x-4">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                        <Download className="w-4 h-4 mr-2" />
                        Tải báo cáo PDF
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Chia sẻ kết quả
                      </Button>
                      <Link href="/content-creation">
                        <Button variant="outline">
                          Tạo nội dung ngay
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Brain className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4">
                        Chưa có kết quả phân tích
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Vui lòng hoàn thành các bước trước để xem kết quả phân
                        tích thương hiệu.
                      </p>
                      <Button onClick={() => setAnalysisStep(1)}>
                        Bắt đầu phân tích
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
