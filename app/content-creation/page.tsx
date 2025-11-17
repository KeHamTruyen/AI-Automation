"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import {
  Brain,
  Calendar,
  Video,
  FileText,
  MessageSquare,
  Zap,
  Clock,
  Share2,
  Settings,
  Play,
  Pause,
  Edit,
  Copy,
  Download,
  Plus,
  ArrowRight,
  Wand2,
  ArrowLeft,
  Home,
  Target,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function ContentCreationPage() {
  const [activeTab, setActiveTab] = useState("create")
  const [contentType, setContentType] = useState("social-post")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [apiResult, setApiResult] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [publishTime, setPublishTime] = useState("immediate")
  // Publishing state
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResults, setPublishResults] = useState<{ platform: string; ok: boolean; error?: string; externalPostId?: string }[]>([])
  const [lastExecId, setLastExecId] = useState<string | null>(null)
  const [lastTargetUrl, setLastTargetUrl] = useState<string | null>(null)

  // Controlled inputs to send to n8n
  const [topic, setTopic] = useState("")
  // Khởi tạo giá trị mặc định để tránh fallback ở workflow (hiển thị rõ ràng khi chưa chọn)
  const [tone, setTone] = useState<string>("friendly")
  const [lengthPref, setLengthPref] = useState<string>("short")
  // Cho phép chọn nhiều nền tảng cùng lúc
  const [platforms, setPlatforms] = useState<string[]>(["facebook"]) 

  const { toast } = useToast()

  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")

  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setScheduleDate(tomorrow.toISOString().split("T")[0])
    setScheduleTime("09:00")
  }, [])

  const handleGenerateContent = async () => {
    if (!topic.trim()) {
      toast({ title: "Thiếu chủ đề", description: "Vui lòng nhập Chủ đề/Từ khóa trước khi tạo.", variant: "destructive" })
      return
    }

    if (!platforms.length) {
      toast({ title: "Chưa chọn nền tảng", description: "Vui lòng chọn ít nhất 1 nền tảng.", variant: "destructive" })
      return
    }

    setIsGenerating(true)
    setGeneratedContent("")
    setApiResult(null)
    try {
      const res = await fetch("/api/content/generate/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: topic,
          tone: tone || "than thien",
          length: lengthPref || "ngan",
          // Giữ tương thích ngược với workflow hiện tại (chuỗi đơn)
          platform: platforms[0] || "facebook",
          // Truyền thêm mảng nền tảng để hỗ trợ đăng đa nền tảng
          platforms,
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        console.error("Generate failed", data)
        toast({ title: "Tạo nội dung thất bại", description: data?.data?.message || data?.error || "Có lỗi xảy ra trong workflow.", variant: "destructive" })
        return
      }

      setApiResult(data)

      const text = data?.data?.content_text || data?.content_text || data?.draft || JSON.stringify(data)
      setGeneratedContent(text || "")
      toast({ title: "Đã tạo nội dung", description: "Nội dung đã sẵn sàng ở khung bên phải." })
    } catch (e: any) {
      console.error(e)
      toast({ title: "Lỗi kết nối", description: "Không gọi được API proxy.", variant: "destructive" })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!generatedContent.trim()) {
      toast({ title: "Chưa có nội dung", description: "Hãy tạo nội dung trước khi lưu nháp.", variant: "destructive" })
      return
    }
    try {
      const title = generatedContent.split(/\n+/)[0]?.slice(0, 80) || "Bản nháp"
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content_text: generatedContent,
          hashtags: hashtags,
          platforms,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        toast({ title: "Lưu nháp thất bại", description: data?.error || "Không lưu được vào DB.", variant: "destructive" })
        return
      }
      toast({ title: "Đã lưu bản nháp", description: "Xem tại mục Archive → Bản nháp." })
    } catch (e) {
      console.error(e)
      toast({ title: "Lỗi", description: "Không gọi được API drafts.", variant: "destructive" })
    }
  }

  // Helpers
  function extractHashtags(source: any, fallbackText: string): string[] {
    if (Array.isArray(source)) return source.filter((x) => typeof x === "string")
    if (typeof source === "string") return source.split(/\s+/).filter((s) => s.startsWith("#"))
    // Try extract from last line of the text
    const lines = (fallbackText || "").split(/\n+/)
    const last = lines[lines.length - 1] || ""
    const tags = last.split(/\s+/).filter((s) => s.startsWith("#"))
    return tags
  }

  const hashtags: string[] = extractHashtags(apiResult?.data?.hashtags ?? apiResult?.hashtags, generatedContent)

  // Publish immediately to provisioned social account workflows (native n8n nodes)
  const handlePublishNow = async () => {
    if (!generatedContent.trim()) {
      toast({ title: "Chưa có nội dung", description: "Hãy tạo nội dung trước khi đăng.", variant: "destructive" })
      return
    }
    if (!platforms.length) {
      toast({ title: "Chưa chọn nền tảng", description: "Chọn ít nhất một nền tảng để đăng.", variant: "destructive" })
      return
    }
    // Attempt to get per-user webhook URL first to avoid server-side 400
    let resolvedWebhook: string | null = null
    try {
      // Re-use logic of resolveUserWebhookUrl (defined below). If not yet defined at runtime, duplicate minimal fetch.
      const accountsRes = await fetch('/api/social-accounts')
      const accountsData = await accountsRes.json().catch(() => null)
      if (accountsRes.ok && Array.isArray(accountsData?.data)) {
        const firstWithUrl = accountsData.data.find((a: any) => a?.n8nWebhookUrl)
        resolvedWebhook = firstWithUrl?.n8nWebhookUrl || null
      }
    } catch {}
    if (!resolvedWebhook && lastTargetUrl) {
      resolvedWebhook = lastTargetUrl
    }

    if (!resolvedWebhook) {
      toast({ title: 'Thiếu webhook', description: 'Không tìm thấy webhook user. Hãy provision tài khoản xã hội trước.', variant: 'destructive' })
      // We still allow sending; backend may locate from user record if available
    }
    setIsPublishing(true)
    setPublishResults([])
    setLastExecId(null)
    setLastTargetUrl(null)
    try {
      // Gửi một lần tới API proxy /api/posts -> server quyết định webhook user
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_text: generatedContent,
          hashtags,
          platforms,
          webhookUrl: resolvedWebhook || undefined,
        })
      })
      const body = await res.json().catch(() => ({}))
      const execId = res.headers.get('x-n8n-exec-id') || body.execId || null
      const targetUrl = body.targetUrl || null
      setLastExecId(execId)
      setLastTargetUrl(targetUrl)
      if (!res.ok || !body.success) {
        toast({ title: 'Đăng thất bại', description: body?.error || `HTTP ${res.status}`, variant: 'destructive' })
        setPublishResults(platforms.map(p => ({ platform: p, ok: false, error: body?.error || 'Fail' })))
        return
      }
      // Mark all selected platforms as success (actual fan-out happens inside workflow via Switch / routing)
      setPublishResults(platforms.map(p => ({ platform: p, ok: true })))
      toast({ title: 'Đã gửi đăng', description: execId ? `Execution ID: ${execId}` : 'Đã gửi tới workflow' })
    } catch (e: any) {
      toast({ title: 'Lỗi đăng bài', description: e?.message || 'Không rõ nguyên nhân', variant: 'destructive' })
    } finally {
      setIsPublishing(false)
    }
  }

  // Helpers to resolve saved webhook URL and transform to webhook-test
  function toTestWebhookUrl(url: string | null | undefined) {
    if (!url) return null
    // n8n test webhook simply swaps path segment
    return url.replace('/webhook/', '/webhook-test/')
  }

  async function resolveUserWebhookUrl(): Promise<string | null> {
    // Prefer the URL we just used when publishing
    if (lastTargetUrl) return lastTargetUrl
    try {
      const res = await fetch('/api/social-accounts', { method: 'GET' })
      const data = await res.json().catch(() => null)
      if (!res.ok) return null
      const accounts: any[] = Array.isArray(data?.data) ? data.data : []
      // Pick the first account that has a webhook (per-user workflows typically store it here)
      const firstWithUrl = accounts.find((a) => a?.n8nWebhookUrl)
      return firstWithUrl?.n8nWebhookUrl || null
    } catch {
      return null
    }
  }

  // Test per-user workflow (ping) by posting directly to webhook-test
  const handleTestWorkflow = async () => {
    try {
      const pf = platforms[0] || 'facebook'
      const saved = await resolveUserWebhookUrl()
      const testUrl = toTestWebhookUrl(saved)
      if (!testUrl) {
        toast({ title: 'Thiếu webhook', description: 'Không tìm thấy webhook của bạn. Hãy provision tài khoản trước.', variant: 'destructive' })
        return
      }
      const res = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Mirror the exact publish payload shape
        body: JSON.stringify({
          content_text: generatedContent || `TEST_PING ${new Date().toISOString()}`,
          hashtags,
          platforms,
          platform: pf,
        })
      })
      const execId = res.headers.get('x-n8n-execution-id') || null
      const ok = res.ok
      setLastExecId(execId)
      setLastTargetUrl(saved)
      if (!ok) {
        const text = await res.text().catch(() => '')
        toast({ title: 'Ping thất bại', description: text || `HTTP ${res.status}`, variant: 'destructive' })
        return
      }
      toast({ title: 'Ping thành công', description: execId ? `Execution ID: ${execId}` : 'Đã gửi tới webhook-test' })
    } catch (e: any) {
      toast({ title: 'Lỗi ping', description: e?.message || 'Không test được workflow', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
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
                  <span className="font-medium">Tạo nội dung</span>
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
            <Link href="/brand-analysis">
              <Button variant="ghost" size="sm">
                Phân tích thương hiệu
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-700">🎨 Tạo nội dung AI</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Tạo nội dung tự động
            <br />
            với AI thông minh
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI tạo bài viết, video, note và social post tự động theo lịch trình. Đăng bài trên nhiều nền tảng chỉ với 1
            nút bấm.
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

      {/* Content Creation Interface */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="create">Tạo nội dung</TabsTrigger>
                <TabsTrigger value="schedule">Lịch đăng bài</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="bulk">Tạo hàng loạt</TabsTrigger>
              </TabsList>

              {/* Create Content Tab */}
              <TabsContent value="create">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Input Panel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Wand2 className="w-5 h-5 mr-2 text-green-600" />
                        Tạo nội dung mới
                      </CardTitle>
                      <CardDescription>Cung cấp thông tin để AI tạo nội dung phù hợp</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="content-type">Loại nội dung *</Label>
                        <Select value={contentType} onValueChange={setContentType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại nội dung" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="social-post">Social Media Post</SelectItem>
                            <SelectItem value="blog-article">Bài viết Blog</SelectItem>
                            <SelectItem value="video-script">Script Video</SelectItem>
                            <SelectItem value="email-newsletter">Email Newsletter</SelectItem>
                            <SelectItem value="product-description">Mô tả sản phẩm</SelectItem>
                            <SelectItem value="ad-copy">Quảng cáo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="topic">Chủ đề/Từ khóa *</Label>
                        <Input
                          id="topic"
                          placeholder="VD: AI trong marketing, xu hướng công nghệ 2024..."
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="target-audience">Đối tượng mục tiêu</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn đối tượng" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="business-owners">Chủ doanh nghiệp</SelectItem>
                            <SelectItem value="marketers">Marketer</SelectItem>
                            <SelectItem value="developers">Developer</SelectItem>
                            <SelectItem value="students">Sinh viên</SelectItem>
                            <SelectItem value="general">Đại chúng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tone">Tone of Voice</Label>
                        <Select value={tone} onValueChange={setTone}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Chuyên nghiệp</SelectItem>
                            <SelectItem value="friendly">Thân thiện</SelectItem>
                            <SelectItem value="casual">Thoải mái</SelectItem>
                            <SelectItem value="authoritative">Uy tín</SelectItem>
                            <SelectItem value="inspiring">Truyền cảm hứng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="length">Độ dài nội dung</Label>
                        <Select value={lengthPref} onValueChange={setLengthPref}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn độ dài" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Ngắn (50-100 từ)</SelectItem>
                            <SelectItem value="medium">Trung bình (100-300 từ)</SelectItem>
                            <SelectItem value="long">Dài (300-500 từ)</SelectItem>
                            <SelectItem value="very-long">Rất dài (500+ từ)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additional-info">Thông tin bổ sung</Label>
                        <Textarea
                          id="additional-info"
                          placeholder="Thêm thông tin cụ thể, yêu cầu đặc biệt..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Nền tảng đăng bài (chọn nhiều)</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { name: "Facebook", value: "facebook", icon: "f", color: "bg-blue-500" },
                            { name: "Instagram", value: "instagram", icon: "IG", color: "bg-gradient-to-r from-pink-500 to-orange-500" },
                            { name: "LinkedIn", value: "linkedin", icon: "in", color: "bg-blue-600" },
                            { name: "TikTok", value: "tiktok", icon: "TT", color: "bg-black" },
                            { name: "YouTube", value: "youtube", icon: "YT", color: "bg-red-500" },
                            { name: "Twitter", value: "twitter", icon: "X", color: "bg-gray-800" },
                          ].map((p) => (
                            <button
                              type="button"
                              key={p.value}
                              onClick={() =>
                                setPlatforms((prev) =>
                                  prev.includes(p.value)
                                    ? prev.filter((v) => v !== p.value)
                                    : [...prev, p.value]
                                )
                              }
                              className={`flex items-center space-x-2 p-2 rounded border transition-colors ${
                                platforms.includes(p.value) ? "border-green-600 bg-green-50" : "border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <div className={`w-6 h-6 ${p.color} rounded text-white text-xs flex items-center justify-center`}>
                                {p.icon}
                              </div>
                              <span className="text-sm">{p.name}</span>
                            </button>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                          <span>Đang chọn:</span>
                          {platforms.length === 0 ? (
                            <span className="font-medium">Chưa chọn</span>
                          ) : (
                            platforms.map((pf) => (
                              <span key={pf} className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">{pf}</span>
                            ))
                          )}
                        </div>
                      </div>

                      

                      <Button
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600"
                        onClick={handleGenerateContent}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang tạo nội dung...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Tạo nội dung
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Output Panel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-blue-600" />
                          Nội dung được tạo
                        </span>
                        {generatedContent && (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => navigator.clipboard?.writeText(generatedContent)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setShowDebug((s) => !s)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </CardTitle>
                      <CardDescription>Kết quả AI tạo ra dựa trên thông tin bạn cung cấp</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isGenerating ? (
                        <div className="text-center py-12">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Wand2 className="w-6 h-6 text-green-600 animate-spin" />
                          </div>
                          <p className="text-gray-600">AI đang tạo nội dung cho bạn...</p>
                        </div>
                      ) : generatedContent ? (
                        <div className="space-y-4">
                          {/* Editable content */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <Textarea
                              rows={14}
                              value={generatedContent}
                              onChange={(e) => setGeneratedContent(e.target.value)}
                              className="w-full text-sm leading-6"
                            />
                          </div>

                          {/* Raw JSON (debug) */}
                          {showDebug && (
                            <div className="bg-white border rounded-lg p-3">
                              <pre className="text-xs overflow-auto max-h-60">{JSON.stringify(apiResult, null, 2)}</pre>
                            </div>
                          )}

                          {/* Removed analytics preview (Engagement/Brand/Words) per request */}

                          <div className="flex space-x-2 pt-4">
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={handleSaveDraft}
                            >
                              Lưu nháp
                            </Button>
                            <Button
                              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                              disabled={isPublishing}
                              onClick={handlePublishNow}
                            >
                              {isPublishing ? (
                                <>
                                  <Share2 className="w-4 h-4 mr-2 animate-pulse" /> Đang đăng...
                                </>
                              ) : (
                                <>
                                  <Share2 className="w-4 h-4 mr-2" /> Đăng ngay
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={handleTestWorkflow}
                            >
                              Ping workflow
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => setShowScheduleModal(true)}
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Chọn lịch đăng
                            </Button>
                          </div>
                          {(lastExecId || lastTargetUrl) && (
                            <div className="mt-3 text-xs text-gray-600 space-y-1">
                              {lastExecId && <div><span className="font-semibold">Execution ID:</span> {lastExecId}</div>}
                              {lastTargetUrl && <div className="break-all"><span className="font-semibold">Webhook URL:</span> {lastTargetUrl}</div>}
                            </div>
                          )}

                          {publishResults.length > 0 && (
                            <div className="bg-white border rounded-lg p-3 space-y-2">
                              <div className="font-medium text-sm">Kết quả đăng:</div>
                              <ul className="text-xs space-y-1">
                                {publishResults.map(r => (
                                  <li key={r.platform} className={r.ok ? 'text-green-600' : 'text-red-600'}>
                                    {r.platform}: {r.ok ? `OK${r.externalPostId ? ` (ID: ${r.externalPostId})` : ''}` : `Lỗi - ${r.error}`}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Schedule Modal */}
                          {showScheduleModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-semibold flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                                    Lên lịch đăng bài
                                  </h3>
                                  <Button variant="ghost" size="sm" onClick={() => setShowScheduleModal(false)}>
                                    ✕
                                  </Button>
                                </div>

                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <Label htmlFor="modal-schedule-date">Ngày đăng</Label>
                                      <Input
                                        id="modal-schedule-date"
                                        type="date"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        min={new Date().toISOString().split("T")[0]}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="modal-schedule-time">Giờ đăng</Label>
                                      <Input
                                        id="modal-schedule-time"
                                        type="time"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Thời gian tối ưu gợi ý</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {["09:00", "12:00", "15:00", "19:00"].map((time) => (
                                        <Button
                                          key={time}
                                          size="sm"
                                          variant="outline"
                                          className="text-xs h-7 bg-transparent"
                                          onClick={() => setScheduleTime(time)}
                                        >
                                          {time}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="bg-blue-50 rounded-lg p-3">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Clock className="w-4 h-4 text-blue-600" />
                                      <span className="text-sm font-medium">Thời gian đã chọn</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {scheduleDate && scheduleTime
                                        ? `${new Date(scheduleDate).toLocaleDateString("vi-VN")} lúc ${scheduleTime}`
                                        : "Chưa chọn thời gian"}
                                    </p>
                                  </div>

                                  <div className="flex space-x-2 pt-2">
                                    <Button
                                      variant="outline"
                                      className="flex-1 bg-transparent"
                                      onClick={() => setShowScheduleModal(false)}
                                    >
                                      Hủy
                                    </Button>
                                    <Button
                                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
                                      disabled={!scheduleDate || !scheduleTime}
                                      onClick={() => {
                                        // Handle schedule
                                        console.log("Scheduling for:", scheduleDate, scheduleTime)
                                        setShowScheduleModal(false)
                                        // Show success message or redirect
                                      }}
                                    >
                                      <Calendar className="w-4 h-4 mr-2" />
                                      Lên lịch
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-600">Nội dung sẽ hiển thị ở đây sau khi tạo</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Calendar View */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-green-600" />
                            Lịch đăng bài đã lên kế hoạch
                          </span>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Hôm nay
                            </Button>
                            <Button size="sm" variant="outline">
                              Tuần này
                            </Button>
                            <Button size="sm" variant="outline">
                              Tháng này
                            </Button>
                          </div>
                        </CardTitle>
                        <CardDescription>Chỉ hiển thị những bài viết đã được lên lịch đăng</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Today's Scheduled Posts */}
                          <div>
                            <h4 className="font-medium mb-3 flex items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                              Hôm nay - 15/01/2024
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">IG</span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">Behind the scenes video</div>
                                    <div className="text-xs text-gray-600">2:00 PM - Đã lên lịch</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="bg-blue-100 text-blue-700">
                                    Chờ đăng
                                  </Badge>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">in</span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">Weekly newsletter</div>
                                    <div className="text-xs text-gray-600">5:00 PM - Đã lên lịch</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                                    Chờ đăng
                                  </Badge>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Tomorrow's Scheduled Posts */}
                          <div>
                            <h4 className="font-medium mb-3 flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                              Ngày mai - 16/01/2024
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">f</span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">Marketing tips for SME</div>
                                    <div className="text-xs text-gray-600">9:00 AM - Đã lên lịch</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="bg-green-100 text-green-700">
                                    Chờ đăng
                                  </Badge>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">YT</span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">Product demo video</div>
                                    <div className="text-xs text-gray-600">3:00 PM - Đã lên lịch</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="bg-orange-100 text-orange-700">
                                    Chờ đăng
                                  </Badge>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* This Week's Scheduled Posts */}
                          <div>
                            <h4 className="font-medium mb-3 flex items-center">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                              Tuần này
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">X</span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">Industry insights thread</div>
                                    <div className="text-xs text-gray-600">18/01 - 10:00 AM - Đã lên lịch</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                                    Chờ đăng
                                  </Badge>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">TT</span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">Trending challenge video</div>
                                    <div className="text-xs text-gray-600">19/01 - 7:00 PM - Đã lên lịch</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="bg-pink-100 text-pink-700">
                                    Chờ đăng
                                  </Badge>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Empty State */}
                          {false && (
                            <div className="text-center py-12">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-6 h-6 text-gray-400" />
                              </div>
                              <h3 className="font-medium mb-2">Chưa có bài viết nào được lên lịch</h3>
                              <p className="text-gray-600 mb-4">
                                Tạo nội dung và chọn "Chọn lịch đăng" để lên lịch đăng bài
                              </p>
                              <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Tạo nội dung mới
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Schedule Settings - Same as before */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Settings className="w-5 h-5 mr-2 text-purple-600" />
                          Cài đặt lịch
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <Label>Tự động đăng bài</Label>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Kích hoạt auto-post</span>
                            <Switch defaultChecked />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Thời gian tối ưu</Label>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Facebook</span>
                              <span className="text-sm text-gray-600">9:00 AM, 2:00 PM</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Instagram</span>
                              <span className="text-sm text-gray-600">11:00 AM, 7:00 PM</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">LinkedIn</span>
                              <span className="text-sm text-gray-600">8:00 AM, 12:00 PM</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Tần suất đăng bài</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tần suất" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Hàng ngày</SelectItem>
                              <SelectItem value="3-times-week">3 lần/tuần</SelectItem>
                              <SelectItem value="weekly">Hàng tuần</SelectItem>
                              <SelectItem value="custom">Tùy chỉnh</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Thêm bài viết mới
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                          Thống kê lịch đăng
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Bài viết đã lên lịch</span>
                            <span className="font-medium">8</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Sẽ đăng hôm nay</span>
                            <span className="font-medium">2</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Sẽ đăng tuần này</span>
                            <span className="font-medium text-green-600">6</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Templates Tab */}
              <TabsContent value="templates">
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Templates nội dung</h2>
                    <p className="text-gray-600">Sử dụng templates có sẵn để tạo nội dung nhanh chóng</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Social Media Templates */}
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-blue-100 text-blue-700">Social Media</Badge>
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">Engagement Post</CardTitle>
                        <CardDescription>Template để tăng tương tác trên social media</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-700">
                            "🤔 Câu hỏi cho cộng đồng: [Câu hỏi liên quan đến ngành] 💭 Chia sẻ ý kiến của bạn trong
                            comment! #[Hashtag] #[Industry]"
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            <Wand2 className="w-4 h-4 mr-2" />
                            Sử dụng
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-green-100 text-green-700">Blog</Badge>
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">How-to Article</CardTitle>
                        <CardDescription>Template cho bài viết hướng dẫn</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-700">
                            "# Cách [Làm gì đó] trong [Thời gian] ## Giới thiệu [Vấn đề cần giải quyết] ## Bước 1: [Tiêu
                            đề bước] [Hướng dẫn chi tiết]..."
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            <Wand2 className="w-4 h-4 mr-2" />
                            Sử dụng
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-purple-100 text-purple-700">Video</Badge>
                          <Video className="w-5 h-5 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">Product Demo</CardTitle>
                        <CardDescription>Script cho video demo sản phẩm</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-700">
                            "Hook: [Vấn đề khách hàng gặp phải] Problem: [Mô tả chi tiết vấn đề] Solution: [Giới thiệu
                            sản phẩm] Demo: [Hướng dẫn sử dụng] CTA: [Lời kêu gọi hành động]"
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            <Wand2 className="w-4 h-4 mr-2" />
                            Sử dụng
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-orange-100 text-orange-700">Email</Badge>
                          <MessageSquare className="w-5 h-5 text-orange-600" />
                        </div>
                        <CardTitle className="text-lg">Newsletter</CardTitle>
                        <CardDescription>Template cho email newsletter</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-700">
                            "Subject: [Tiêu đề hấp dẫn] Xin chào [Tên], 📰 Tin tức nổi bật tuần này: • [Tin 1] • [Tin 2]
                            💡 Tips hữu ích: [Mẹo] 🔗 [CTA Button]"
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            <Wand2 className="w-4 h-4 mr-2" />
                            Sử dụng
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-red-100 text-red-700">Ads</Badge>
                          <Target className="w-5 h-5 text-red-600" />
                        </div>
                        <CardTitle className="text-lg">Facebook Ads</CardTitle>
                        <CardDescription>Template cho quảng cáo Facebook</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-700">
                            "Headline: [Lợi ích chính] Primary Text: 🎯 [Vấn đề target audience] ✅ [Giải pháp của bạn]
                            🚀 [Kết quả/Lợi ích] CTA: [Hành động mong muốn]"
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            <Wand2 className="w-4 h-4 mr-2" />
                            Sử dụng
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Create Custom Template */}
                    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center h-full p-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Plus className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="font-medium mb-2">Tạo template mới</h3>
                        <p className="text-sm text-gray-600 text-center mb-4">
                          Tạo template tùy chỉnh cho nhu cầu riêng
                        </p>
                        <Button className="w-full">Tạo template</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Bulk Creation Tab */}
              <TabsContent value="bulk">
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Tạo nội dung hàng loạt</h2>
                    <p className="text-gray-600">Tạo nhiều bài viết cùng lúc với AI thông minh</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                        Bulk Content Generator
                      </CardTitle>
                      <CardDescription>Tạo 10-50 bài viết cùng lúc dựa trên chủ đề và keywords</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="bulk-topic">Chủ đề chính *</Label>
                          <Input id="bulk-topic" placeholder="VD: Digital Marketing 2024" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bulk-count">Số lượng bài viết</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn số lượng" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10 bài viết</SelectItem>
                              <SelectItem value="20">20 bài viết</SelectItem>
                              <SelectItem value="30">30 bài viết</SelectItem>
                              <SelectItem value="50">50 bài viết</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bulk-keywords">Keywords (mỗi từ khóa một dòng)</Label>
                        <Textarea
                          id="bulk-keywords"
                          placeholder="AI marketing&#10;Social media automation&#10;Content strategy&#10;Digital transformation&#10;Marketing analytics"
                          rows={6}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Loại nội dung</Label>
                          <div className="space-y-2">
                            {["Social posts", "Blog articles", "Email subjects", "Ad copies"].map((type) => (
                              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Tùy chọn</Label>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">Tự động lên lịch</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">Thêm hashtags</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">Tối ưu SEO</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">Tạo hình ảnh AI</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-blue-600" />
                          Thời gian ước tính
                        </h4>
                        <p className="text-sm text-gray-600">
                          Tạo 20 bài viết sẽ mất khoảng 3-5 phút. Bạn sẽ nhận được thông báo khi hoàn thành.
                        </p>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                        <Zap className="w-4 h-4 mr-2" />
                        Bắt đầu tạo hàng loạt
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Previous Bulk Jobs */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Lịch sử tạo hàng loạt</CardTitle>
                      <CardDescription>Các lần tạo nội dung hàng loạt trước đây</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Digital Marketing 2024</h4>
                            <p className="text-sm text-gray-600">25 bài viết • Hoàn thành 2 ngày trước</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Tải xuống
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Social Media Tips</h4>
                            <p className="text-sm text-gray-600">15 bài viết • Đang xử lý (75%)</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-100 text-blue-700">Đang xử lý</Badge>
                            <Button size="sm" variant="outline">
                              <Pause className="w-4 h-4" />
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

      {/* Features Overview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tính năng nổi bật</h2>
            <p className="text-xl text-gray-600">Tạo nội dung chuyên nghiệp với AI tiên tiến</p>
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
                <p className="text-gray-600">Tạo nội dung chất lượng cao với AI GPT-4 trong vài giây</p>
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
                <p className="text-gray-600">Lên lịch đăng bài tự động vào thời gian tối ưu nhất</p>
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
                <p className="text-gray-600">Đăng bài trên nhiều nền tảng cùng lúc chỉ với 1 click</p>
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
                <p className="text-gray-600">Theo dõi hiệu suất và tối ưu nội dung liên tục</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng tạo nội dung với AI?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Bắt đầu tạo nội dung chuyên nghiệp và tự động hóa marketing ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
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
    </div>
  )
}
