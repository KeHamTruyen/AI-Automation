"use client";
import React from "react";
import Link from "next/link";
import { Brain, MessageSquare, Globe } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AI Marketing Engine</span>
            </div>
            <p className="text-gray-400 mb-4">
              Nền tảng AI marketing toàn diện cho doanh nghiệp hiện đại.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Sản phẩm</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Phân tích thương hiệu
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Tạo nội dung AI
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Quản lý đa nền tảng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  AI Avatar
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Hướng dẫn sử dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Công ty</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AI Marketing Engine. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
