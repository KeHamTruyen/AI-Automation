"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import {
  Brain,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Users,
  Clock,
  Target,
  Zap,
  Download,
  Filter,
  Globe,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  ArrowLeft,
  Home,
} from "lucide-react"
import Link from "next/link"

export default function PerformanceManagementPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Marketing Engine
              </span>
            </Link>
            
            {/* Breadcrumb */}
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="flex items-center">
                      <Home className="w-4 h-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="font-medium">Quản lý hiệu suất</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/content-creation">
              <Button variant="ghost" size="sm">
                Tạo nội dung
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-purple-100 text-purple-700">📊 Quản lý hiệu suất</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Quản lý & thống kê
            <br />
            hiệu quả nội dung
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Theo dõi hiệu suất nội dung với báo cáo chi tiết, phân tích insights và tối ưu chiến lược marketing dựa trên
            dữ liệu thực tế.
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

      {/* Performance Dashboard */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
              <div>
                <h2 className="text-2xl font-bold mb-2">Dashboard hiệu suất</h2>
                <p className="text-gray-600">Tổng quan về hiệu quả nội dung và chiến dịch marketing</p>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 giờ qua</SelectItem>
                    <SelectItem value="7d">7 ngày qua</SelectItem>
                    <SelectItem value="30d">30 ngày qua</SelectItem>
                    <SelectItem value="90d">90 ngày qua</SelectItem>
                    <SelectItem value="1y">1 năm qua</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Lọc
                </Button>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Làm mới
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="content">Nội dung</TabsTrigger>
                <TabsTrigger value="platforms">Nền tảng</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="reports">Báo cáo</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="space-y-8">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1.2M</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +25%
                          </span>{" "}
                          so với tháng trước
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">8.4%</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +2.1%
                          </span>{" "}
                          so với tháng trước
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reach</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">456K</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +18%
                          </span>{" "}
                          so với tháng trước
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">3.2%</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-red-600 flex items-center">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            -0.5%
                          </span>{" "}
                          so với tháng trước
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Xu hướng hiệu suất</CardTitle>
                      <CardDescription>Biểu đồ theo dõi các chỉ số chính theo thời gian</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Biểu đồ hiệu suất sẽ hiển thị ở đây</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Tích hợp với Chart.js hoặc Recharts để hiển thị dữ liệu thực tế
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Performing Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                          Top bài viết hiệu suất cao
                        </CardTitle>
                        <CardDescription>Những bài viết có engagement rate cao nhất</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">1</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">5 Tips Marketing hiệu quả</h4>
                                <p className="text-xs text-gray-600">Facebook • 2 ngày trước</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">12.4%</div>
                              <div className="text-xs text-gray-600">Engagement</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">2</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">Behind the scenes video</h4>
                                <p className="text-xs text-gray-600">Instagram • 1 ngày trước</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">11.8%</div>
                              <div className="text-xs text-gray-600">Engagement</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">3</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">Xu hướng Digital 2024</h4>
                                <p className="text-xs text-gray-600">LinkedIn • 3 ngày trước</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-purple-600">10.2%</div>
                              <div className="text-xs text-gray-600">Engagement</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                          Cần cải thiện
                        </CardTitle>
                        <CardDescription>Những bài viết có hiệu suất thấp cần tối ưu</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">Product announcement</h4>
                                <p className="text-xs text-gray-600">Twitter • 5 ngày trước</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-red-600">1.2%</div>
                              <div className="text-xs text-gray-600">Engagement</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">Weekly newsletter</h4>
                                <p className="text-xs text-gray-600">Email • 1 tuần trước</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-orange-600">2.8%</div>
                              <div className="text-xs text-gray-600">Open rate</div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium mb-2 flex items-center">
                              <Zap className="w-4 h-4 mr-2 text-blue-600" />
                              Gợi ý cải thiện
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Thay đổi thời gian đăng bài</li>
                              <li>• Cải thiện headline và CTA</li>
                              <li>• Thêm visual content</li>
                              <li>• A/B test different formats</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Content Performance Tab */}
              <TabsContent value="content">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Hiệu suất theo nội dung</h3>
                    <div className="flex space-x-2">
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Loại nội dung" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="social">Social posts</SelectItem>
                          <SelectItem value="blog">Blog articles</SelectItem>
                          <SelectItem value="video">Videos</SelectItem>
                          <SelectItem value="email">Emails</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Xuất báo cáo
                      </Button>
                    </div>
                  </div>

                  {/* Content Performance Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Chi tiết hiệu suất nội dung</CardTitle>
                      <CardDescription>Thống kê đầy đủ cho từng bài viết</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Table Header */}
                        <div className="grid grid-cols-6 gap-4 p-3 bg-gray-50 rounded-lg text-sm font-medium">
                          <div>Nội dung</div>
                          <div>Nền tảng</div>
                          <div>Ngày đăng</div>
                          <div>Lượt xem</div>
                          <div>Engagement</div>
                          <div>Trạng thái</div>
                        </div>

                        {/* Table Rows */}
                        <div className="space-y-2">
                          <div className="grid grid-cols-6 gap-4 p-3 border rounded-lg text-sm">
                            <div className="font-medium">5 Tips Marketing hiệu quả cho SME</div>
                            <div>
                              <Badge className="bg-blue-100 text-blue-700">Facebook</Badge>
                            </div>
                            <div className="text-gray-600">13/01/2024</div>
                            <div className="font-medium">12.4K</div>
                            <div className="text-green-600 font-medium">12.4%</div>
                            <div>
                              <Badge className="bg-green-100 text-green-700">Xuất sắc</Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-6 gap-4 p-3 border rounded-lg text-sm">
                            <div className="font-medium">Behind the scenes - Quy trình sản xuất</div>
                            <div>
                              <Badge className="bg-pink-100 text-pink-700">Instagram</Badge>
                            </div>
                            <div className="text-gray-600">14/01/2024</div>
                            <div className="font-medium">8.7K</div>
                            <div className="text-green-600 font-medium">11.8%</div>
                            <div>
                              <Badge className="bg-green-100 text-green-700">Tốt</Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-6 gap-4 p-3 border rounded-lg text-sm">
                            <div className="font-medium">Xu hướng công nghệ 2024</div>
                            <div>
                              <Badge className="bg-blue-100 text-blue-700">LinkedIn</Badge>
                            </div>
                            <div className="text-gray-600">12/01/2024</div>
                            <div className="font-medium">5.2K</div>
                            <div className="text-green-600 font-medium">10.2%</div>
                            <div>
                              <Badge className="bg-green-100 text-green-700">Tốt</Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-6 gap-4 p-3 border rounded-lg text-sm">
                            <div className="font-medium">Product announcement</div>
                            <div>
                              <Badge className="bg-gray-100 text-gray-700">Twitter</Badge>
                            </div>
                            <div className="text-gray-600">10/01/2024</div>
                            <div className="font-medium">1.8K</div>
                            <div className="text-red-600 font-medium">1.2%</div>
                            <div>
                              <Badge className="bg-red-100 text-red-700">Cần cải thiện</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Type Performance */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Hiệu suất theo loại nội dung</CardTitle>
                        <CardDescription>So sánh engagement rate giữa các loại nội dung</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Video content</span>
                            <div className="flex items-center space-x-3">
                              <Progress value={92} className="w-24" />
                              <span className="text-sm font-medium">9.2%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Image posts</span>
                            <div className="flex items-center space-x-3">
                              <Progress value={85} className="w-24" />
                              <span className="text-sm font-medium">8.5%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Text posts</span>
                            <div className="flex items-center space-x-3">
                              <Progress value={76} className="w-24" />
                              <span className="text-sm font-medium">7.6%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Link shares</span>
                            <div className="flex items-center space-x-3">
                              <Progress value={64} className="w-24" />
                              <span className="text-sm font-medium">6.4%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Thời gian đăng bài tối ưu</CardTitle>
                        <CardDescription>Engagement rate theo giờ trong ngày</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">9:00 - 11:00 AM</span>
                            <div className="flex items-center space-x-3">
                              <Progress value={94} className="w-24" />
                              <span className="text-sm font-medium text-green-600">Cao nhất</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">2:00 - 4:00 PM</span>
                            <div className="flex items-center space-x-3">
                              <Progress value={88} className="w-24" />
                              <span className="text-sm font-medium text-green-600">Tốt</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">7:00 - 9:00 PM</span>
                            <div className="flex items-center space-x-3">
                              <Progress value={82} className="w-24" />
                              <span className="text-sm font-medium text-blue-600">Trung bình</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">11:00 PM - 6:00 AM</span>
                            <div className="flex items-center space-x-3">
                              <Progress value={45} className="w-24" />
                              <span className="text-sm font-medium text-red-600">Thấp</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Platform Performance Tab */}
              <TabsContent value="platforms">
                <div className="space-y-8">
                  <h3 className="text-xl font-semibold">Hiệu suất theo nền tảng</h3>

                  {/* Platform Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Facebook</CardTitle>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">f</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">8.5%</div>
                        <p className="text-xs text-muted-foreground">Engagement rate</p>
                        <div className="mt-2">
                          <Progress value={85} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Instagram</CardTitle>
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">IG</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">9.2%</div>
                        <p className="text-xs text-muted-foreground">Engagement rate</p>
                        <div className="mt-2">
                          <Progress value={92} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">LinkedIn</CardTitle>
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">in</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">7.6%</div>
                        <p className="text-xs text-muted-foreground">Engagement rate</p>
                        <div className="mt-2">
                          <Progress value={76} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">TikTok</CardTitle>
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">TT</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">12.4%</div>
                        <p className="text-xs text-muted-foreground">Engagement rate</p>
                        <div className="mt-2">
                          <Progress value={94} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Platform Analysis */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Chi tiết hiệu suất nền tảng</CardTitle>
                        <CardDescription>Thống kê đầy đủ cho từng nền tảng</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">f</span>
                                </div>
                                <span className="font-medium">Facebook</span>
                              </div>
                              <Badge className="bg-green-100 text-green-700">Tốt</Badge>
                            </div>
                            <div className="ml-11 grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="font-medium">45.2K</div>
                                <div className="text-gray-600">Reach</div>
                              </div>
                              <div>
                                <div className="font-medium">3.8K</div>
                                <div className="text-gray-600">Engagement</div>
                              </div>
                              <div>
                                <div className="font-medium">8.5%</div>
                                <div className="text-gray-600">Rate</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">IG</span>
                                </div>
                                <span className="font-medium">Instagram</span>
                              </div>
                              <Badge className="bg-green-100 text-green-700">Xuất sắc</Badge>
                            </div>
                            <div className="ml-11 grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="font-medium">38.7K</div>
                                <div className="text-gray-600">Reach</div>
                              </div>
                              <div>
                                <div className="font-medium">3.6K</div>
                                <div className="text-gray-600">Engagement</div>
                              </div>
                              <div>
                                <div className="font-medium">9.2%</div>
                                <div className="text-gray-600">Rate</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">in</span>
                                </div>
                                <span className="font-medium">LinkedIn</span>
                              </div>
                              <Badge className="bg-blue-100 text-blue-700">Trung bình</Badge>
                            </div>
                            <div className="ml-11 grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="font-medium">22.1K</div>
                                <div className="text-gray-600">Reach</div>
                              </div>
                              <div>
                                <div className="font-medium">1.7K</div>
                                <div className="text-gray-600">Engagement</div>
                              </div>
                              <div>
                                <div className="font-medium">7.6%</div>
                                <div className="text-gray-600">Rate</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Xu hướng theo nền tảng</CardTitle>
                        <CardDescription>Sự thay đổi hiệu suất 30 ngày qua</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">TT</span>
                              </div>
                              <div>
                                <div className="font-medium">TikTok</div>
                                <div className="text-sm text-gray-600">Tăng trưởng mạnh</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-green-600 font-medium flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                +45%
                              </div>
                              <div className="text-sm text-gray-600">Engagement</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">IG</span>
                              </div>
                              <div>
                                <div className="font-medium">Instagram</div>
                                <div className="text-sm text-gray-600">Tăng trưởng ổn định</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-green-600 font-medium flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                +18%
                              </div>
                              <div className="text-sm text-gray-600">Engagement</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">X</span>
                              </div>
                              <div>
                                <div className="font-medium">Twitter</div>
                                <div className="text-sm text-gray-600">Giảm nhẹ</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-red-600 font-medium flex items-center">
                                <TrendingDown className="w-4 h-4 mr-1" />
                                -8%
                              </div>
                              <div className="text-sm text-gray-600">Engagement</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Audience Tab */}
              <TabsContent value="audience">
                <div className="space-y-8">
                  <h3 className="text-xl font-semibold">Phân tích audience</h3>

                  {/* Audience Demographics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Users className="w-5 h-5 mr-2 text-blue-600" />
                          Độ tuổi
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">18-24</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={25} className="w-16" />
                              <span className="text-sm font-medium">25%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">25-34</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={45} className="w-16" />
                              <span className="text-sm font-medium">45%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">35-44</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={20} className="w-16" />
                              <span className="text-sm font-medium">20%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">45+</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={10} className="w-16" />
                              <span className="text-sm font-medium">10%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Globe className="w-5 h-5 mr-2 text-green-600" />
                          Vị trí địa lý
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Hồ Chí Minh</span>
                            <span className="text-sm font-medium">35%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Hà Nội</span>
                            <span className="text-sm font-medium">28%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Đà Nẵng</span>
                            <span className="text-sm font-medium">12%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Khác</span>
                            <span className="text-sm font-medium">25%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-purple-600" />
                          Thời gian hoạt động
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Sáng (6-12h)</span>
                            <span className="text-sm font-medium">30%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Chiều (12-18h)</span>
                            <span className="text-sm font-medium">45%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Tối (18-24h)</span>
                            <span className="text-sm font-medium">25%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Audience Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Insights về audience</CardTitle>
                      <CardDescription>Phân tích sâu về hành vi và sở thích của audience</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold mb-4">Sở thích chính</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Badge className="bg-blue-100 text-blue-700">Công nghệ</Badge>
                              <span className="text-sm">68% audience quan tâm</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge className="bg-green-100 text-green-700">Marketing</Badge>
                              <span className="text-sm">54% audience quan tâm</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge className="bg-purple-100 text-purple-700">Khởi nghiệp</Badge>
                              <span className="text-sm">42% audience quan tâm</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge className="bg-orange-100 text-orange-700">Đầu tư</Badge>
                              <span className="text-sm">38% audience quan tâm</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-4">Hành vi tương tác</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Thích comment</span>
                              <span className="text-sm font-medium">72%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Chia sẻ nội dung</span>
                              <span className="text-sm font-medium">45%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Click vào link</span>
                              <span className="text-sm font-medium">38%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Xem video đến cuối</span>
                              <span className="text-sm font-medium">62%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Báo cáo chi tiết</h3>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                      <Download className="w-4 h-4 mr-2" />
                      Tạo báo cáo mới
                    </Button>
                  </div>

                  {/* Report Templates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-blue-100 text-blue-700">Hàng tuần</Badge>
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">Báo cáo tuần</CardTitle>
                        <CardDescription>Tổng quan hiệu suất 7 ngày qua</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Bài viết:</span>
                            <span className="font-medium">12</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tổng reach:</span>
                            <span className="font-medium">45.2K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Engagement:</span>
                            <span className="font-medium text-green-600">+15%</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4 bg-transparent" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Tải báo cáo
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-green-100 text-green-700">Hàng tháng</Badge>
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">Báo cáo tháng</CardTitle>
                        <CardDescription>Phân tích chi tiết 30 ngày qua</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Bài viết:</span>
                            <span className="font-medium">52</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tổng reach:</span>
                            <span className="font-medium">186K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Engagement:</span>
                            <span className="font-medium text-green-600">+22%</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4 bg-transparent" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Tải báo cáo
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-purple-100 text-purple-700">Tùy chỉnh</Badge>
                          <Target className="w-5 h-5 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">Báo cáo tùy chỉnh</CardTitle>
                        <CardDescription>Tạo báo cáo theo yêu cầu riêng</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>• Chọn khoảng thời gian</div>
                          <div>• Chọn metrics cần thiết</div>
                          <div>• Chọn nền tảng</div>
                          <div>• Xuất nhiều định dạng</div>
                        </div>
                        <Button className="w-full mt-4">
                          <Plus className="w-4 h-4 mr-2" />
                          Tạo báo cáo
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Reports */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Báo cáo gần đây</CardTitle>
                      <CardDescription>Các báo cáo đã tạo trong thời gian qua</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <BarChart3 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Báo cáo hiệu suất tháng 1/2024</h4>
                              <p className="text-sm text-gray-600">Tạo ngày 01/02/2024 • PDF, 15 trang</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Phân tích competitor Q4/2023</h4>
                              <p className="text-sm text-gray-600">Tạo ngày 28/01/2024 • Excel, 8 sheets</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Báo cáo ROI campaign</h4>
                              <p className="text-sm text-gray-600">Đang tạo • Ước tính 5 phút nữa</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-orange-100 text-orange-700">Đang xử lý</Badge>
                            <Button size="sm" variant="outline" disabled>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  AI Insights & Recommendations
                </CardTitle>
                <CardDescription>AI phân tích dữ liệu và đưa ra gợi ý cải thiện hiệu suất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Điểm mạnh
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                        <span>Video content có engagement rate cao nhất (9.2%)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                        <span>Thời gian đăng bài 9-11h AM hiệu quả nhất</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                        <span>Instagram và TikTok có tăng trưởng mạnh</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-orange-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Cần cải thiện
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                        <span>Twitter engagement giảm 8% so với tháng trước</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                        <span>Conversion rate cần tối ưu (hiện tại 3.2%)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                        <span>Cần tăng tần suất đăng bài vào cuối tuần</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-blue-600" />
                    Gợi ý hành động
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium mb-1">Tăng video content</div>
                      <div className="text-gray-600">Tạo thêm 2-3 video/tuần để tận dụng engagement cao</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Tối ưu Twitter strategy</div>
                      <div className="text-gray-600">Thay đổi content format và thời gian đăng</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">A/B test CTA</div>
                      <div className="text-gray-600">Thử nghiệm các CTA khác nhau để tăng conversion</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Lên lịch cuối tuần</div>
                      <div className="text-gray-600">Thêm nội dung cho thứ 7, chủ nhật</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tối ưu hiệu suất với AI Analytics</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Theo dõi, phân tích và cải thiện hiệu quả marketing với insights từ AI thông minh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
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
    </div>
  )
}
