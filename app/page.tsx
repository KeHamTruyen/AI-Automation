import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Calendar,
  BarChart3,
  Bot,
  Zap,
  Target,
  Share2,
  TrendingUp,
  MessageSquare,
  Video,
  CheckCircle,
  ArrowRight,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Marketing Engine
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Tính năng
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
              Bảng giá
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Liên hệ
            </Link>
            <Button>Dùng thử miễn phí</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">🚀 Ra mắt AI Marketing Engine 2024</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Xây dựng thương hiệu với
            <br />
            AI Marketing Engine
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Nền tảng AI toàn diện giúp phân tích chân dung thương hiệu, tạo nội dung tự động, quản lý đa nền tảng và
            phát triển hình ảnh AI đại diện cho doanh nghiệp của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Zap className="w-5 h-5 mr-2" />
              Bắt đầu miễn phí
            </Button>
            <Button size="lg" variant="outline">
              <Video className="w-5 h-5 mr-2" />
              Xem demo
            </Button>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border p-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-blue-600" />
                        <CardTitle className="text-sm">Phân tích thương hiệu</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">95%</div>
                      <p className="text-xs text-gray-600">Độ chính xác phân tích</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <CardTitle className="text-sm">Nội dung tự động</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">247</div>
                      <p className="text-xs text-gray-600">Bài viết/tháng</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <CardTitle className="text-sm">Tăng trưởng</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">+340%</div>
                      <p className="text-xs text-gray-600">Engagement rate</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tính năng vượt trội</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Bộ công cụ AI marketing toàn diện giúp doanh nghiệp xây dựng thương hiệu mạnh mẽ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Feature 1: Brand Analysis */}
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Phân tích chân dung thương hiệu</CardTitle>
                <CardDescription>
                  AI phân tích sâu định hướng, phong cách và nội dung phù hợp với thương hiệu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Phân tích tone of voice
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Định hướng nội dung
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Phong cách thương hiệu
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2: Auto Content Creation */}
            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Tạo nội dung tự động</CardTitle>
                <CardDescription>Tự động tạo bài viết, video, note và social post theo lịch trình</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Đăng đa nền tảng
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Lịch trình thông minh
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Tối ưu thời gian
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3: Analytics */}
            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Quản lý & thống kê</CardTitle>
                <CardDescription>Theo dõi hiệu quả nội dung với báo cáo chi tiết và insights</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Thống kê real-time
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Báo cáo chi tiết
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ROI tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 4: AI Avatar */}
            <Card className="border-2 hover:border-pink-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle className="text-lg">AI đại diện thương hiệu</CardTitle>
                <CardDescription>Tạo avatar AI, voice AI và chatbot đại diện cho thương hiệu</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Avatar AI chuyên nghiệp
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Voice AI tự nhiên
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Chatbot thông minh
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Features */}
          <div className="space-y-16">
            {/* Brand Analysis Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-100 text-blue-700">Phân tích thương hiệu</Badge>
                <h3 className="text-3xl font-bold mb-4">AI hiểu sâu về thương hiệu của bạn</h3>
                <p className="text-gray-600 mb-6">
                  Công nghệ AI tiên tiến phân tích toàn diện chân dung thương hiệu, từ định hướng chiến lược đến phong
                  cách giao tiếp, giúp xây dựng nội dung nhất quán và hiệu quả.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Phân tích tone of voice</h4>
                      <p className="text-sm text-gray-600">Xác định giọng điệu và cách giao tiếp phù hợp</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Định hướng nội dung</h4>
                      <p className="text-sm text-gray-600">Gợi ý chủ đề và hướng phát triển nội dung</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Phân tích đối thủ</h4>
                      <p className="text-sm text-gray-600">So sánh và tìm điểm khác biệt cạnh tranh</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Brain className="w-5 h-5 text-blue-600 mr-2" />
                    Kết quả phân tích thương hiệu
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tính chuyên nghiệp</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tính thân thiện</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-18 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tính sáng tạo</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-14 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto Content Creation Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Calendar className="w-5 h-5 text-green-600 mr-2" />
                    Lịch đăng bài tự động
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Facebook Post</div>
                        <div className="text-xs text-gray-600">Hôm nay 9:00 AM</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Đã đăng
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Instagram Story</div>
                        <div className="text-xs text-gray-600">Hôm nay 2:00 PM</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Đang chờ
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">LinkedIn Article</div>
                        <div className="text-xs text-gray-600">Ngày mai 10:00 AM</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Lên lịch
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <Badge className="mb-4 bg-green-100 text-green-700">Tự động hóa nội dung</Badge>
                <h3 className="text-3xl font-bold mb-4">Đăng bài đa nền tảng chỉ với 1 nút</h3>
                <p className="text-gray-600 mb-6">
                  Hệ thống AI tự động tạo và tối ưu nội dung cho từng nền tảng, lên lịch đăng bài thông minh và quản lý
                  toàn bộ chiến dịch marketing.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Share2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Đa nền tảng</h4>
                      <p className="text-sm text-gray-600">Facebook, Instagram, LinkedIn, TikTok, YouTube</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Zap className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Tối ưu tự động</h4>
                      <p className="text-sm text-gray-600">Điều chỉnh nội dung phù hợp với từng platform</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Lịch trình thông minh</h4>
                      <p className="text-sm text-gray-600">AI phân tích thời gian tối ưu để đăng bài</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Được tin tưởng bởi hàng nghìn doanh nghiệp</h2>
          <p className="text-xl opacity-90 mb-12">Kết quả ấn tượng từ khách hàng sử dụng AI Marketing Engine</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="opacity-90">Doanh nghiệp tin tưởng</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5M+</div>
              <div className="opacity-90">Nội dung được tạo</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">340%</div>
              <div className="opacity-90">Tăng engagement</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="opacity-90">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bảng giá linh hoạt</h2>
            <p className="text-xl text-gray-600">Chọn gói phù hợp với quy mô doanh nghiệp của bạn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-xl">Starter</CardTitle>
                <CardDescription>Phù hợp cho doanh nghiệp nhỏ</CardDescription>
                <div className="text-3xl font-bold">
                  $99<span className="text-lg font-normal text-gray-600">/tháng</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>50 bài viết/tháng</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>3 nền tảng social</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Phân tích cơ bản</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>1 AI Avatar</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  Bắt đầu dùng thử
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="relative border-2 border-blue-500 shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Phổ biến nhất</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Professional</CardTitle>
                <CardDescription>Phù hợp cho doanh nghiệp vừa</CardDescription>
                <div className="text-3xl font-bold">
                  $299<span className="text-lg font-normal text-gray-600">/tháng</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>200 bài viết/tháng</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Tất cả nền tảng</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Phân tích nâng cao</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>5 AI Avatar</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Video AI</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600">Chọn gói này</Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <CardDescription>Phù hợp cho doanh nghiệp lớn</CardDescription>
                <div className="text-3xl font-bold">
                  $999<span className="text-lg font-normal text-gray-600">/tháng</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Không giới hạn bài viết</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Tất cả tính năng</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>API tùy chỉnh</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Không giới hạn Avatar</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Hỗ trợ 24/7</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  Liên hệ tư vấn
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng xây dựng thương hiệu với AI?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn doanh nghiệp đã tin tưởng AI Marketing Engine để phát triển thương hiệu của họ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Zap className="w-5 h-5 mr-2" />
              Dùng thử miễn phí 14 ngày
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
            >
              Đặt lịch demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AI Marketing Engine</span>
              </div>
              <p className="text-gray-400 mb-4">Nền tảng AI marketing toàn diện cho doanh nghiệp hiện đại.</p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Phân tích thương hiệu
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tạo nội dung AI
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Quản lý đa nền tảng
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    AI Avatar
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Trung tâm trợ giúp
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Hướng dẫn sử dụng
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Công ty</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Chính sách bảo mật
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Marketing Engine. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
