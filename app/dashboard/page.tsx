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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Brain,
  Calendar,
  BarChart3,
  Bot,
  Plus,
  TrendingUp,
  Users,
  MessageSquare,
  Video,
  ImageIcon,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Heart,
  MessageCircle,
  Play,
  Edit,
  Home,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="lg:block hidden text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Marketing Engine
              </span>
              <span className="lg:hidden text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AIME
              </span>
            </div>
            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/brand-analysis" className="flex items-center">
                      <Home className="w-4 h-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="font-medium">Dashboard</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Tìm kiếm..." className="pl-10 w-64" />
            </div>
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen p-6">
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start bg-blue-50 text-blue-600"
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              Tổng quan
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Brain className="w-4 h-4 mr-3" />
              Phân tích thương hiệu
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-3" />
              Lịch đăng bài
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <MessageSquare className="w-4 h-4 mr-3" />
              Nội dung
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Bot className="w-4 h-4 mr-3" />
              AI Avatar
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="w-4 h-4 mr-3" />
              Audience
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-3" />
              Báo cáo
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Chào mừng trở lại! Đây là tổng quan về hoạt động marketing của
              bạn.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng bài viết
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> so với tháng
                  trước
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng lượt xem
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2M</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+25%</span> so với tháng
                  trước
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Engagement Rate
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.4%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2.1%</span> so với tháng
                  trước
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Followers mới
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2,350</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+18%</span> so với tháng
                  trước
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="content">Nội dung</TabsTrigger>
              <TabsTrigger value="analytics">Phân tích</TabsTrigger>
              <TabsTrigger value="ai-avatar">AI Avatar</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Brand Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-blue-600" />
                      Phân tích thương hiệu
                    </CardTitle>
                    <CardDescription>
                      Kết quả phân tích chân dung thương hiệu của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tính chuyên nghiệp</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={85} className="w-20" />
                          <span className="text-sm font-medium">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tính thân thiện</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={92} className="w-20" />
                          <span className="text-sm font-medium">92%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tính sáng tạo</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={78} className="w-20" />
                          <span className="text-sm font-medium">78%</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-transparent" variant="outline">
                      <Brain className="w-4 h-4 mr-2" />
                      Phân tích lại
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-green-600" />
                      Nội dung gần đây
                    </CardTitle>
                    <CardDescription>
                      Các bài viết được tạo và đăng gần đây
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            5 Tips Marketing hiệu quả
                          </div>
                          <div className="text-xs text-gray-600">
                            Facebook • 2 giờ trước
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          1.2K views
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            Video giới thiệu sản phẩm
                          </div>
                          <div className="text-xs text-gray-600">
                            Instagram • 4 giờ trước
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          856 views
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            Bài viết chuyên sâu
                          </div>
                          <div className="text-xs text-gray-600">
                            LinkedIn • 6 giờ trước
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          432 views
                        </Badge>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4 bg-transparent"
                      variant="outline"
                    >
                      Xem tất cả
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Posts */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                        Lịch đăng bài sắp tới
                      </CardTitle>
                      <CardDescription>
                        Các bài viết đã được lên lịch đăng
                      </CardDescription>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm bài viết
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Xu hướng Marketing 2024
                          </h4>
                          <p className="text-sm text-gray-600">
                            Facebook, Instagram • Hôm nay 2:00 PM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Đang chờ</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Video className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Video hướng dẫn sử dụng
                          </h4>
                          <p className="text-sm text-gray-600">
                            YouTube, TikTok • Ngày mai 10:00 AM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Lên lịch</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Quản lý nội dung</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Lọc
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo nội dung mới
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Content Item 1 */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Facebook</Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="font-medium mb-2">
                      5 Tips Marketing hiệu quả cho SME
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Chia sẻ những bí quyết marketing hiệu quả dành cho doanh
                      nghiệp vừa và nhỏ...
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          1.2K
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          89
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          23
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Đã đăng
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Item 2 */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-pink-100 text-pink-700"
                      >
                        Instagram
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gradient-to-br from-pink-100 to-orange-100 rounded-lg mb-3 flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="font-medium mb-2">
                      Behind the scenes - Quy trình sản xuất
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Video hậu trường cho thấy quy trình sản xuất chuyên nghiệp
                      của công ty...
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          856
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          124
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          31
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Đã đăng
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Item 3 */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700"
                      >
                        LinkedIn
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg mb-3 flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="font-medium mb-2">
                      Xu hướng công nghệ 2024
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Phân tích sâu về những xu hướng công nghệ sẽ định hình
                      tương lai...
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          432
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          67
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          18
                        </span>
                      </div>
                      <Badge className="text-xs bg-orange-100 text-orange-700">
                        Đang chờ
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hiệu suất theo nền tảng</CardTitle>
                    <CardDescription>
                      So sánh engagement rate trên các nền tảng
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              f
                            </span>
                          </div>
                          <span className="font-medium">Facebook</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={85} className="w-24" />
                          <span className="text-sm font-medium">8.5%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              IG
                            </span>
                          </div>
                          <span className="font-medium">Instagram</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={92} className="w-24" />
                          <span className="text-sm font-medium">9.2%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              in
                            </span>
                          </div>
                          <span className="font-medium">LinkedIn</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={76} className="w-24" />
                          <span className="text-sm font-medium">7.6%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              TT
                            </span>
                          </div>
                          <span className="font-medium">TikTok</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={94} className="w-24" />
                          <span className="text-sm font-medium">9.4%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Thống kê tháng này</CardTitle>
                    <CardDescription>
                      Tổng quan hiệu suất nội dung
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          247
                        </div>
                        <div className="text-sm text-gray-600">Bài viết</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          1.2M
                        </div>
                        <div className="text-sm text-gray-600">Lượt xem</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          89K
                        </div>
                        <div className="text-sm text-gray-600">Tương tác</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          2.3K
                        </div>
                        <div className="text-sm text-gray-600">
                          Followers mới
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Top bài viết hiệu suất cao</CardTitle>
                      <CardDescription>
                        Những bài viết có engagement rate cao nhất
                      </CardDescription>
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Xuất báo cáo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            5 Tips Marketing hiệu quả cho SME
                          </h4>
                          <p className="text-sm text-gray-600">
                            Facebook • 2 ngày trước
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">12.4%</div>
                        <div className="text-sm text-gray-600">Engagement</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Behind the scenes - Quy trình sản xuất
                          </h4>
                          <p className="text-sm text-gray-600">
                            Instagram • 1 ngày trước
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">11.8%</div>
                        <div className="text-sm text-gray-600">Engagement</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Infographic: Xu hướng Digital 2024
                          </h4>
                          <p className="text-sm text-gray-600">
                            LinkedIn • 3 ngày trước
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">10.2%</div>
                        <div className="text-sm text-gray-600">Engagement</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-avatar" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">AI Avatar & Chatbot</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo Avatar mới
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Avatar 1 */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Sarah - Brand Ambassador
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-700">
                        Hoạt động
                      </Badge>
                    </div>
                    <CardDescription>
                      AI Avatar chính đại diện thương hiệu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center">
                      <Bot className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Tương tác hôm nay</span>
                        <span className="font-medium">1,247</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Độ hài lòng</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Ngôn ngữ</span>
                        <span className="font-medium">Tiếng Việt, English</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Avatar 2 */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Alex - Support Agent
                      </CardTitle>
                      <Badge variant="outline">Tạm dừng</Badge>
                    </div>
                    <CardDescription>
                      AI Chatbot hỗ trợ khách hàng
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-xl mb-4 flex items-center justify-center">
                      <MessageSquare className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Tương tác hôm nay</span>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Độ hài lòng</span>
                        <span className="font-medium">91%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Chuyên môn</span>
                        <span className="font-medium">Customer Support</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Kích hoạt
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Create New Avatar */}
                <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                  <CardContent className="flex flex-col items-center justify-center h-full p-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-medium mb-2">Tạo AI Avatar mới</h3>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Tạo AI Avatar hoặc Chatbot mới để đại diện thương hiệu
                    </p>
                    <Button className="w-full">Bắt đầu tạo</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Avatar Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Hiệu suất AI Avatar</CardTitle>
                  <CardDescription>
                    Thống kê tương tác và hiệu quả của các AI Avatar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        1,247
                      </div>
                      <div className="text-sm text-gray-600">
                        Tương tác hôm nay
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        +15% so với hôm qua
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        94%
                      </div>
                      <div className="text-sm text-gray-600">
                        Độ hài lòng trung bình
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        +2% so với tuần trước
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        89%
                      </div>
                      <div className="text-sm text-gray-600">
                        Tỷ lệ giải quyết
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        +5% so với tuần trước
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
