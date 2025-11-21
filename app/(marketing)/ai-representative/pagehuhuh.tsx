// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Slider } from "@/components/ui/slider"
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
// import {
//   Brain,
//   Bot,
//   Mic,
//   Video,
//   User,
//   Palette,
//   Play,
//   Pause,
//   Volume2,
//   Download,
//   Wand2,
//   Eye,
//   Edit,
//   CheckCircle,
//   ArrowRight,
//   Globe,
//   ArrowLeft,
//   Home,
// } from "lucide-react"
// import Link from "next/link"

// export default function AIRepresentativePage() {
//   const [activeTab, setActiveTab] = useState("create")
//   const [avatarStep, setAvatarStep] = useState(1)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [voicePreview, setVoicePreview] = useState(false)

//   const handleGenerateAvatar = () => {
//     setIsGenerating(true)
//     setTimeout(() => {
//       setIsGenerating(false)
//       setAvatarStep(4)
//     }, 3000)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50">
//       {/* Header */}
//       <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Link href="/" className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//                 <Brain className="w-5 h-5 text-white" />
//               </div>
//               <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 AI Marketing Engine
//               </span>
//             </Link>

//             {/* Breadcrumb */}
//             <Breadcrumb className="hidden md:block">
//               <BreadcrumbList>
//                 <BreadcrumbItem>
//                   <BreadcrumbLink asChild>
//                     <Link href="/" className="flex items-center">
//                       <Home className="w-4 h-4" />
//                     </Link>
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem>
//                   <BreadcrumbLink asChild>
//                     <Link href="/dashboard">Dashboard</Link>
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem>
//                   <span className="font-medium">AI đại diện</span>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Link href="/dashboard">
//               <Button variant="outline" size="sm">
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Dashboard
//               </Button>
//             </Link>
//             <Link href="/performance-management">
//               <Button variant="ghost" size="sm">
//                 Quản lý hiệu suất
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="py-16 px-4">
//         <div className="container mx-auto text-center">
//           <Badge className="mb-4 bg-pink-100 text-pink-700">🤖 AI đại diện thương hiệu</Badge>
//           <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
//             Phát triển AI đại diện
//             <br />
//             cho thương hiệu
//           </h1>
//           <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
//             Tạo AI Avatar, Voice AI, video clips và chatbot thông minh để đại diện cho thương hiệu của bạn. Tương tác
//             tự nhiên và chuyên nghiệp 24/7.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
//             >
//               <Bot className="w-5 h-5 mr-2" />
//               Tạo AI Avatar
//             </Button>
//             <Button size="lg" variant="outline">
//               <Play className="w-5 h-5 mr-2" />
//               Xem demo
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* AI Representative Interface */}
//       <section className="py-16 px-4 bg-white">
//         <div className="container mx-auto">
//           <div className="max-w-7xl mx-auto">
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
//               <TabsList className="grid w-full grid-cols-5">
//                 <TabsTrigger value="create">Tạo Avatar</TabsTrigger>
//                 <TabsTrigger value="voice">Voice AI</TabsTrigger>
//                 <TabsTrigger value="video">Video AI</TabsTrigger>
//                 <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
//                 <TabsTrigger value="manage">Quản lý</TabsTrigger>
//               </TabsList>

//               {/* Create Avatar Tab */}
//               <TabsContent value="create">
//                 <div className="space-y-8">
//                   <div className="text-center">
//                     <h2 className="text-2xl font-bold mb-4">Tạo AI Avatar</h2>
//                     <p className="text-gray-600">Tạo đại diện AI chuyên nghiệp cho thương hiệu của bạn</p>
//                   </div>

//                   {avatarStep < 4 ? (
//                     <div className="max-w-4xl mx-auto">
//                       {/* Progress Steps */}
//                       <div className="flex items-center justify-center mb-8">
//                         <div className="flex items-center space-x-4">
//                           {[1, 2, 3].map((step) => (
//                             <div key={step} className="flex items-center">
//                               <div
//                                 className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                                   step <= avatarStep
//                                     ? "bg-pink-600 text-white"
//                                     : "bg-gray-200 text-gray-600"
//                                 }`}
//                               >
//                                 {step}
//                               </div>
//                               {step < 3 && (
//                                 <div
//                                   className={`w-16 h-1 mx-2 ${
//                                     step < avatarStep ? "bg-pink-600" : "bg-gray-200"
//                                   }`}
//                                 />
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Step 1: Basic Info */}
//                       {avatarStep === 1 && (
//                         <Card>
//                           <CardHeader>
//                             <CardTitle className="flex items-center">
//                               <User className="w-5 h-5 mr-2 text-pink-600" />
//                               Thông tin cơ bản
//                             </CardTitle>
//                             <CardDescription>Cung cấp thông tin cơ bản cho AI Avatar</CardDescription>
//                           </CardHeader>
//                           <CardContent className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                               <div className="space-y-2">
//                                 <Label htmlFor="avatar-name">Tên Avatar *</Label>
//                                 <Input id="avatar-name" placeholder="VD: Sarah, Alex, Minh..." />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor="avatar-role">Vai trò *</Label>
//                                 <Select>
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Chọn vai trò" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="brand-ambassador">Brand Ambassador</SelectItem>
//                                     <SelectItem value="customer-support">Customer Support</SelectItem>
//                                     <SelectItem value="sales-rep">Sales Representative</SelectItem>
//                                     <SelectItem value="educator">Educator/Trainer</SelectItem>
//                                     <SelectItem value="host">Host/Presenter</SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                             </div>

//                             <div className="space-y-2">
//                               <Label htmlFor="avatar-description">Mô tả tính cách *</Label>
//                               <Textarea
//                                 id="avatar-description"
//                                 placeholder="Mô tả tính cách, phong cách giao tiếp và đặc điểm của Avatar..."
//                                 rows={4}
//                               />
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                               <div className="space-y-2">
//                                 <Label htmlFor="avatar-age">Độ tuổi</Label>
//                                 <Select>
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Chọn độ tuổi" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="20-25">20-25 tuổi</SelectItem>
//                                     <SelectItem value="26-35">26-35 tuổi</SelectItem>
//                                     <SelectItem value="36-45">36-45 tuổi</SelectItem>
//                                     <SelectItem value="46-55">46-55 tuổi</SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor="avatar-gender">Giới tính</Label>
//                                 <Select>
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Chọn giới tính" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="female">Nữ</SelectItem>
//                                     <SelectItem value="male">Nam</SelectItem>
//                                     <SelectItem value="neutral">Trung tính</SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                             </div>

//                             <div className="space-y-2">
//                               <Label htmlFor="avatar-expertise">Chuyên môn</Label>
//                               <Textarea
//                                 id="avatar-expertise"
//                                 placeholder="Lĩnh vực chuyên môn, kiến thức mà Avatar sẽ chia sẻ..."
//                                 rows={3}
//                               />
//                             </div>

//                             <div className="flex justify-end">
//                               <Button onClick={() => setAvatarStep(2)}>
//                                 Tiếp theo
//                                 <ArrowRight className="w-4 h-4 ml-2" />
//                               </Button>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       )}

//                       {/* Step 2: Appearance */}
//                       {avatarStep === 2 && (
//                         <Card>
//                           <CardHeader>
//                             <CardTitle className="flex items-center">
//                               <Palette className="w-5 h-5 mr-2 text-purple-600" />
//                               Ngoại hình & Phong cách
//                             </CardTitle>
//                             <CardDescription>Tùy chỉnh ngoại hình và phong cách của Avatar</CardDescription>
//                           </CardHeader>
//                           <CardContent className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                               {/* Appearance Settings */}
//                               <div className="space-y-6">
//                                 <div className="space-y-2">
//                                   <Label>Kiểu tóc</Label>
//                                   <Select>
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Chọn kiểu tóc" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="short">Tóc ngắn</SelectItem>
//                                       <SelectItem value="medium">Tóc vừa</SelectItem>
//                                       <SelectItem value="long">Tóc dài</SelectItem>
//                                       <SelectItem value="curly">Tóc xoăn</SelectItem>
//                                       <SelectItem value="straight">Tóc thẳng</SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>

//                                 <div className="space-y-2">
//                                   <Label>Màu tóc</Label>
//                                   <Select>
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Chọn màu tóc" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="black">Đen</SelectItem>
//                                       <SelectItem value="brown">Nâu</SelectItem>
//                                       <SelectItem value="blonde">Vàng</SelectItem>
//                                       <SelectItem value="red">Đỏ</SelectItem>
//                                       <SelectItem value="gray">Xám</SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>

//                                 <div className="space-y-2">
//                                   <Label>Phong cách trang phục</Label>
//                                   <Select>
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Chọn phong cách" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="business">Business/Formal</SelectItem>
//                                       <SelectItem value="casual">Casual</SelectItem>
//                                       <SelectItem value="creative">Creative</SelectItem>
//                                       <SelectItem value="tech">Tech/Modern</SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>

//                                 <div className="space-y-2">
//                                   <Label>Màu sắc chủ đạo</Label>
//                                   <div className="grid grid-cols-4 gap-2">
//                                     {[
//                                       "bg-blue-500",
//                                       "bg-green-500",
//                                       "bg-purple-500",
//                                       "bg-red-500",
//                                       "bg-yellow-500",
//                                       "bg-pink-500",
//                                       "bg-gray-500",
//                                       "bg-black",
//                                     ].map((color) => (
//                                       <button
//                                         key={color}
//                                         className={`w-12 h-12 rounded-lg ${color} border-2 border-gray-200 hover:border-gray-400`}
//                                       />
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Preview */}
//                               <div className="space-y-4">
//                                 <Label>Preview Avatar</Label>
//                                 <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
//                                   <div className="text-center">
//                                     <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                                     <p className="text-gray-600">Avatar preview sẽ hiển thị ở đây</p>
//                                     <p className="text-sm text-gray-500 mt-2">
//                                       Sử dụng AI để tạo hình ảnh thực tế
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <Button className="w-full bg-transparent" variant="outline">
//                                   <Eye className="w-4 h-4 mr-2" />
//                                   Xem trước
//                                 </Button>
//                               </div>
//                             </div>

//                             <div className="flex justify-between">
//                               <Button variant="outline" onClick={() => setAvatarStep(1)}>
//                                 Quay lại
//                               </Button>
//                               <Button onClick={() => setAvatarStep(3)}>
//                                 Tiếp theo
//                                 <ArrowRight className="w-4 h-4 ml-2" />
//                               </Button>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       )}

//                       {/* Step 3: Voice & Behavior */}
//                       {avatarStep === 3 && (
//                         <Card>
//                           <CardHeader>
//                             <CardTitle className="flex items-center">
//                               <Mic className="w-5 h-5 mr-2 text-blue-600" />
//                               Giọng nói & Hành vi
//                             </CardTitle>
//                             <CardDescription>Cấu hình giọng nói và cách hành xử của Avatar</CardDescription>
//                           </CardHeader>
//                           <CardContent className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                               {/* Voice Settings */}
//                               <div className="space-y-6">
//                                 <div className="space-y-2">
//                                   <Label>Giọng nói</Label>
//                                   <Select>
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Chọn giọng nói" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="female-young">Nữ - Trẻ trung</SelectItem>
//                                       <SelectItem value="female-mature">Nữ - Chín chắn</SelectItem>
//                                       <SelectItem value="male-young">Nam - Trẻ trung</SelectItem>
//                                       <SelectItem value="male-mature">Nam - Chín chắn</SelectItem>
//                                       <SelectItem value="neutral">Trung tính</SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>

//                                 <div className="space-y-2">
//                                   <Label>Tốc độ nói</Label>
//                                   <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
//                                   <div className="flex justify-between text-sm text-gray-500">
//                                     <span>Chậm</span>
//                                     <span>Nhanh</span>
//                                   </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                   <Label>Âm điệu</Label>
//                                   <Slider defaultValue={[60]} max={100} step={1} className="w-full" />
//                                   <div className="flex justify-between text-sm text-gray-500">
//                                     <span>Trầm</span>
//                                     <span>Cao</span>
//                                   </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                   <Label>Ngôn ngữ</Label>
//                                   <div className="space-y-2">
//                                     <label className="flex items-center space-x-2 cursor-pointer">
//                                       <input type="checkbox" className="rounded" defaultChecked />
//                                       <span className="text-sm">Tiếng Việt</span>
//                                     </label>
//                                     <label className="flex items-center space-x-2 cursor-pointer">
//                                       <input type="checkbox" className="rounded" />
//                                       <span className="text-sm">English</span>
//                                     </label>
//                                     <label className="flex items-center space-x-2 cursor-pointer">
//                                       <input type="checkbox" className="rounded" />
//                                       <span className="text-sm">中文</span>
//                                     </label>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Behavior Settings */}
//                               <div className="space-y-6">
//                                 <div className="space-y-2">
//                                   <Label>Phong cách giao tiếp</Label>
//                                   <Select>
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Chọn phong cách" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="professional">Chuyên nghiệp</SelectItem>
//                                       <SelectItem value="friendly">Thân thiện</SelectItem>
//                                       <SelectItem value="casual">Thoải mái</SelectItem>
//                                       <SelectItem value="authoritative">Uy tín</SelectItem>
//                                       <SelectItem value="enthusiastic">Nhiệt tình</SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>

//                                 <div className="space-y-2">
//                                   <Label>Cử chỉ & Biểu cảm</Label>
//                                   <div className="space-y-2">
//                                     <label className="flex items-center space-x-2 cursor-pointer">
//                                       <input type="checkbox" className="rounded" defaultChecked />
//                                       <span className="text-sm">Cử chỉ tay tự nhiên</span>
//                                     </label>
//                                     <label className="flex items-center space-x-2 cursor-pointer">
//                                       <input type="checkbox" className="rounded" defaultChecked />
//                                       <span className="text-sm">Biểu cảm khuôn mặt</span>
//                                     </label>
//                                     <label className="flex items-center space-x-2 cursor-pointer">
//                                       <input type="checkbox" className="rounded" />
//                                       <span className="text-sm">Chuyển động cơ thể</span>
//                                     </label>
//                                   </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                   <Label>Mức độ tương tác</Label>
//                                   <Slider defaultValue={[70]} max={100} step={1} className="w-full" />
//                                   <div className="flex justify-between text-sm text-gray-500">
//                                     <span>Ít tương tác</span>
//                                     <span>Nhiều tương tác</span>
//                                   </div>
//                                 </div>

//                                 <div className="p-4 bg-blue-50 rounded-lg">
//                                   <h4 className="font-medium mb-2 flex items-center">
//                                     <Volume2 className="w-4 h-4 mr-2 text-blue-600" />
//                                     Test giọng nói
//                                   </h4>
//                                   <p className="text-sm text-gray-600 mb-3">
//                                     "Xin chào! Tôi là AI Avatar của bạn. Tôi sẽ giúp đại diện cho thương hiệu một cách
//                                     chuyên nghiệp."
//                                   </p>
//                                   <Button
//                                     size="sm"
//                                     onClick={() => setVoicePreview(!voicePreview)}
//                                     className="bg-blue-600"
//                                   >
//                                     {voicePreview ? (
//                                       <>
//                                         <Pause className="w-4 h-4 mr-2" />
//                                         Dừng
//                                       </>
//                                     ) : (
//                                       <>
//                                         <Play className="w-4 h-4 mr-2" />
//                                         Nghe thử
//                                       </>
//                                     )}
//                                   </Button>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="flex justify-between">
//                               <Button variant="outline" onClick={() => setAvatarStep(2)}>
//                                 Quay lại
//                               </Button>
//                               <Button onClick={handleGenerateAvatar} disabled={isGenerating}>
//                                 {isGenerating ? (
//                                   <>
//                                     <Wand2 className="w-4 h-4 mr-2 animate-spin" />
//                                     Đang tạo Avatar...
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Wand2 className="w-4 h-4 mr-2" />
//                                     Tạo Avatar
//                                   </>
//                                 )}
//                               </Button>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       )}
//                     </div>
//                   ) : (
//                     /* Step 4: Generated Avatar */
//                     <div className="max-w-4xl mx-auto">
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center">
//                             <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
//                             Avatar đã được tạo thành công!
//                           </CardTitle>
//                           <CardDescription>
//                             AI Avatar của bạn đã sẵn sàng để sử dụng
//                           </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                             {/* Avatar Preview */}
//                             <div className="space-y-4">
//                               <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
//                                 <div className="text-center">
//                                   <Bot className="w-20 h-20 text-pink-600 mx-auto mb-4" />
//                                   <h3 className="text-xl font-semibold mb-2">Sarah</h3>
//                                   <p className="text-gray-600">Brand Ambassador</p>
//                                 </div>
//                               </div>
//                               <div className="flex space-x-2">
//                                 <Button className="flex-1">
//                                   <Play className="w-4 h-4 mr-2" />
//                                   Test Avatar
//                                 </Button>
//                                 <Button variant="outline">
//                                   <Edit className="w-4 h-4" />
//                                 </Button>
//                                 <Button variant="outline">
//                                   <Download className="w-4 h-4" />
//                                 </Button>
//                               </div>
//                             </div>

//                             {/* Avatar Details */}
//                             <div className="space-y-6">
//                               <div>
//                                 <h4 className="font-semibold mb-3">Thông tin Avatar</h4>
//                                 <div className="space-y-2 text-sm">
//                                   <div className="flex justify-between">
//                                     <span>Tên:</span>
//                                     <span className="font-medium">Sarah</span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span>Vai trò:</span>
//                                     <span className="font-medium">Brand Ambassador</span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span>Giọng nói:</span>
//                                     <span className="font-medium">Nữ - Chín chắn</span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span>Ngôn ngữ:</span>
//                                     <span className="font-medium">Tiếng Việt, English</span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span>Phong cách:</span>
//                                     <span className="font-medium">Chuyên nghiệp, Thân thiện</span>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div>
//                                 <h4 className="font-semibold mb-3">Khả năng</h4>
//                                 <div className="space-y-2">
//                                   <div className="flex items-center space-x-2">
//                                     <CheckCircle className="w-4 h-4 text-green-600" />
//                                     <span className="text-sm">Trả lời câu hỏi về sản phẩm</span>
//                                   </div>
//                                   <div className="flex items-center space-x-2">
//                                     <CheckCircle className="w-4 h-4 text-green-600" />
//                                     <span className="text-sm">Tư vấn khách hàng</span>
//                                   </div>
//                                   <div className="flex items-center space-x-2">
//                                     <CheckCircle className="w-4 h-4 text-green-600" />
//                                     <span className="text-sm">Thuyết trình sản phẩm</span>
//                                   </div>
//                                   <div className="flex items-center space-x-2">
//                                     <CheckCircle className="w-4 h-4 text-green-600" />
//                                     <span className="text-sm">Tương tác social media</span>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="p-4 bg-green-50 rounded-lg">
//                                 <h4 className="font-medium mb-2 text-green-800">Sẵn sàng sử dụng!</h4>
//                                 <p className="text-sm text-green-700 mb-3">
//                                   Avatar của bạn đã được tối ưu và sẵn sàng tích hợp vào website, chatbot hoặc video.
//                                 </p>
//                                 <div className="flex space-x-2">
//                                   <Button size="sm" className="bg-green-600">
//                                     <Globe className="w-4 h-4 mr-2" />
//                                     Tích hợp website
//                                   </Button>
//                                   <Button size="sm" variant="outline">
//                                     <Video className="w-4 h-4 mr-2" />
//                                     Tạo video
//                                   </Button>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   )}
//                 </div>
//               </TabsContent>

//               {/* Voice AI Tab */}
//               <TabsContent value="voice">
//                 <div className="space-y-8">
//                   <div className="text-center">
//                     <h2 className="text-2xl font-bold mb-4">Voice AI</h2>
//                     <p className="text-gray-600">Tạo giọng nói AI tự nhiên cho thương hiệu</p>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     {/* Voice Creation */}
//                     <Card>
//                       <CardHeader>
//                         <CardTitle className="flex items-center">
//                           <Mic className="w-5 h-5 mr-2 text-blue-600" />
//                           Tạo Voice AI
//                         </CardTitle>
//                         <CardDescription>Clone giọng nói hoặc tạo giọng nói mới</CardDescription>
//                       </CardHeader>
//                       <CardContent className="space-y-6">
//                         <div className="space-y-2">
//                           <Label>Phương pháp tạo giọng</Label>
//                           <div className="space-y-3">
//                             <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
//                               <input type="radio" name="voice-method" className="rounded-full" />
//                               <div>
//                                 <h4 className="font-medium">Tạo giọng mới</h4>
//                                 <p className="text-sm text-gray-500">Sử dụng AI để tạo giọng nói hoàn toàn mới</p>
//                               </div>
//                             </label>
//                             <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
//                               <input type="radio" name="voice-method" className="rounded-full" />
//                               <div>
//                                 <h4 className="font-medium">Clone giọng nói</h4>
//                                 <p className="text-sm text-gray-500">Upload mẫu giọng để AI học và tái tạo</p>
//                               </div>
//                             </label>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }
