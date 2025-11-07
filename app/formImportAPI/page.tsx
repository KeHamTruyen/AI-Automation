"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  X,
  Check,
  LucideIcon,
} from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation"; // Dùng Next.js Router để chuyển trang

const SocialMediaManager = () => {
  const router = useRouter();
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [apiKeys, setApiKeys] = useState<{ [key: string]: string }>({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [userToken] = useState(
    `token_${Math.random().toString(36).substr(2, 9)}`
  );

  const platforms: Platform[] = [
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-600",
    },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "text-sky-500" },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-700",
    },
  ];

  // Khi component mount → đọc API keys đã lưu trong localStorage
  useEffect(() => {
    const savedKeys = localStorage.getItem("social_api_keys");
    if (savedKeys) {
      const parsedKeys = JSON.parse(savedKeys);
      setApiKeys(parsedKeys);

      // Tự động chọn các nền tảng đã có API key
      const activePlatforms = Object.keys(parsedKeys).filter(
        (key) => parsedKeys[key]?.trim() !== ""
      );
      setSelectedPlatforms(activePlatforms);
    }
  }, []);

  // Lưu API key khi người dùng thay đổi
  const handleApiKeyChange = (platform: string, value: string) => {
    const updatedKeys = { ...apiKeys, [platform]: value };
    setApiKeys(updatedKeys);
    setError("");

    // Lưu vào localStorage mỗi khi có thay đổi
    localStorage.setItem("social_api_keys", JSON.stringify(updatedKeys));
  };

  // Chọn thêm mạng xã hội
  const handlePlatformSelect = (platformId: string) => {
    if (!selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
    setShowPlatformDropdown(false);
  };

  // Xóa hoàn toàn API key + ẩn nền tảng khỏi danh sách hiển thị
  const handleRemovePlatform = (platformId: string) => {
    //  Xóa khỏi selectedPlatforms (ẩn khỏi giao diện)
    const updatedPlatforms = selectedPlatforms.filter((p) => p !== platformId);
    setSelectedPlatforms(updatedPlatforms);

    //  Xóa API key của nền tảng đó
    const updatedKeys = { ...apiKeys, [platformId]: "" };
    setApiKeys(updatedKeys);

    // Lưu lại localStorage (đồng bộ)
    localStorage.setItem("social_api_keys", JSON.stringify(updatedKeys));
  };

  // Khi bấm “Tiếp tục”
  const handleSubmitApiKeys = () => {
    const hasAtLeastOneKey = Object.values(apiKeys).some(
      (key) => key.trim() !== ""
    );
    if (!hasAtLeastOneKey) {
      setError(" Vui lòng nhập ít nhất 1 API key để tiếp tục");
      return;
    }

    localStorage.setItem("social_api_keys", JSON.stringify(apiKeys));
    router.push("/brand-analysis"); // chuyển sang trang phân tích thương hiệu
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kết nối mạng xã hội
          </h1>
          <p className="text-gray-600 mb-8">
            Nhập API keys để bắt đầu quản lý tài khoản mạng xã hội của bạn
          </p>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Nút chọn nền tảng */}
          <div className="mb-6">
            <button
              onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Thêm nền tảng mạng xã hội</span>
            </button>

            {showPlatformDropdown && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformSelect(platform.id)}
                      disabled={isSelected}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                        isSelected ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${platform.color}`} />
                      <span className="font-medium">{platform.name}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 ml-auto text-green-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form nhập API Key */}
          <div className="space-y-4">
            {selectedPlatforms.map((platformId) => {
              const platform = platforms.find((p) => p.id === platformId);
              if (!platform) return null;
              const Icon = platform.icon;
              return (
                <div
                  key={platformId}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-5 h-5 ${platform.color}`} />
                    <span className="font-semibold">{platform.name}</span>
                    <button
                      onClick={() => handleRemovePlatform(platformId)}
                      className="ml-auto text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder={`Nhập API key cho ${platform.name}`}
                    value={apiKeys[platformId]}
                    onChange={(e) =>
                      handleApiKeyChange(platformId, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              );
            })}
          </div>

          {/* Nút gửi */}
          {selectedPlatforms.length > 0 && (
            <button
              onClick={handleSubmitApiKeys}
              className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Tiếp tục
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaManager;
