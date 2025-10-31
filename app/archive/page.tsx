"use client"

import { useEffect, useState } from "react"
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
  const [drafts, setDrafts] = useState<Array<{ id: string; title: string; content: string; createdAt: string }>>([])
  const [loadingDrafts, setLoadingDrafts] = useState(false)

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        setLoadingDrafts(true)
        const res = await fetch("/api/drafts?take=20")
        const json = await res.json()
        if (json?.success) {
          setDrafts(json.data.items)
        }
      } catch (e) {
        console.error("Failed to load drafts", e)
      } finally {
        setLoadingDrafts(false)
      }
    }
    loadDrafts()
  }, [])

  // No mock dataset: sections without real data will show N/A

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

  const onRefresh = () => {
    // Simple refresh: in the future, switch to re-fetching state only
    window.location.reload()
  }

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
              <Button variant="outline" onClick={onRefresh}>
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
                <div className="text-2xl font-bold">N/A</div>
                <p className="text-xs text-muted-foreground">Chưa có dữ liệu thực</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã xuất bản</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">N/A</div>
                <p className="text-xs text-muted-foreground">Chưa có dữ liệu thực</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">N/A</div>
                <p className="text-xs text-muted-foreground">Chưa có dữ liệu thực</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement TB</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">N/A</div>
                <p className="text-xs text-muted-foreground">Chưa có dữ liệu thực</p>
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
            <TabsTrigger value="all">Tất cả (N/A)</TabsTrigger>
            <TabsTrigger value="published">Đã xuất bản (N/A)</TabsTrigger>
            <TabsTrigger value="draft">Bản nháp ({loadingDrafts ? "…" : drafts.length})</TabsTrigger>
            <TabsTrigger value="high-performance">Hiệu suất cao (N/A)</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          </TabsList>

          {/* All Content Tab */}
          <TabsContent value="all" className="space-y-6">
            <div className="bg-white rounded-lg border p-6 text-sm text-gray-600">
              N/A — Chưa tích hợp dữ liệu thực cho mục này
            </div>
          </TabsContent>

          {/* Published Content Tab */}
          <TabsContent value="published" className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Nội dung đã xuất bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-sm text-gray-600">N/A — Chưa có dữ liệu xuất bản</CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Draft Content Tab */}
          <TabsContent value="draft" className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Bản nháp</h3>
              {loadingDrafts ? (
                <div className="text-sm text-gray-500">Đang tải bản nháp…</div>
              ) : drafts.length === 0 ? (
                <div className="text-sm text-gray-500">Chưa có bản nháp nào</div>
              ) : (
                <div className="space-y-4">
                  {drafts.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getTypeIcon("social")}
                        </div>
                        <div>
                          <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                          <div className="text-sm text-gray-600">{new Date(item.createdAt).toLocaleDateString("vi-VN")}</div>
                          <div className="text-xs text-gray-500">Nền tảng: N/A • Hashtags: N/A</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => navigator.clipboard?.writeText(item.content)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Link href={`/archive/${item.id}`}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </Button>
                        </Link>
                        <Button size="sm">
                          <Globe className="w-4 h-4 mr-2" />
                          Xuất bản
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* High Performance Tab */}
          <TabsContent value="high-performance" className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Nội dung hiệu suất cao</h3>
              <div className="p-4 text-sm text-gray-600">N/A — Chưa có dữ liệu hiệu suất</div>
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
                  <div className="text-2xl font-bold">N/A</div>
                  <p className="text-xs text-muted-foreground">Chưa có dữ liệu thực</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement TB</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">N/A</div>
                  <p className="text-xs text-muted-foreground">Chưa có dữ liệu thực</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Shares</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">N/A</div>
                  <p className="text-xs text-muted-foreground">Chưa có dữ liệu thực</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Comments</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">N/A</div>
                  <p className="text-xs text-muted-foreground">Chưa có dữ liệu thực</p>
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
                <div className="h-40 bg-white rounded-lg border flex items-center justify-center text-sm text-gray-600">
                  N/A — Chưa có dữ liệu phân tích
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
                  <div className="text-sm text-gray-600">N/A — Chưa có dữ liệu loại nội dung</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Tags</CardTitle>
                  <CardDescription>Tags được sử dụng nhiều nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">N/A — Chưa có dữ liệu thẻ (tags)</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* No pagination for now; will add when backend exposes totals */}
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">Bản nháp: {loadingDrafts ? "…" : drafts.length}</div>
          <div className="text-xs text-gray-500">Các mục khác: N/A</div>
        </div>
      </div>
    </div>
  )
}
