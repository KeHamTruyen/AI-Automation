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
  Brain,
  Calendar,
  Video,
  FileText,
  MessageSquare,
  Zap,
  Clock,
  Share2,
  Settings,
  Pause,
  Edit,
  Copy,
  Download,
  Plus,
  Wand2,
  Target,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ContentCreationForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("create"); // tab hien tai (neu sau nay co nhieu tab)
  const [isGenerating, setIsGenerating] = useState(false); // trang thai loading khi tao noi dung
  const [generatedContent, setGeneratedContent] = useState(""); // luu noi dung tra ve tu n8n
  const [scheduleDate, setScheduleDate] = useState(""); // ngay hen gio dang bai
  const [scheduleTime, setScheduleTime] = useState(""); // gio hen gio dang bai
  const [showScheduleModal, setShowScheduleModal] = useState(false); // hien modal hen gio (neu can dung)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  //  Các trường dữ liệu động của form
  // - người dùng có 1 vài trường dữ liệu có thể bỏ hoặc nhập
  // - chỉ có 1 vài trường là bắt buộc
  const [formData, setFormData] = useState({
    contentType: "", // loại nội dung
    topic: "", // chủ đề
    audience: "", // đối tượng khách
    tone: "", // phong cách
    length: "", // độ dài
    additionalInfo: "", // thông tin bổ sung
    platforms: [] as string[], // danh sách mạng xã hội
  });
  // Trạng thái API key đã lưu
  const [apiKeys, setApiKeys] = useState<{ [key: string]: string }>({});
  // Khi trang mở -> đọc API keys từ localStorage

  useEffect(() => {
    // Lấy dữ liệu API key đã lưu
    const savedKeys = localStorage.getItem("social_api_keys");
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  }, []);
  // hàm cập nhật dữ liệu form
  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  // hàm sử lý người dùng tick hoặc bỏ tick MXH
  const handlePlatformToggle = (platform: string) => {
    // Chỉ cho phép toggle nếu có API key
    if (!apiKeys[platform.toLowerCase()]) return;
    setFormData((prev) => {
      const exists = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: exists
          ? prev.platforms.filter((p) => p !== platform)
          : [...prev.platforms, platform],
      };
    });
  };

  // hàm gửi dữ liệu lên n8n để tạo ND
  const handleGenerateContent = async () => {
    if (!formData.topic || !formData.contentType) {
      alert("Vui lòng nhập chủ đề và chọn loại nội dung!");
      return;
    }
    if (!formData.platforms.length) {
      alert("Vui lòng chọn ít nhất một nền tảng mạng xã hội!");
      return;
    }
    setIsGenerating(true);
    try {
      const apiKeysStored = JSON.parse(
        localStorage.getItem("social_api_keys") || "{}"
      );
      const payload = {
        user_id: getCookie("userToken"),
        api_keys: apiKeysStored,
        content_type: formData.contentType,
        topic: formData.topic,
        audience: formData.audience,
        tone: formData.tone,
        length: formData.length,
        additional_info: formData.additionalInfo,
        platforms: formData.platforms,
      };

      const res = await axios.post(
        "https://n8n.daisuyeuthuong.com/webhook/APIKey-register",
        payload
      );

      const data = res.data;
      console.log("Response from Workflow A/B:", data);

      setGeneratedContent(data.content || "Không có nội dung trả về.");
      setGeneratedImage(data.image || null);
    } catch (err) {
      console.error(err);
      setGeneratedContent("Đã xảy ra lỗi khi tạo nội dung!");
      setGeneratedImage(null);
    } finally {
      setIsGenerating(false);
    }
  };
  // Copy nội dung ra clipboard
  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      alert("Đã sao chép nội dung!");
    }
  };
  const handleAddApiKey = () => {
    router.push("/formImportAPI");
  };
  const platforms = [
    {
      name: "Facebook",
      icon: "f",
      color: "bg-blue-500",
    },
    {
      name: "Instagram",
      icon: "IG",
      color: "bg-gradient-to-r from-pink-500 to-orange-500",
    },
    {
      name: "LinkedIn",
      icon: "in",
      color: "bg-blue-600",
    },
    { name: "TikTok", icon: "TT", color: "bg-black" },
    {
      name: "YouTube",
      icon: "YT",
      color: "bg-red-500",
    },
    {
      name: "Twitter",
      icon: "X",
      color: "bg-gray-800",
    },
  ];

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
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
                  <Label htmlFor="content-type">Loại nội dung *</Label>
                  <Select
                    value={formData.contentType}
                    onValueChange={(v) => handleChange("contentType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại nội dung" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social-post">
                        Social Media Post
                      </SelectItem>
                      <SelectItem value="blog-article">
                        Bài viết Blog
                      </SelectItem>
                      <SelectItem value="video-script">Script Video</SelectItem>
                      <SelectItem value="email-newsletter">
                        Email Newsletter
                      </SelectItem>
                      <SelectItem value="product-description">
                        Mô tả sản phẩm
                      </SelectItem>
                      <SelectItem value="ad-copy">Quảng cáo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Chủ đề */}
                <div className="space-y-2">
                  <Label htmlFor="topic">Chủ đề/Từ khóa *</Label>
                  <Input
                    value={formData.topic}
                    onChange={(e) => handleChange("topic", e.target.value)}
                    id="topic"
                    placeholder="VD: AI trong marketing, xu hướng công nghệ 2024..."
                  />
                </div>
                {/* Đối tượng */}
                <div className="space-y-2">
                  <Label htmlFor="target-audience">Đối tượng mục tiêu</Label>
                  <Select
                    value={formData.audience}
                    onValueChange={(v) => handleChange("audience", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đối tượng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business-owners">
                        Chủ doanh nghiệp
                      </SelectItem>
                      <SelectItem value="marketers">Marketer</SelectItem>
                      <SelectItem value="developers">Developer</SelectItem>
                      <SelectItem value="students">Sinh viên</SelectItem>
                      <SelectItem value="general">Đại chúng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Giọng nói */}
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone of Voice</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(v) => handleChange("tone", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">
                        Chuyên nghiệp
                      </SelectItem>
                      <SelectItem value="friendly">Thân thiện</SelectItem>
                      <SelectItem value="casual">Thoải mái</SelectItem>
                      <SelectItem value="authoritative">Uy tín</SelectItem>
                      <SelectItem value="inspiring">Truyền cảm hứng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Độ dài */}
                <div className="space-y-2">
                  <Label htmlFor="length">Độ dài nội dung</Label>
                  <Select
                    value={formData.length}
                    onValueChange={(v) => handleChange("length", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn độ dài" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Ngắn (50-100 từ)</SelectItem>
                      <SelectItem value="medium">
                        Trung bình (100-300 từ)
                      </SelectItem>
                      <SelectItem value="long">Dài (300-500 từ)</SelectItem>
                      <SelectItem value="very-long">
                        Rất dài (500+ từ)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Thông tin bổ sung */}
                <div className="space-y-2">
                  <Label htmlFor="additional-info">Thông tin bổ sung</Label>
                  <Textarea
                    id="additional-info"
                    placeholder="Thêm thông tin cụ thể, yêu cầu đặc biệt..."
                    rows={3}
                    value={formData.additionalInfo}
                    onChange={(e) =>
                      handleChange("additionalInfo", e.target.value)
                    }
                  />
                </div>
                {/* Nền tảng */}
                <div className="space-y-4">
                  <Label>Nền tảng đăng bài</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.map((p) => {
                      const lower = p.name.toLowerCase();
                      const hasKey =
                        apiKeys[lower] && apiKeys[lower].trim() !== "";
                      const checked = formData.platforms.includes(p.name);
                      return (
                        <label
                          key={p.name}
                          className={`flex items-center gap-2 p-2 rounded border ${
                            hasKey
                              ? "border-green-400 shadow-md animate-pulse"
                              : "border-gray-200 opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={!hasKey}
                            checked={checked}
                            onChange={() => handlePlatformToggle(p.name)}
                          />
                          <div
                            className={`w-6 h-6 ${p.color} rounded text-white text-xs flex items-center justify-center`}
                          >
                            {p.name[0]}
                          </div>
                          <span className="text-sm">{p.name}</span>
                        </label>
                      );
                    })}
                  </div>
                  <Button
                    onClick={handleAddApiKey}
                    variant="outline"
                    className="mt-4 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Thêm API Key
                  </Button>
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
                      <Button size="sm" variant="outline" onClick={handleCopy}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      {/* để nâng cấp sao */}
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
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
                    {/* Kết quả */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm">
                        {generatedContent}
                      </pre>
                      {generatedImage && (
                        <div>
                          <img
                            src={generatedImage}
                            alt="Generated content"
                            className="max-w-full rounded-md"
                          />
                        </div>
                      )}
                    </div>
                    {/* Phần sao thì phải nâng cấp thêm  */}
                    {/* Content Analytics Preview */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          8.5/10
                        </div>
                        <div className="text-xs text-gray-600">
                          Engagement Score
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          92%
                        </div>
                        <div className="text-xs text-gray-600">Brand Match</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">
                          156
                        </div>
                        <div className="text-xs text-gray-600">Từ</div>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                        onClick={() => {
                          // Handle immediate publish
                          console.log("Publishing immediately...");
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Đăng ngay
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
                                  ? `${new Date(
                                      scheduleDate
                                    ).toLocaleDateString(
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
                                onClick={() => {
                                  // Handle schedule
                                  console.log(
                                    "Scheduling for:",
                                    scheduleDate,
                                    scheduleTime
                                  );
                                  setShowScheduleModal(false);
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
                              <div className="text-sm font-medium">
                                Behind the scenes video
                              </div>
                              <div className="text-xs text-gray-600">
                                2:00 PM - Đã lên lịch
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-700"
                            >
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
                              <div className="text-sm font-medium">
                                Weekly newsletter
                              </div>
                              <div className="text-xs text-gray-600">
                                5:00 PM - Đã lên lịch
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="bg-purple-100 text-purple-700"
                            >
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
                              <div className="text-sm font-medium">
                                Marketing tips for SME
                              </div>
                              <div className="text-xs text-gray-600">
                                9:00 AM - Đã lên lịch
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-700"
                            >
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
                              <div className="text-sm font-medium">
                                Product demo video
                              </div>
                              <div className="text-xs text-gray-600">
                                3:00 PM - Đã lên lịch
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="bg-orange-100 text-orange-700"
                            >
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
                              <div className="text-sm font-medium">
                                Industry insights thread
                              </div>
                              <div className="text-xs text-gray-600">
                                18/01 - 10:00 AM - Đã lên lịch
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-700"
                            >
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
                              <div className="text-sm font-medium">
                                Trending challenge video
                              </div>
                              <div className="text-xs text-gray-600">
                                19/01 - 7:00 PM - Đã lên lịch
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="bg-pink-100 text-pink-700"
                            >
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
                        <h3 className="font-medium mb-2">
                          Chưa có bài viết nào được lên lịch
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Tạo nội dung và chọn "Chọn lịch đăng" để lên lịch đăng
                          bài
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
                      "🤔 Câu hỏi cho cộng đồng: [Câu hỏi liên quan đến ngành]
                      💭 Chia sẻ ý kiến của bạn trong comment! #[Hashtag]
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
                      "# Cách [Làm gì đó] trong [Thời gian] ## Giới thiệu [Vấn
                      đề cần giải quyết] ## Bước 1: [Tiêu đề bước] [Hướng dẫn
                      chi tiết]..."
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
                    <Badge className="bg-purple-100 text-purple-700">
                      Video
                    </Badge>
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
                      "Hook: [Vấn đề khách hàng gặp phải] Problem: [Mô tả chi
                      tiết vấn đề] Solution: [Giới thiệu sản phẩm] Demo: [Hướng
                      dẫn sử dụng] CTA: [Lời kêu gọi hành động]"
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
                    <Badge className="bg-orange-100 text-orange-700">
                      Email
                    </Badge>
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Newsletter</CardTitle>
                  <CardDescription>
                    Template cho email newsletter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      "Subject: [Tiêu đề hấp dẫn] Xin chào [Tên], 📰 Tin tức nổi
                      bật tuần này: • [Tin 1] • [Tin 2] 💡 Tips hữu ích: [Mẹo]
                      🔗 [CTA Button]"
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
              <h2 className="text-2xl font-bold mb-4">
                Tạo nội dung hàng loạt
              </h2>
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
                    <Label>Loại nội dung</Label>
                    <div className="space-y-2">
                      {[
                        "Social posts",
                        "Blog articles",
                        "Email subjects",
                        "Ad copies",
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
                    Tạo 20 bài viết sẽ mất khoảng 3-5 phút. Bạn sẽ nhận được
                    thông báo khi hoàn thành.
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
    </>
  );
}
function getCookie(name: string): string | null {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}
