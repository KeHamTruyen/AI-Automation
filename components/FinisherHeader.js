"use client"; // Chỉ chạy trên client
import { ArrowDown } from "lucide-react";
import { useEffect } from "react";

export default function FinisherHeaderClient() {
  useEffect(() => {
    // Load script dynamically
    const script = document.createElement("script");
    script.src = "/finisher-header.es5.min.js";
    script.onload = () => {
      new FinisherHeader({
        count: 35,
        size: { min: 8, max: 200, pulse: 0.1 },
        speed: { x: { min: 0, max: 0.2 }, y: { min: 0, max: 0.8 } },
        colors: {
          background: "#e0e7ff",
          particles: ["#2563eb", "#7c3aed", "#db2777", "#3b82f6", "#8b5cf6"],
        },
        blending: "overlay",
        opacity: { center: 0, edge: 0.7 },
        skew: -2,
        shapes: ["c"],
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="header finisher-header relative flex items-center justify-center"
      style={{ width: "100%", height: "800px" }}
    >
      {/* Nội dung chính */}
      <div className="z-10 text-center px-6 md:px-12 lg:px-24">
        <h1
          className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent 
                       bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
        >
          <strong>Khám Phá</strong> Sức Mạnh <strong>AI Marketing</strong>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
          Tối ưu <strong>chiến dịch</strong>, nâng cao
          <strong> doanh thu </strong>, và tiếp cận <strong>khách hàng </strong>
          thông minh hơn bao giờ hết.
          <br />
          Trở thành người tiên phong trong thời đại
          <strong> marketing số</strong>.
        </p>

        {/* Mũi tên chỉ xuống lơ lửng */}
        <div className="flex justify-center">
          <ArrowDown className="animate-bounce text-blue-600 w-24 h-24" />
        </div>
      </div>
    </div>
  );
}
