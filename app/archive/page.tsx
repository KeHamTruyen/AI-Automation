"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Search,
  Filter,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Download,
  MoreHorizontal,
  FileText,
  ImageIcon,
  Video,
  Mail,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Globe,
  Archive,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  SortAsc,
  SortDesc,
  Grid,
  List,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

export default function ArchivePage() {
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [activeTab, setActiveTab] = useState("all")

  const contentItems = [
    {
      id: 1,
      title: "5 Tips Marketing hiệu quả cho SME",
      type: "blog",
      platform: ["Website", "LinkedIn"],
      publishDate: "2024-01-13",
      status: "published",
      views: 12400,
      engagement: 12.4,
      likes: 156,
      comments: 23,
      shares: 45,
      thumbnail: "/placeholder.svg?height=200&width=300&text=Blog+Post",
      tags: ["Marketing", "SME", "Tips"],
      author: "Admin User",
      performance: "excellent",
    },
    {
      id: 2,
      title: "Behind the scenes - Quy trình sản xuất",
      type: "video",
      platform: ["Instagram", "YouTube"],
      publishDate: "2024-01-14",
      status: "published",
      views: 8700,
      engagement: 11.8,
      likes: 324,
      comments: 67,
      shares: 89,
      thumbnail: "/placeholder.svg?height=200&width=300&text=Video+Content",
      tags: ["Behind the scenes", "Production"],
      author: "Marketing Team",
      performance: "good",
    },
    {
      id: 3,
      title: "Xu hướng công nghệ 2024",
      type: "article",
      platform: ["LinkedIn", "Medium"],
      publishDate: "2024-01-12",
      status: "published",
      views: 5200,
      engagement: 10.2,
      likes: 89,
      comments: 12,
      shares: 34,
      thumbnail: "/placeholder.svg?height=200&width=300&text=Tech+Trends",
      tags: ["Technology", "Trends", "2024"],
      author: "Content Writer",
      performance: "good",
    },
    {
      id: 4,
      title: "Product announcement",
      type: "social",
      platform: ["Twitter", "Facebook"],
      publishDate: "2024-01-10",
      status: "published",
      views: 1800,
      engagement: 1.2,
      likes: 12,
      comments: 3,
      shares: 5,
      thumbnail: "/placeholder.svg?height=200&width=300&text=Product+News",
      tags: ["Product", "Announcement"],
      author: "Marketing Team",
      performance: "poor",
    },
    {
      id: 5,
      title: "Weekly Newsletter #15",
      type: "email",
      platform: ["Email"],
      publishDate: "2024-01-08",
      status: "published",
      views: 2500,
      engagement: 2.8,
      likes: 0,
      comments: 0,
      shares: 0,
      thumbnail: "/placeholder.svg?height=200&width=300&text=Newsletter",
      tags: ["Newsletter", "Weekly"],
      author: "Admin User",
      performance: "poor",
    },
    {
      id: 6,
      title: "AI Marketing Strategy Guide",
      type: "blog",
      platform: ["Website", "LinkedIn"],
      publishDate: "2024-01-15",
      status: "draft",
      views: 0,
      engagement: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      thumbnail: "/placeholder.svg?height=200&width=300&text=AI+Guide",
      tags: ["AI", "Marketing", "Strategy"],
      author: "Content Writer",
      performance: "draft",
    },
  ]

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "bg-green-100 text-green-700"
      case "good":
        return "bg-blue-100 text-blue-700"
      case "poor":
        return "bg-red-100 text-red-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blog":
      case "article":
        return <FileText className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      case "social":
        return <ImageIcon className="w-4 h-4" />
      case "email":
        return <Mail className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const filteredContent = contentItems.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "published") return item.status === "published"
    if (activeTab === "draft") return item.status === "draft"
    if (activeTab === "high-performance") return item.performance === "excellent"
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="hidden md:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Link href="/cms">
                <Button variant="ghost" size="sm">
                  Content CMS
                </Button>
              </Link>
              <Link href="/content-creation">
                <Button variant="ghost" size="sm">
                  Tạo nội dung
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="bg-white shadow-sm">
                Archive
              </Button>
            </div>
          </div>
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Content Archive</h1>
              <p className="text-gray-600">Quản lý và tìm kiếm tất cả nội dung đã tạo</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Xuất dữ liệu
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng nội dung</CardTitle>
                <Archive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12</span> trong tháng này
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã xuất bản</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">189</div>
                <p className="text-xs text-muted-foreground">76% tổng nội dung</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2M</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+25%</span> so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement TB</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.4%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2.1%</span> so với tháng trước
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Tìm kiếm nội dung..." className="pl-10" />
              </div>

              <Select defaultValue="all-types">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">Tất cả loại</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-platforms">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-platforms">Tất cả nền tảng</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-time">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">Tất cả thời gian</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="quarter">Quý này</SelectItem>
                  <SelectItem value="year">Năm này</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Lọc nâng cao
              </Button>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="w-8 h-8 p-0"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="w-8 h-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Ngày tạo</SelectItem>
                  <SelectItem value="title">Tiêu đề</SelectItem>
                  <SelectItem value="views">Lượt xem</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="performance">Hiệu suất</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="w-8 h-8 p-0"
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Tất cả (247)</TabsTrigger>
            <TabsTrigger value="published">Đã xuất bản (189)</TabsTrigger>
            <TabsTrigger value="draft">Bản nháp (58)</TabsTrigger>
            <TabsTrigger value="high-performance">Hiệu suất cao (45)</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          </TabsList>

          {/* All Content Tab */}
          <TabsContent value="all" className="space-y-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredContent.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 opacity-50"></div>
                        <div className="relative z-10 text-center">
                          {getTypeIcon(item.type)}
                          <p className="text-sm text-gray-600 mt-2">{item.type.toUpperCase()}</p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-white/80">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge className={getPerformanceColor(item.performance)}>
                            {item.performance === "excellent" && "Xuất sắc"}
                            {item.performance === "good" && "Tốt"}
                            {item.performance === "poor" && "Cần cải thiện"}
                            {item.performance === "draft" && "Bản nháp"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{item.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.platform.map((platform) => (
                          <Badge key={platform} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{new Date(item.publishDate).toLocaleDateString("vi-VN")}</span>
                        <span>{item.author}</span>
                      </div>
                      {item.status === "published" && (
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium">{item.views.toLocaleString()}</div>
                            <div className="text-gray-500">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{item.engagement}%</div>
                            <div className="text-gray-500">Engagement</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{item.shares}</div>
                            <div className="text-gray-500">Shares</div>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{item.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm font-medium">Chọn tất cả</span>
                    <div className="flex items-center space-x-2 ml-auto">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Sao chép
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="divide-y">
                  {filteredContent.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <input type="checkbox" className="rounded" />
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                            <Badge className={getPerformanceColor(item.performance)} variant="secondary">
                              {item.performance === "excellent" && "Xuất sắc"}
                              {item.performance === "good" && "Tốt"}
                              {item.performance === "poor" && "Cần cải thiện"}
                              {item.performance === "draft" && "Bản nháp"}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{item.type.toUpperCase()}</span>
                            <span>{item.platform.join(", ")}</span>
                            <span>{new Date(item.publishDate).toLocaleDateString("vi-VN")}</span>
                            <span>{item.author}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {item.status === "published" && (
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="text-center">
                              <div className="font-medium">{item.views.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">Views</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium flex items-center">
                                {item.engagement}%
                                {item.engagement > 10 ? (
                                  <TrendingUp className="w-3 h-3 text-green-500 ml-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 text-red-500 ml-1" />
                                )}
                              </div>
                              <div className="text-xs text-gray-500">Engagement</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{item.shares}</div>
                              <div className="text-xs text-gray-500">Shares</div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Published Content Tab */}
          <TabsContent value="published" className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Nội dung đã xuất bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredContent
                  .filter((item) => item.status === "published")
                  .map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          {getTypeIcon(item.type)}
                          <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.platform.map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div>
                            <div className="font-medium">{item.views.toLocaleString()}</div>
                            <div className="text-gray-500">Views</div>
                          </div>
                          <div>
                            <div className="font-medium">{item.engagement}%</div>
                            <div className="text-gray-500">Engagement</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.publishDate).toLocaleDateString("vi-VN")}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Draft Content Tab */}
          <TabsContent value="draft" className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Bản nháp</h3>
              <div className="space-y-4">
                {filteredContent
                  .filter((item) => item.status === "draft")
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <div className="text-sm text-gray-600">
                            {item.type.toUpperCase()} • {new Date(item.publishDate).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </Button>
                        <Button size="sm">
                          <Globe className="w-4 h-4 mr-2" />
                          Xuất bản
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* High Performance Tab */}
          <TabsContent value="high-performance" className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Nội dung hiệu suất cao</h3>
              <div className="space-y-4">
                {filteredContent
                  .filter((item) => item.performance === "excellent")
                  .map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <div className="text-sm text-gray-600">
                            {item.platform.join(", ")} • {new Date(item.publishDate).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="font-bold text-green-600">{item.views.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-green-600">{item.engagement}%</div>
                          <div className="text-xs text-gray-600">Engagement</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Phân tích
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2M</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+25%</span> so với tháng trước
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement TB</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.4%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+2.1%</span> so với tháng trước
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Shares</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.3K</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+18%</span> so với tháng trước
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Comments</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">456</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+12%</span> so với tháng trước
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng hiệu suất</CardTitle>
                <CardDescription>Biểu đồ hiệu suất nội dung theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Biểu đồ phân tích hiệu suất</p>
                    <p className="text-sm text-gray-500 mt-2">Tích hợp với Chart.js để hiển thị dữ liệu thực tế</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Type Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hiệu suất theo loại nội dung</CardTitle>
                  <CardDescription>So sánh engagement rate giữa các loại nội dung</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Video className="w-4 h-4 text-red-600" />
                        <span className="font-medium">Video</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                        <span className="text-sm font-medium">9.2%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Blog</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                        <span className="text-sm font-medium">8.5%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">Social</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "76%" }}></div>
                        </div>
                        <span className="text-sm font-medium">7.6%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Email</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "64%" }}></div>
                        </div>
                        <span className="text-sm font-medium">6.4%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Tags</CardTitle>
                  <CardDescription>Tags được sử dụng nhiều nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Marketing</Badge>
                      <span className="text-sm font-medium">45 bài viết</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">AI</Badge>
                      <span className="text-sm font-medium">32 bài viết</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Technology</Badge>
                      <span className="text-sm font-medium">28 bài viết</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Tips</Badge>
                      <span className="text-sm font-medium">24 bài viết</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Trends</Badge>
                      <span className="text-sm font-medium">19 bài viết</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">Hiển thị 1-20 trong tổng số 247 nội dung</div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Trước
            </Button>
            <Button variant="outline" size="sm" className="bg-blue-600 text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <span className="text-gray-500">...</span>
            <Button variant="outline" size="sm">
              13
            </Button>
            <Button variant="outline" size="sm">
              Sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
