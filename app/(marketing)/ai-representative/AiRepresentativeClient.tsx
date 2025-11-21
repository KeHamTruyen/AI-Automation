"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import VideoAITab from "./tabsAI/VideoAITab";
import ChatbotTab from "./tabsAI/ChatbotTab";
import ManageTab from "./tabsAI/ManageTab";
import CreateAvatarTab from "./tabsAI/CreateAvatarTab";
import VoiceAITab from "./tabsAI/VoiceAITab";

export default function AiRepresentativeClient() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <section className="py-16 px-4 bg-white">
      {/* AI Representative Interface */}
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="create">Tạo Avatar</TabsTrigger>
              <TabsTrigger value="voice">Voice AI</TabsTrigger>
              <TabsTrigger value="video">Video AI</TabsTrigger>
              <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
              <TabsTrigger value="manage">Quản lý</TabsTrigger>
            </TabsList>

            {/* Các tab riêng biệt */}
            <TabsContent value="create">
              <CreateAvatarTab />
            </TabsContent>

            <TabsContent value="voice">
              <VoiceAITab />
            </TabsContent>

            <TabsContent value="video">
              <VideoAITab />
            </TabsContent>

            <TabsContent value="chatbot">
              <ChatbotTab />
            </TabsContent>

            <TabsContent value="manage">
              <ManageTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
