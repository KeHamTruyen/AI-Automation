"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Mic } from "lucide-react";
import Link from "next/link";
export default function VoiceAITab() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Voice AI</h2>
        <p className="text-gray-600">
          Tạo giọng nói AI tự nhiên cho thương hiệu
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Voice Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="w-5 h-5 mr-2 text-blue-600" />
              Tạo Voice AI
            </CardTitle>
            <CardDescription>
              Clone giọng nói hoặc tạo giọng nói mới
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Phương pháp tạo giọng</Label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="voice-method"
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">Tạo giọng mới</h4>
                    <p className="text-sm text-gray-500">
                      Sử dụng AI để tạo giọng nói hoàn toàn mới
                    </p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="voice-method"
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">Clone giọng nói</h4>
                    <p className="text-sm text-gray-500">
                      Upload mẫu giọng để AI học và tái tạo
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
