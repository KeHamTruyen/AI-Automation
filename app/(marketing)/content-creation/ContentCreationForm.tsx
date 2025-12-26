"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
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
  X,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function ContentCreationForm() {
  const [activeTab, setActiveTab] = useState("create");
  const [contentType, setContentType] = useState("social-post");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [apiResult, setApiResult] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [publishTime, setPublishTime] = useState("immediate");
  // Publishing state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<
    { platform: string; ok: boolean; error?: string; externalPostId?: string }[]
  >([]);
  const [lastExecId, setLastExecId] = useState<string | null>(null);
  const [lastTargetUrl, setLastTargetUrl] = useState<string | null>(null);
  // Media upload states
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Controlled inputs to send to n8n
  const [topic, setTopic] = useState("");
  // Khởi tạo giá trị mặc định để tránh fallback ở workflow (hiển thị rõ ràng khi chưa chọn)
  const [tone, setTone] = useState<string>("friendly");
  const [lengthPref, setLengthPref] = useState<string>("short");
  // Platforms - start empty, will be populated from connected accounts
  const [platforms, setPlatforms] = useState<string[]>([]);
  // AI Image generation
  const [autoGenerateImage, setAutoGenerateImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");

  const { toast } = useToast();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  // Fetch user info to get role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.data?.role) {
          setUserRole(data.data.role.toLowerCase());
        }
      } catch (e) {
        // Silent fail - role stays null
      }
    };
    fetchUserRole();
  }, []);

  // Fetch connected social accounts
  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      try {
        const res = await fetch('/api/social-accounts');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const connectedPlatforms = data.data.map((acc: any) => acc.platform.toLowerCase());
          setConnectedPlatforms(connectedPlatforms);
          // Auto-select first connected platform
          if (connectedPlatforms.length > 0 && platforms.length === 0) {
            setPlatforms([connectedPlatforms[0]]);
          }
        }
      } catch (e) {
        console.error('Failed to fetch connected accounts:', e);
      }
    };
    fetchConnectedAccounts();
  }, []);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduleDate(tomorrow.toISOString().split("T")[0]);
    setScheduleTime("09:00");
  }, []);

  useEffect(() => {
    if (activeTab === "schedule") {
      fetchScheduledPosts();
    }
  }, [activeTab]);

  const fetchScheduledPosts = async () => {
    setIsLoadingSchedule(true);
    try {
      // userId is now extracted from JWT cookie on the server
      // Fetch all statuses (not just PENDING) to show full history
      const res = await fetch("/api/schedule");
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs)) {
        setScheduledPosts(data.jobs);
        console.log('[fetchScheduledPosts] Loaded', data.jobs.length, 'jobs');
      } else {
        console.error("Invalid response format:", data);
      }
    } catch (e) {
      console.error("Failed to fetch schedule:", e);
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!topic.trim()) {
      toast({
        title: "Thiếu chủ đề",
        description: "Vui lòng nhập prompt trước khi tạo.",
        variant: "destructive",
      });
      return;
    }

    if (!platforms.length) {
      toast({
        title: "Chưa chọn nền tảng",
        description: "Vui lòng chọn ít nhất 1 nền tảng.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");
    setApiResult(null);
    
    const payload = {
      prompt: topic,
      tone: tone || "than thien",
      length: lengthPref || "ngan",
      platform: platforms[0] || "facebook",
      platforms,
      autoGenerateImage,
      imagePrompt,
    };
    
    try {
      const res = await fetch("/api/content/generate/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast({
          title: "Tạo nội dung thất bại",
          description:
            data?.data?.message ||
            data?.error ||
            "Có lỗi xảy ra trong workflow.",
          variant: "destructive",
        });
        return;
      }

      setApiResult(data);

      const text =
        data?.data?.content_text ||
        data?.content_text ||
        data?.draft ||
        JSON.stringify(data);
      setGeneratedContent(text || "");
      
      const media =
        (Array.isArray(data?.data?.media) ? data.data.media : null) ||
        (Array.isArray(data?.media) ? data.media : null);
      
      if (media && media.length) {
        const validUrls = media.filter((u: any) => typeof u === "string");
        setMediaUrls(validUrls);
      }
      toast({
        title: "Đã tạo nội dung",
        description: "Nội dung đã sẵn sàng ở khung bên phải.",
      });
    } catch (e: any) {
      toast({
        title: "Lỗi kết nối",
        description: "Không gọi được API proxy.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!generatedContent.trim()) {
      toast({
        title: "Chưa có nội dung",
        description: "Hãy tạo nội dung trước khi lưu nháp.",
        variant: "destructive",
      });
      return;
    }
    try {
      // Transfer AI-generated images to R2 first
      let finalMediaUrls = mediaUrls;
      if (mediaUrls.length > 0) {
        const transferResponse = await fetch("/api/media/transfer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: mediaUrls }),
        });
        
        if (transferResponse.ok) {
          const transferData = await transferResponse.json();
          if (transferData.success && transferData.urls) {
            finalMediaUrls = transferData.urls;
          }
        }
      }

      const title =
        generatedContent.split(/\n+/)[0]?.slice(0, 80) || "Bản nháp";
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content_text: generatedContent,
          hashtags: hashtags,
          media: finalMediaUrls,
          platforms,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast({
          title: "Lưu nháp thất bại",
          description: data?.error || "Không lưu được vào DB.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Đã lưu bản nháp",
        description: "Xem tại mục Archive → Bản nháp.",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Lỗi",
        description: "Không gọi được API drafts.",
        variant: "destructive",
      });
    }
  };

  // Helpers
  function extractHashtags(source: any, fallbackText: string): string[] {
    if (Array.isArray(source))
      return source.filter((x) => typeof x === "string");
    if (typeof source === "string")
      return source.split(/\s+/).filter((s) => s.startsWith("#"));
    // Try extract from last line of the text
    const lines = (fallbackText || "").split(/\n+/);
    const last = lines[lines.length - 1] || "";
    const tags = last.split(/\s+/).filter((s) => s.startsWith("#"));
    return tags;
  }

  const hashtags: string[] = extractHashtags(
    apiResult?.data?.hashtags ?? apiResult?.hashtags,
    generatedContent
  );

  // Publish immediately to provisioned social account workflows (native n8n nodes)
  const handlePublishNow = async () => {
    if (!generatedContent.trim()) {
      toast({
        title: "Chưa có nội dung",
        description: "Hãy tạo nội dung trước khi đăng.",
        variant: "destructive",
      });
      return;
    }
    if (!platforms.length) {
      toast({
        title: "Chưa chọn nền tảng",
        description: "Chọn ít nhất một nền tảng để đăng.",
        variant: "destructive",
      });
      return;
    }
    
    // Upload local files to R2 first
    let finalMediaUrls: string[] = [];
    if (mediaFiles.length > 0) {
      try {
        for (const file of mediaFiles) {
          const fd = new FormData();
          fd.append("file", file);
          const uploadRes = await fetch("/api/uploads", {
            method: "POST",
            body: fd,
          });
          
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData.success && uploadData.url) {
              finalMediaUrls.push(uploadData.url);
            }
          } else {
            throw new Error(`Upload failed for ${file.name}`);
          }
        }
      } catch (error: any) {
        console.error("Upload error:", error);
        toast({
          title: "Upload thất bại",
          description: error.message || "Không thể upload ảnh",
          variant: "destructive",
        });
        setIsPublishing(false);
        return; // Stop if upload fails
      }
    } else if (mediaUrls.length > 0) {
      // Transfer AI-generated images (external URLs) to R2
      try {
        const transferResponse = await fetch("/api/media/transfer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: mediaUrls }),
        });
        
        if (transferResponse.ok) {
          const transferData = await transferResponse.json();
          if (transferData.success && transferData.urls) {
            finalMediaUrls = transferData.urls;
          }
        }
      } catch (error) {
        console.error("Media transfer error:", error);
        finalMediaUrls = mediaUrls; // Fallback to original URLs
      }
    }
    
    // Attempt to get per-user webhook URL first to avoid server-side 400
    let resolvedWebhook: string | null = null;
    try {
      // Re-use logic of resolveUserWebhookUrl (defined below). If not yet defined at runtime, duplicate minimal fetch.
      const accountsRes = await fetch("/api/social-accounts");
      const accountsData = await accountsRes.json().catch(() => null);
      if (accountsRes.ok && Array.isArray(accountsData?.data)) {
        const firstWithUrl = accountsData.data.find(
          (a: any) => a?.n8nWebhookUrl
        );
        resolvedWebhook = firstWithUrl?.n8nWebhookUrl || null;
      }
    } catch {}
    if (!resolvedWebhook && lastTargetUrl) {
      resolvedWebhook = lastTargetUrl;
    }

    if (!resolvedWebhook) {
      toast({
        title: "Thiếu webhook",
        description:
          "Không tìm thấy webhook user. Hãy provision tài khoản xã hội trước.",
        variant: "destructive",
      });
      // We still allow sending; backend may locate from user record if available
    }
    setIsPublishing(true);
    setPublishResults([]);
    setLastExecId(null);
    setLastTargetUrl(null);
    try {
      // Gửi một lần tới API proxy /api/posts -> server quyết định webhook user
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_text: generatedContent,
          hashtags,
          media: finalMediaUrls,  // Use R2 URLs instead of AI URLs
          platforms,
          // AI image generation flags
          autoGenerateImage,
          imagePrompt,
          webhookUrl: resolvedWebhook || undefined,
        }),
      });
      const body = await res.json().catch(() => ({}));
      const execId = res.headers.get("x-n8n-exec-id") || body.execId || null;
      const targetUrl = body.targetUrl || null;
      setLastExecId(execId);
      setLastTargetUrl(targetUrl);
      if (!res.ok || !body.success) {
        toast({
          title: "Đăng thất bại",
          description: body?.error || `HTTP ${res.status}`,
          variant: "destructive",
        });
        setPublishResults(
          platforms.map((p) => ({
            platform: p,
            ok: false,
            error: body?.error || "Fail",
          }))
        );
        return;
      }
      // Mark all selected platforms as success (actual fan-out happens inside workflow via Switch / routing)
      setPublishResults(platforms.map((p) => ({ platform: p, ok: true })));
      toast({
        title: "Đã gửi đăng",
        description: execId ? `Execution ID: ${execId}` : "Đã gửi tới workflow",
      });
    } catch (e: any) {
      toast({
        title: "Lỗi đăng bài",
        description: e?.message || "Không rõ nguyên nhân",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Helpers to resolve saved webhook URL
  async function resolveUserWebhookUrl(): Promise<string | null> {
    // Prefer the URL we just used when publishing
    if (lastTargetUrl) return lastTargetUrl;
    try {
      const res = await fetch("/api/social-accounts", { method: "GET" });
      const data = await res.json().catch(() => null);
      if (!res.ok) return null;
      const accounts: any[] = Array.isArray(data?.data) ? data.data : [];
      // Pick the first account that has a webhook (per-user workflows typically store it here)
      const firstWithUrl = accounts.find((a) => a?.n8nWebhookUrl);
      return firstWithUrl?.n8nWebhookUrl || null;
    } catch {
      return null;
    }
  }

  // Test per-user workflow (ping) by calling through /api/posts proxy (avoid CORS)
  const handleTestWorkflow = async () => {
    try {
      const pf = platforms[0] || "facebook";
      const saved = await resolveUserWebhookUrl();
      if (!saved) {
        toast({
          title: "Thiếu webhook",
          description:
            "Không tìm thấy webhook của bạn. Hãy provision tài khoản trước.",
          variant: "destructive",
        });
        return;
      }
      // Call through /api/posts instead of direct n8n webhook (avoid CORS)
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_text:
            generatedContent || `TEST_PING ${new Date().toISOString()}`,
          hashtags,
          media: mediaUrls,
          platforms,
          platform: pf,
          webhookUrl: saved,
          isTest: true, // Flag to use webhook-test instead of webhook
        }),
      });
      const body = await res.json().catch(() => ({}));
      const execId = res.headers.get("x-n8n-execution-id") || body.execId || null;
      const targetUrl = body.targetUrl || saved;
      const ok = res.ok && body.success !== false;
      setLastExecId(execId);
      setLastTargetUrl(targetUrl);
      if (!ok) {
        const errMsg = body?.error || `HTTP ${res.status}`;
        toast({
          title: "Ping thất bại",
          description: errMsg,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Ping thành công",
        description: execId
          ? `Execution ID: ${execId}`
          : "Đã gửi tới webhook-test",
      });
    } catch (e: any) {
      toast({
        title: "Lỗi ping",
        description: e?.message || "Không test được workflow",
        variant: "destructive",
      });
    }
  };

  // Upload helper: single or multiple files
  // Changed: Do NOT upload to R2 immediately, only store files locally
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setMediaFiles((m) => [...m, ...list]);
    
    // Create preview URLs (blob URLs for display)
    const previewUrls = list.map(f => URL.createObjectURL(f));
    setMediaUrls((prev) => [...prev, ...previewUrls]);
  };

  const removeMediaAt = (index: number) => {
    setMediaFiles((m) => m.filter((_, i) => i !== index));
    setMediaUrls((m) => m.filter((_, i) => i !== index));
  };

  return (
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
              <CardDescription>
                Cung cấp thông tin để AI tạo nội dung phù hợp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Prompt *</Label>
                <Input
                  id="topic"
                  placeholder="VD: AI trong marketing, xu hướng công nghệ 2024..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
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
                    <SelectItem value="medium">
                      Trung bình (100-300 từ)
                    </SelectItem>
                    <SelectItem value="long">Dài (300-500 từ)</SelectItem>
                    <SelectItem value="very-long">Rất dài (500+ từ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-generate-image"
                    checked={autoGenerateImage}
                    onCheckedChange={setAutoGenerateImage}
                  />
                  <Label htmlFor="auto-generate-image" className="cursor-pointer">
                    Tạo ảnh AI tự động
                  </Label>
                </div>
                {autoGenerateImage && (
                  <div className="space-y-2 ml-8">
                    <Label htmlFor="image-prompt">Image prompt</Label>
                    <Textarea
                      id="image-prompt"
                      placeholder="Mô tả ảnh bạn muốn tạo (ví dụ: A modern office with people working, bright and professional)..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">
                      💡 Mẹo: Mô tả chi tiết về đối tượng, màu sắc, phong cách, ánh sáng để có ảnh đẹp hơn
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label>Nền tảng đăng bài (chọn nhiều)</Label>
                {connectedPlatforms.length === 0 ? (
                  <div className="text-sm text-gray-500 p-4 border border-dashed rounded">
                    Chưa kết nối tài khoản nào. Vui lòng{" "}
                    <a href="/social-accounts" className="text-blue-600 underline">
                      kết nối tài khoản
                    </a>{" "}
                    trước.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        name: "Facebook",
                        value: "facebook",
                        icon: "f",
                        color: "bg-blue-500",
                      },
                      {
                        name: "Instagram",
                        value: "instagram",
                        icon: "IG",
                        color: "bg-gradient-to-r from-pink-500 to-orange-500",
                      },
                      {
                        name: "LinkedIn",
                        value: "linkedin",
                        icon: "in",
                        color: "bg-blue-600",
                      },
                      {
                        name: "TikTok",
                        value: "tiktok",
                        icon: "TT",
                        color: "bg-black",
                      },
                      {
                        name: "YouTube",
                        value: "youtube",
                        icon: "YT",
                        color: "bg-red-500",
                      },
                      {
                        name: "Twitter",
                        value: "twitter",
                        icon: "X",
                        color: "bg-gray-800",
                      },
                    ]
                      .filter((p) => connectedPlatforms.includes(p.value))
                      .map((p) => (
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
                            platforms.includes(p.value)
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 ${p.color} rounded text-white text-xs flex items-center justify-center`}
                          >
                            {p.icon}
                          </div>
                          <span className="text-sm">{p.name}</span>
                        </button>
                      ))}
                  </div>
                )}
                <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                  <span>Đang chọn:</span>
                  {platforms.length === 0 ? (
                    <span className="font-medium">Chưa chọn</span>
                  ) : (
                    platforms.map((pf) => (
                      <span
                        key={pf}
                        className="px-2 py-0.5 rounded-full bg-green-100 text-green-700"
                      >
                        {pf}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="media-upload">Upload ảnh/video (tùy chọn)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    id="media-upload"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                  />
                  <label
                    htmlFor="media-upload"
                    className="cursor-pointer inline-flex flex-col items-center"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-600">
                      {isUploading ? "Đang upload..." : "Click để chọn file"}
                    </span>
                  </label>
                </div>
                {mediaUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {mediaUrls.map((url, i) => (
                      <div key={url} className="relative group">
                        <img
                          src={url}
                          alt={`media-${i}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeMediaAt(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigator.clipboard?.writeText(generatedContent)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Kết quả AI tạo ra dựa trên thông tin bạn cung cấp
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wand2 className="w-6 h-6 text-green-600 animate-spin" />
                  </div>
                  <p className="text-gray-600">
                    AI đang tạo nội dung cho bạn...
                  </p>
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

                  {/* Removed analytics preview (Engagement/Brand/Words) per request */}

                  {/* Preview images from AI generation */}
                  {mediaUrls.length > 0 && (
                    <div className="mt-3">
                      <Label className="text-sm font-medium mb-2 block">
                        Ảnh preview {autoGenerateImage && "(từ AI)"}
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {mediaUrls.map((u, i) => (
                          <div key={u} className="relative group">
                            <img
                              src={u}
                              alt={`preview-${i}`}
                              className="w-full h-32 object-cover rounded border-2 border-gray-200"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.jpg';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeMediaAt(i)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                          <Share2 className="w-4 h-4 mr-2 animate-pulse" /> Đang
                          đăng...
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 mr-2" /> Đăng ngay
                        </>
                      )}
                    </Button>
                    {userRole === 'admin' && (
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={handleTestWorkflow}
                      >
                        Ping workflow
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setShowScheduleModal(true)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Chọn lịch đăng
                    </Button>
                  </div>
                  {/* Media previews moved above buttons */}
                  {/* Debug info hidden from users */}

                  {publishResults.length > 0 && (
                    <div className="bg-white border rounded-lg p-3 space-y-2">
                      <div className="font-medium text-sm">Kết quả đăng:</div>
                      <ul className="text-xs space-y-1">
                        {publishResults.map((r) => (
                          <li
                            key={r.platform}
                            className={r.ok ? "text-green-600" : "text-red-600"}
                          >
                            {r.platform}:{" "}
                            {r.ok
                              ? `OK${
                                  r.externalPostId
                                    ? ` (ID: ${r.externalPostId})`
                                    : ""
                                }`
                              : `Lỗi - ${r.error}`}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowScheduleModal(false)}
                          >
                            ✕
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="modal-schedule-date">
                                Ngày đăng
                              </Label>
                              <Input
                                id="modal-schedule-date"
                                type="date"
                                value={scheduleDate}
                                onChange={(e) =>
                                  setScheduleDate(e.target.value)
                                }
                                min={new Date().toISOString().split("T")[0]}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="modal-schedule-time">
                                Giờ đăng
                              </Label>
                              <Input
                                id="modal-schedule-time"
                                type="time"
                                value={scheduleTime}
                                onChange={(e) =>
                                  setScheduleTime(e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Thời gian tối ưu gợi ý</Label>
                            <div className="flex flex-wrap gap-2">
                              {["09:00", "12:00", "15:00", "19:00"].map(
                                (time) => (
                                  <Button
                                    key={time}
                                    size="sm"
                                    variant="outline"
                                    className="text-xs h-7 bg-transparent"
                                    onClick={() => setScheduleTime(time)}
                                  >
                                    {time}
                                  </Button>
                                )
                              )}
                            </div>
                          </div>

                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium">
                                Thời gian đã chọn
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {scheduleDate && scheduleTime
                                ? `${new Date(scheduleDate).toLocaleDateString(
                                    "vi-VN"
                                  )} lúc ${scheduleTime}`
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
                              onClick={async () => {
                                if (!generatedContent) {
                                  toast({
                                    title: "Chưa có nội dung",
                                    description: "Vui lòng tạo nội dung trước khi lên lịch",
                                    variant: "destructive",
                                  });
                                  return;
                                }

                                try {
                                  // Upload local files to R2 first
                                  let finalMediaUrls: string[] = [];
                                  if (mediaFiles.length > 0) {
                                    try {
                                      for (const file of mediaFiles) {
                                        const fd = new FormData();
                                        fd.append("file", file);
                                        const uploadRes = await fetch("/api/uploads", {
                                          method: "POST",
                                          body: fd,
                                        });
                                        
                                        if (uploadRes.ok) {
                                          const uploadData = await uploadRes.json();
                                          if (uploadData.success && uploadData.url) {
                                            finalMediaUrls.push(uploadData.url);
                                          }
                                        } else {
                                          throw new Error(`Upload failed for ${file.name}`);
                                        }
                                      }
                                      
                                      console.log('[Schedule] Uploaded to R2:', finalMediaUrls);
                                    } catch (error: any) {
                                      console.error("Upload error:", error);
                                      toast({
                                        title: "Upload thất bại",
                                        description: error.message || "Không thể upload ảnh",
                                        variant: "destructive",
                                      });
                                      return; // Stop if upload fails
                                    }
                                  } else if (mediaUrls.length > 0) {
                                    // Transfer AI-generated images (external URLs) to R2
                                    try {
                                      const transferResponse = await fetch("/api/media/transfer", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ urls: mediaUrls }),
                                      });
                                      
                                      if (transferResponse.ok) {
                                        const transferData = await transferResponse.json();
                                        if (transferData.success && transferData.urls) {
                                          finalMediaUrls = transferData.urls;
                                          console.log('[Schedule] Transferred to R2:', transferData.urls);
                                        }
                                      } else {
                                        console.error('[Schedule] Transfer failed:', await transferResponse.text());
                                      }
                                    } catch (error) {
                                      console.error("[Schedule] Media transfer error:", error);
                                      finalMediaUrls = mediaUrls; // Fallback to original URLs
                                    }
                                  }

                                  // Combine date + time to ISO string
                                  const scheduledAt = new Date(
                                    `${scheduleDate}T${scheduleTime}:00`
                                  ).toISOString();

                                  const res = await fetch("/api/schedule", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      content_text: generatedContent,
                                      hashtags: apiResult?.data?.hashtags || [],
                                      media: finalMediaUrls,
                                      platforms,
                                      scheduled_at: scheduledAt,
                                      timezone: "Asia/Ho_Chi_Minh",
                                      // userId is now extracted from JWT cookie on the server
                                    }),
                                  });

                                  const data = await res.json();

                                  if (data.success) {
                                    toast({
                                      title: "Đã lên lịch thành công!",
                                      description: `Bài viết sẽ được đăng vào ${new Date(
                                        scheduledAt
                                      ).toLocaleString("vi-VN")}`,
                                    });
                                    setShowScheduleModal(false);
                                    // Refresh schedule list nếu đang ở tab schedule
                                    if (activeTab === "schedule") {
                                      fetchScheduledPosts();
                                    }
                                  } else {
                                    toast({
                                      title: "Lỗi khi lên lịch",
                                      description: data.error || "Vui lòng thử lại",
                                      variant: "destructive",
                                    });
                                  }
                                } catch (error) {
                                  console.error("Schedule error:", error);
                                  toast({
                                    title: "Lỗi kết nối",
                                    description: "Không thể lên lịch bài viết",
                                    variant: "destructive",
                                  });
                                }
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
                  <p className="text-gray-600">
                    Nội dung sẽ hiển thị ở đây sau khi tạo
                  </p>
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
                <CardDescription>
                  Chỉ hiển thị những bài viết đã được lên lịch đăng
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSchedule ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Đang tải lịch đăng bài...</p>
                  </div>
                ) : scheduledPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="font-medium mb-2">
                      Chưa có bài viết nào được lên lịch
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Tạo nội dung và chọn "Chọn lịch đăng" để lên lịch đăng bài
                    </p>
                    <Button onClick={() => setActiveTab("create")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo nội dung mới
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      const weekEnd = new Date(today);
                      weekEnd.setDate(weekEnd.getDate() + 7);

                      const todayPosts = scheduledPosts.filter((p) => {
                        const d = new Date(p.scheduledAt);
                        d.setHours(0, 0, 0, 0);
                        return d.getTime() === today.getTime();
                      });
                      const tomorrowPosts = scheduledPosts.filter((p) => {
                        const d = new Date(p.scheduledAt);
                        d.setHours(0, 0, 0, 0);
                        return d.getTime() === tomorrow.getTime();
                      });
                      const weekPosts = scheduledPosts.filter((p) => {
                        const d = new Date(p.scheduledAt);
                        d.setHours(0, 0, 0, 0);
                        return d > tomorrow && d < weekEnd;
                      });

                      const renderPost = (post: any) => {
                        const platform =
                          post.platforms?.[0] || post.platform || "facebook";
                        const platformConfig: any = {
                          facebook: {
                            icon: "f",
                            color: "bg-blue-500",
                            name: "Facebook",
                          },
                          instagram: {
                            icon: "IG",
                            color:
                              "bg-gradient-to-r from-pink-500 to-orange-500",
                            name: "Instagram",
                          },
                          linkedin: {
                            icon: "in",
                            color: "bg-blue-600",
                            name: "LinkedIn",
                          },
                          twitter: {
                            icon: "X",
                            color: "bg-gray-800",
                            name: "Twitter",
                          },
                          tiktok: {
                            icon: "TT",
                            color: "bg-black",
                            name: "TikTok",
                          },
                          youtube: {
                            icon: "YT",
                            color: "bg-red-500",
                            name: "YouTube",
                          },
                        };
                        const config =
                          platformConfig[platform] || platformConfig.facebook;
                        const time = new Date(
                          post.scheduledAt
                        ).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        const preview =
                          post.contentText?.slice(0, 50) +
                          (post.contentText?.length > 50 ? "..." : "");
                        
                        // Status badge config
                        const statusConfig: any = {
                          PENDING: { label: 'Chờ đăng', color: 'bg-yellow-100 text-yellow-700' },
                          PROCESSING: { label: 'Đang đăng', color: 'bg-blue-100 text-blue-700' },
                          SUCCESS: { label: 'Đã đăng', color: 'bg-green-100 text-green-700' },
                          ERROR: { label: 'Lỗi', color: 'bg-red-100 text-red-700' },
                          CANCELLED: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-700' },
                        };
                        const statusInfo = statusConfig[post.status] || statusConfig.PENDING;
                        const canEdit = ['PENDING', 'ERROR'].includes(post.status);

                        return (
                          <div
                            key={post.id}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              post.status === 'ERROR' ? 'bg-red-50' : 
                              post.status === 'SUCCESS' ? 'bg-green-50' : 'bg-blue-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 ${config.color} rounded-full flex items-center justify-center`}
                              >
                                <span className="text-white text-xs">
                                  {config.icon}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  {preview || "Không có tiêu đề"}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {time} - {post.status === 'SUCCESS' ? 'Đã đăng' : post.status === 'ERROR' ? 'Đăng thất bại' : 'Đã lên lịch'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className={statusInfo.color}
                              >
                                {statusInfo.label}
                              </Badge>
                              {canEdit && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={async () => {
                                      const newTime = prompt('Nhập thời gian mới (YYYY-MM-DD HH:MM)', 
                                        new Date(post.scheduledAt).toISOString().slice(0, 16).replace('T', ' '));
                                      if (!newTime) return;
                                      
                                      try {
                                        const scheduled_at = new Date(newTime.replace(' ', 'T')).toISOString();
                                        const res = await fetch(`/api/schedule/${post.id}`, {
                                          method: 'PATCH',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ scheduled_at })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                          toast({ title: 'Đã cập nhật thời gian!' });
                                          fetchScheduledPosts();
                                        } else {
                                          toast({ title: 'Lỗi', description: data.error, variant: 'destructive' });
                                        }
                                      } catch (error) {
                                        toast({ title: 'Lỗi kết nối', variant: 'destructive' });
                                      }
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={async () => {
                                      if (!confirm('Xóa bài đã lên lịch này?')) return;
                                      try {
                                        const res = await fetch(`/api/schedule/${post.id}`, { method: 'DELETE' });
                                        const data = await res.json();
                                        if (data.success) {
                                          toast({ title: 'Đã xóa!' });
                                          fetchScheduledPosts();
                                        } else {
                                          toast({ title: 'Lỗi', description: data.error, variant: 'destructive' });
                                        }
                                      } catch (error) {
                                        toast({ title: 'Lỗi kết nối', variant: 'destructive' });
                                      }
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      };

                      return (
                        <>
                          {todayPosts.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3 flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                Hôm nay - {today.toLocaleDateString("vi-VN")}
                              </h4>
                              <div className="space-y-3">
                                {todayPosts.map(renderPost)}
                              </div>
                            </div>
                          )}
                          {tomorrowPosts.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3 flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                Ngày mai - {tomorrow.toLocaleDateString("vi-VN")}
                              </h4>
                              <div className="space-y-3">
                                {tomorrowPosts.map(renderPost)}
                              </div>
                            </div>
                          )}
                          {weekPosts.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3 flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                Tuần này
                              </h4>
                              <div className="space-y-3">
                                {weekPosts.map(renderPost)}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
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
                      <span className="text-sm text-gray-600">
                        9:00 AM, 2:00 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Instagram</span>
                      <span className="text-sm text-gray-600">
                        11:00 AM, 7:00 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">LinkedIn</span>
                      <span className="text-sm text-gray-600">
                        8:00 AM, 12:00 PM
                      </span>
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
                    <span className="font-medium">{scheduledPosts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sẽ đăng hôm nay</span>
                    <span className="font-medium">
                      {
                        scheduledPosts.filter((p) => {
                          const d = new Date(p.scheduledAt);
                          const today = new Date();
                          return d.toDateString() === today.toDateString();
                        }).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sẽ đăng tuần này</span>
                    <span className="font-medium text-green-600">
                      {
                        scheduledPosts.filter((p) => {
                          const d = new Date(p.scheduledAt);
                          const today = new Date();
                          const weekEnd = new Date(today);
                          weekEnd.setDate(weekEnd.getDate() + 7);
                          return d >= today && d <= weekEnd;
                        }).length
                      }
                    </span>
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
            <p className="text-gray-600">
              Sử dụng templates có sẵn để tạo nội dung nhanh chóng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Social Media Templates */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-700">
                    Social Media
                  </Badge>
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Engagement Post</CardTitle>
                <CardDescription>
                  Template để tăng tương tác trên social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">
                    "🤔 Câu hỏi cho cộng đồng: [Câu hỏi liên quan đến ngành] 💭
                    Chia sẻ ý kiến của bạn trong comment! #[Hashtag]
                    #[Industry]"
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
                <CardDescription>
                  Template cho bài viết hướng dẫn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">
                    "# Cách [Làm gì đó] trong [Thời gian] ## Giới thiệu [Vấn đề
                    cần giải quyết] ## Bước 1: [Tiêu đề bước] [Hướng dẫn chi
                    tiết]..."
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
                <CardDescription>
                  Script cho video demo sản phẩm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">
                    "Hook: [Vấn đề khách hàng gặp phải] Problem: [Mô tả chi tiết
                    vấn đề] Solution: [Giới thiệu sản phẩm] Demo: [Hướng dẫn sử
                    dụng] CTA: [Lời kêu gọi hành động]"
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
                    "Subject: [Tiêu đề hấp dẫn] Xin chào [Tên], 📰 Tin tức nổi
                    bật tuần này: • [Tin 1] • [Tin 2] 💡 Tips hữu ích: [Mẹo] 🔗
                    [CTA Button]"
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
                <CardDescription>
                  Template cho quảng cáo Facebook
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">
                    "Headline: [Lợi ích chính] Primary Text: 🎯 [Vấn đề target
                    audience] ✅ [Giải pháp của bạn] 🚀 [Kết quả/Lợi ích] CTA:
                    [Hành động mong muốn]"
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
            <p className="text-gray-600">
              Tạo nhiều bài viết cùng lúc với AI thông minh
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Bulk Content Generator
              </CardTitle>
              <CardDescription>
                Tạo 10-50 bài viết cùng lúc dựa trên chủ đề và keywords
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bulk-topic">Chủ đề chính *</Label>
                  <Input
                    id="bulk-topic"
                    placeholder="VD: Digital Marketing 2024"
                  />
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
                <Label htmlFor="bulk-keywords">
                  Keywords (mỗi từ khóa một dòng)
                </Label>
                <Textarea
                  id="bulk-keywords"
                  placeholder="AI marketing&#10;Social media automation&#10;Content strategy&#10;Digital transformation&#10;Marketing analytics"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Tạo 20 bài viết sẽ mất khoảng 3-5 phút. Bạn sẽ nhận được thông
                  báo khi hoàn thành.
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
              <CardDescription>
                Các lần tạo nội dung hàng loạt trước đây
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Digital Marketing 2024</h4>
                    <p className="text-sm text-gray-600">
                      25 bài viết • Hoàn thành 2 ngày trước
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-700">
                      Hoàn thành
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Tải xuống
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Social Media Tips</h4>
                    <p className="text-sm text-gray-600">
                      15 bài viết • Đang xử lý (75%)
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-700">
                      Đang xử lý
                    </Badge>
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
  );
}
