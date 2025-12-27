"use client"

import { useState } from "react"
import Nav from "@/components/Nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Calendar,
  Tag,
  Users,
  ImageIcon,
  Video,
  LinkIcon,
  Bold,
  Italic,
  Underline,
  List,
  Quote,
  Code,
  Table,
  Heading1,
  Heading2,
  Heading3,
  Save,
  Clock,
  Star,
  Archive,
  FolderPlus,
  Folder,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import NextLink from "next/link"

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState("editor")
  const [selectedContent, setSelectedContent] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState(new Set(["content", "drafts"]))

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Content CMS</h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Tạo mới
              </Button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Tìm kiếm nội dung..." className="pl-10" />
            </div>
          </div>

          {/* Content Tree */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {/* Workspace */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Folder className="w-4 h-4" />
                  <span>Workspace</span>
                </div>

                {/* Content Folder */}
                <div className="ml-2">
                  <div
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => toggleFolder("content")}
                  >
                    {expandedFolders.has("content") ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <Folder className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Nội dung đã xuất bản</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      24
                    </Badge>
                  </div>

                  {expandedFolders.has("content") && (
                    <div className="ml-6 space-y-1">
                      <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Blog Articles</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          12
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <ImageIcon className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">Social Posts</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          8
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <Video className="w-4 h-4 text-red-600" />
                        <span className="text-sm">Video Scripts</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          4
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Drafts Folder */}
                <div className="ml-2">
                  <div
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => toggleFolder("drafts")}
                  >
                    {expandedFolders.has("drafts") ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <Folder className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Bản nháp</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      7
                    </Badge>
                  </div>

                  {expandedFolders.has("drafts") && (
                    <div className="ml-6 space-y-1">
                      <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer bg-blue-50 border-l-2 border-blue-500">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">AI Marketing Trends 2024</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <ImageIcon className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">Social Media Strategy</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <Video className="w-4 h-4 text-red-600" />
                        <span className="text-sm">Product Demo Script</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Templates Folder */}
                <div className="ml-2">
                  <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                    <Folder className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Templates</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      15
                    </Badge>
                  </div>
                </div>

                {/* Archive Folder */}
                <div className="ml-2">
                  <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                    <Archive className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Archive</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      156
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <div className="text-sm font-medium text-gray-700 mb-2">Tạo nhanh</div>
                <div className="space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Bài viết blog
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Social post
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Video className="w-4 h-4 mr-2" />
                    Video script
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Thư mục mới
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            {/* Tab Navigation */}
            <div className="border-b bg-white px-6 py-3">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="settings">Cài đặt</TabsTrigger>
                  <TabsTrigger value="collaboration">Cộng tác</TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Đã lưu 2 phút trước
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Xem trước
                  </Button>
                  <Button size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Lưu
                  </Button>
                </div>
              </div>
            </div>

            {/* Editor Tab */}
            <TabsContent value="editor" className="flex-1 flex flex-col m-0">
              <div className="flex-1 flex">
                {/* Editor Toolbar */}
                <div className="w-16 bg-white border-r flex flex-col items-center py-4 space-y-2">
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <Heading1 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <Heading2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <Heading3 className="w-4 h-4" />
                  </Button>
                  <div className="w-8 h-px bg-gray-200 my-2" />
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <Underline className="w-4 h-4" />
                  </Button>
                  <div className="w-8 h-px bg-gray-200 my-2" />
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <Quote className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <Code className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <Table className="w-4 h-4" />
                  </Button>
                  <div className="w-8 h-px bg-gray-200 my-2" />
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                </div>

                {/* Editor Content */}
                <div className="flex-1 bg-white">
                  <div className="max-w-4xl mx-auto p-8">
                    {/* Document Header */}
                    <div className="mb-8">
                      <Input
                        placeholder="Tiêu đề không có tên"
                        className="text-3xl font-bold border-none p-0 focus-visible:ring-0 placeholder:text-gray-400"
                        defaultValue="AI Marketing Trends 2024: Tương lai của Digital Marketing"
                      />
                      <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Tạo ngày 15/01/2024</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Tác giả: Admin</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4" />
                          <span>AI, Marketing, Trends</span>
                        </div>
                      </div>
                    </div>

                    {/* Editor Content Area */}
                    <div className="space-y-6">
                      {/* Block 1: Heading */}
                      <div className="group relative">
                        <div className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <h2 className="text-2xl font-semibold mb-4">Giới thiệu về AI Marketing</h2>
                      </div>

                      {/* Block 2: Paragraph */}
                      <div className="group relative">
                        <div className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          Trí tuệ nhân tạo (AI) đang cách mạng hóa ngành marketing, mang đến những cơ hội chưa từng có
                          cho các doanh nghiệp trong việc tiếp cận và tương tác với khách hàng. Từ việc cá nhân hóa trải
                          nghiệm người dùng đến tự động hóa quy trình marketing, AI đã trở thành công cụ không thể thiếu
                          trong chiến lược marketing hiện đại.
                        </p>
                      </div>

                      {/* Block 3: Image */}
                      <div className="group relative">
                        <div className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 text-center">
                          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Hình ảnh minh họa về AI Marketing</p>
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            Thêm hình ảnh
                          </Button>
                        </div>
                      </div>

                      {/* Block 4: List */}
                      <div className="group relative">
                        <div className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-3">Xu hướng AI Marketing năm 2024</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start space-x-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>Chatbot thông minh với khả năng hiểu ngữ cảnh</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>Cá nhân hóa nội dung theo thời gian thực</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>Dự đoán hành vi khách hàng với Machine Learning</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>Tự động hóa email marketing thông minh</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Block 5: Quote */}
                      <div className="group relative">
                        <div className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
                          <p className="text-lg italic text-gray-700 mb-2">
                            "AI không thay thế marketer, nhưng marketer sử dụng AI sẽ thay thế những marketer không sử
                            dụng AI."
                          </p>
                          <cite className="text-sm text-gray-600">- Chuyên gia Marketing Digital</cite>
                        </blockquote>
                      </div>

                      {/* Add New Block */}
                      <div className="group relative">
                        <div className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 cursor-pointer py-4">
                          <Plus className="w-4 h-4" />
                          <span className="text-sm">Thêm block mới</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Properties Panel */}
                <div className="w-80 bg-gray-50 border-l p-6">
                  <h3 className="font-semibold mb-4">Thuộc tính</h3>
                  <div className="space-y-6">
                    {/* Content Type */}
                    <div className="space-y-2">
                      <Label>Loại nội dung</Label>
                      <Select defaultValue="blog-article">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog-article">Blog Article</SelectItem>
                          <SelectItem value="social-post">Social Post</SelectItem>
                          <SelectItem value="video-script">Video Script</SelectItem>
                          <SelectItem value="email-template">Email Template</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label>Trạng thái</Label>
                      <Select defaultValue="draft">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Bản nháp</SelectItem>
                          <SelectItem value="review">Đang review</SelectItem>
                          <SelectItem value="approved">Đã duyệt</SelectItem>
                          <SelectItem value="published">Đã xuất bản</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <Input placeholder="Thêm tags..." />
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">AI</Badge>
                        <Badge variant="secondary">Marketing</Badge>
                        <Badge variant="secondary">Trends</Badge>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label>Danh mục</Label>
                      <Select defaultValue="technology">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Công nghệ</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="business">Kinh doanh</SelectItem>
                          <SelectItem value="trends">Xu hướng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Publish Date */}
                    <div className="space-y-2">
                      <Label>Ngày xuất bản</Label>
                      <Input type="datetime-local" />
                    </div>

                    {/* SEO Settings */}
                    <div className="space-y-4">
                      <h4 className="font-medium">SEO Settings</h4>
                      <div className="space-y-2">
                        <Label>Meta Title</Label>
                        <Input placeholder="SEO title..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Meta Description</Label>
                        <Textarea placeholder="SEO description..." rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label>Focus Keyword</Label>
                        <Input placeholder="AI marketing..." />
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Social Media</h4>
                      <div className="space-y-2">
                        <Label>Social Title</Label>
                        <Input placeholder="Title for social sharing..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Social Description</Label>
                        <Textarea placeholder="Description for social sharing..." rows={2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="flex-1 m-0">
              <div className="bg-white h-full overflow-y-auto">
                <div className="max-w-4xl mx-auto p-8">
                  <article className="prose prose-lg max-w-none">
                    <header className="mb-8">
                      <h1 className="text-4xl font-bold mb-4">
                        AI Marketing Trends 2024: Tương lai của Digital Marketing
                      </h1>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                        <span>Ngày 15/01/2024</span>
                        <span>•</span>
                        <span>Tác giả: Admin</span>
                        <span>•</span>
                        <span>5 phút đọc</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">AI</Badge>
                        <Badge variant="outline">Marketing</Badge>
                        <Badge variant="outline">Trends</Badge>
                      </div>
                    </header>

                    <h2>Giới thiệu về AI Marketing</h2>
                    <p>
                      Trí tuệ nhân tạo (AI) đang cách mạng hóa ngành marketing, mang đến những cơ hội chưa từng có cho
                      các doanh nghiệp trong việc tiếp cận và tương tác với khách hàng. Từ việc cá nhân hóa trải nghiệm
                      người dùng đến tự động hóa quy trình marketing, AI đã trở thành công cụ không thể thiếu trong
                      chiến lược marketing hiện đại.
                    </p>

                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 text-center my-8">
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Hình ảnh minh họa về AI Marketing</p>
                    </div>

                    <h3>Xu hướng AI Marketing năm 2024</h3>
                    <ul>
                      <li>Chatbot thông minh với khả năng hiểu ngữ cảnh</li>
                      <li>Cá nhân hóa nội dung theo thời gian thực</li>
                      <li>Dự đoán hành vi khách hàng với Machine Learning</li>
                      <li>Tự động hóa email marketing thông minh</li>
                    </ul>

                    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg my-8">
                      <p className="text-lg italic mb-2">
                        "AI không thay thế marketer, nhưng marketer sử dụng AI sẽ thay thế những marketer không sử dụng
                        AI."
                      </p>
                      <cite className="text-sm text-gray-600">- Chuyên gia Marketing Digital</cite>
                    </blockquote>
                  </article>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="flex-1 m-0">
              <div className="bg-white h-full overflow-y-auto p-8">
                <div className="max-w-2xl mx-auto space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Cài đặt nội dung</h2>
                    <p className="text-gray-600">Quản lý cài đặt và quyền truy cập cho nội dung này</p>
                  </div>

                  {/* Publishing Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Cài đặt xuất bản</CardTitle>
                      <CardDescription>Cấu hình cách thức xuất bản nội dung</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nền tảng xuất bản</Label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" defaultChecked />
                            <span className="text-sm">Website/Blog</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Facebook</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">LinkedIn</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Medium</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Tự động xuất bản</Label>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm">Tự động xuất bản khi được duyệt</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Access Control */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Kiểm soát truy cập</CardTitle>
                      <CardDescription>Quản lý ai có thể xem và chỉnh sửa nội dung</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Quyền xem</Label>
                        <Select defaultValue="team">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private">Chỉ mình tôi</SelectItem>
                            <SelectItem value="team">Team</SelectItem>
                            <SelectItem value="organization">Tổ chức</SelectItem>
                            <SelectItem value="public">Công khai</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Quyền chỉnh sửa</Label>
                        <Select defaultValue="editors">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Chỉ chủ sở hữu</SelectItem>
                            <SelectItem value="editors">Editors</SelectItem>
                            <SelectItem value="team">Toàn team</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Version Control */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Kiểm soát phiên bản</CardTitle>
                      <CardDescription>Quản lý các phiên bản của nội dung</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Tự động lưu phiên bản</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Yêu cầu phê duyệt trước khi xuất bản</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Thông báo khi có thay đổi</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Collaboration Tab */}
            <TabsContent value="collaboration" className="flex-1 m-0">
              <div className="bg-white h-full overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Cộng tác</h2>
                    <p className="text-gray-600">Quản lý cộng tác viên và theo dõi hoạt động</p>
                  </div>

                  {/* Collaborators */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Cộng tác viên</span>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Mời người khác
                        </Button>
                      </CardTitle>
                      <CardDescription>Những người có quyền truy cập vào nội dung này</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">A</span>
                            </div>
                            <div>
                              <div className="font-medium">Admin User</div>
                              <div className="text-sm text-gray-600">admin@company.com</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Owner</Badge>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">M</span>
                            </div>
                            <div>
                              <div className="font-medium">Marketing Team</div>
                              <div className="text-sm text-gray-600">marketing@company.com</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Editor</Badge>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">C</span>
                            </div>
                            <div>
                              <div className="font-medium">Content Writer</div>
                              <div className="text-sm text-gray-600">writer@company.com</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Viewer</Badge>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Log */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Lịch sử hoạt động</CardTitle>
                      <CardDescription>Theo dõi các thay đổi và hoạt động gần đây</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Edit className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Admin User đã chỉnh sửa nội dung</div>
                            <div className="text-sm text-gray-600">Thêm section "Xu hướng AI Marketing"</div>
                            <div className="text-xs text-gray-500 mt-1">2 phút trước</div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Marketing Team đã được thêm vào</div>
                            <div className="text-sm text-gray-600">Quyền: Editor</div>
                            <div className="text-xs text-gray-500 mt-1">1 giờ trước</div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                            <Save className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Tự động lưu</div>
                            <div className="text-sm text-gray-600">Phiên bản 1.3 đã được lưu</div>
                            <div className="text-xs text-gray-500 mt-1">2 giờ trước</div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Content Writer đã tạo nội dung</div>
                            <div className="text-sm text-gray-600">Bản nháp đầu tiên</div>
                            <div className="text-xs text-gray-500 mt-1">1 ngày trước</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Comments */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Bình luận</CardTitle>
                      <CardDescription>Thảo luận và phản hồi về nội dung</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">M</span>
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="font-medium text-sm mb-1">Marketing Team</div>
                              <div className="text-sm text-gray-700">
                                Nội dung rất hay! Có thể thêm thống kê về ROI của AI marketing không?
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">30 phút trước</div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">A</span>
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="font-medium text-sm mb-1">Admin User</div>
                              <div className="text-sm text-gray-700">
                                Ý tưởng hay! Tôi sẽ thêm section về ROI và case studies.
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">25 phút trước</div>
                          </div>
                        </div>

                        {/* Add Comment */}
                        <div className="flex items-start space-x-3 pt-4 border-t">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-xs font-medium">U</span>
                          </div>
                          <div className="flex-1">
                            <Textarea placeholder="Thêm bình luận..." rows={3} />
                            <div className="flex justify-end mt-2">
                              <Button size="sm">Gửi bình luận</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      </div>
    </>
  )
}
