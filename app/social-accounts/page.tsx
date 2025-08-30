"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Plus,
  Settings,
  Trash2,
  RefreshCw,
  Users,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  BarChart3,
  MessageSquare,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface SocialAccount {
  id: string
  platform: "facebook" | "instagram" | "twitter" | "linkedin" | "youtube"
  name: string
  username: string
  followers: number
  isActive: boolean
  status: "connected" | "error" | "pending"
  lastSync: string
  engagement: number
  posts: number
  avatar: string
}

const platformConfig = {
  facebook: { icon: Facebook, color: "bg-blue-600", name: "Facebook" },
  instagram: { icon: Instagram, color: "bg-pink-600", name: "Instagram" },
  twitter: { icon: Twitter, color: "bg-sky-500", name: "Twitter" },
  linkedin: { icon: Linkedin, color: "bg-blue-700", name: "LinkedIn" },
  youtube: { icon: Youtube, color: "bg-red-600", name: "YouTube" },
}

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: "1",
      platform: "facebook",
      name: "Công ty ABC",
      username: "@congtyabc",
      followers: 15420,
      isActive: true,
      status: "connected",
      lastSync: "2024-01-15T10:30:00Z",
      engagement: 85,
      posts: 142,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "2",
      platform: "instagram",
      name: "ABC Company",
      username: "@abc_company",
      followers: 8750,
      isActive: true,
      status: "connected",
      lastSync: "2024-01-15T09:15:00Z",
      engagement: 92,
      posts: 89,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "3",
      platform: "twitter",
      name: "ABC Corp",
      username: "@abccorp",
      followers: 5230,
      isActive: false,
      status: "error",
      lastSync: "2024-01-14T16:45:00Z",
      engagement: 67,
      posts: 234,
      avatar: "/placeholder-user.jpg",
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [syncingAccounts, setSyncingAccounts] = useState<Set<string>>(new Set())

  const totalFollowers = accounts.reduce((sum, account) => sum + account.followers, 0)
  const activeAccounts = accounts.filter((account) => account.isActive).length
  const totalPosts = accounts.reduce((sum, account) => sum + account.posts, 0)

  const handleToggleAccount = async (accountId: string) => {
    setAccounts((prev) =>
      prev.map((account) => (account.id === accountId ? { ...account, isActive: !account.isActive } : account)),
    )
    toast.success("Cập nhật trạng thái tài khoản thành công")
  }

  const handleSyncAccount = async (accountId: string) => {
    setSyncingAccounts((prev) => new Set(prev).add(accountId))

    // Simulate API call
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === accountId
            ? { ...account, lastSync: new Date().toISOString(), status: "connected" as const }
            : account,
        ),
      )
      setSyncingAccounts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(accountId)
        return newSet
      })
      toast.success("Đồng bộ tài khoản thành công")
    }, 2000)
  }

  const handleDeleteAccount = async (accountId: string) => {
    setAccounts((prev) => prev.filter((account) => account.id !== accountId))
    toast.success("Xóa tài khoản thành công")
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("vi-VN")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Đã kết nối"
      case "error":
        return "Lỗi kết nối"
      case "pending":
        return "Đang kết nối"
      default:
        return "Không xác định"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Quản lý Tài khoản MXH</h1>
            <p className="text-muted-foreground">Quản lý và theo dõi các tài khoản mạng xã hội đã liên kết</p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm tài khoản
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm tài khoản mạng xã hội</DialogTitle>
              <DialogDescription>Chọn nền tảng mạng xã hội bạn muốn kết nối</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {Object.entries(platformConfig).map(([platform, config]) => {
                const Icon = config.icon
                return (
                  <Button
                    key={platform}
                    variant="outline"
                    className="h-20 flex-col space-y-2 bg-transparent"
                    onClick={() => {
                      toast.success(`Đang kết nối với ${config.name}...`)
                      setIsAddDialogOpen(false)
                    }}
                  >
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm">{config.name}</span>
                  </Button>
                )
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng tài khoản</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-xs text-muted-foreground">{activeAccounts} đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Followers</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalFollowers)}</div>
            <p className="text-xs text-muted-foreground">Trên tất cả nền tảng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAccounts}</div>
            <p className="text-xs text-muted-foreground">Tài khoản đã bật</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng bài đăng</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">Đã được đăng</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Danh sách tài khoản</h2>

        {accounts.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Chưa có tài khoản nào</h3>
                <p className="text-muted-foreground">Thêm tài khoản mạng xã hội đầu tiên để bắt đầu</p>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm tài khoản
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => {
              const config = platformConfig[account.platform]
              const Icon = config.icon
              const isSyncing = syncingAccounts.has(account.id)

              return (
                <Card key={account.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${config.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{account.name}</CardTitle>
                          <CardDescription>{account.username}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(account.status)}
                        <Badge variant={account.status === "connected" ? "default" : "destructive"}>
                          {getStatusText(account.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Followers</div>
                        <div className="font-semibold">{formatNumber(account.followers)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Bài đăng</div>
                        <div className="font-semibold">{account.posts}</div>
                      </div>
                    </div>

                    {/* Engagement */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tương tác</span>
                        <span className="font-medium">{account.engagement}%</span>
                      </div>
                      <Progress value={account.engagement} className="h-2" />
                    </div>

                    {/* Last Sync */}
                    <div className="text-xs text-muted-foreground">
                      Đồng bộ lần cuối: {formatDate(account.lastSync)}
                    </div>

                    <Separator />

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch checked={account.isActive} onCheckedChange={() => handleToggleAccount(account.id)} />
                        <Label className="text-sm">Hoạt động</Label>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSyncAccount(account.id)}
                          disabled={isSyncing}
                        >
                          <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                        </Button>

                        <Dialog
                          open={isSettingsOpen && selectedAccount?.id === account.id}
                          onOpenChange={(open) => {
                            setIsSettingsOpen(open)
                            if (!open) setSelectedAccount(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedAccount(account)}>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Cài đặt tài khoản</DialogTitle>
                              <DialogDescription>Quản lý cài đặt cho {account.name}</DialogDescription>
                            </DialogHeader>

                            <Tabs defaultValue="general" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="general">Chung</TabsTrigger>
                                <TabsTrigger value="permissions">Quyền</TabsTrigger>
                                <TabsTrigger value="analytics">Thống kê</TabsTrigger>
                              </TabsList>

                              <TabsContent value="general" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="display-name">Tên hiển thị</Label>
                                    <Input id="display-name" defaultValue={account.name} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" defaultValue={account.username} disabled />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="description">Mô tả</Label>
                                  <Textarea id="description" placeholder="Mô tả về tài khoản này..." />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="post-frequency">Tần suất đăng bài</Label>
                                  <Select defaultValue="daily">
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="hourly">Mỗi giờ</SelectItem>
                                      <SelectItem value="daily">Hàng ngày</SelectItem>
                                      <SelectItem value="weekly">Hàng tuần</SelectItem>
                                      <SelectItem value="monthly">Hàng tháng</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TabsContent>

                              <TabsContent value="permissions" className="space-y-4">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <Label>Đăng bài tự động</Label>
                                      <p className="text-sm text-muted-foreground">
                                        Cho phép hệ thống đăng bài tự động
                                      </p>
                                    </div>
                                    <Switch defaultChecked />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <Label>Trả lời bình luận</Label>
                                      <p className="text-sm text-muted-foreground">Tự động trả lời bình luận</p>
                                    </div>
                                    <Switch />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <Label>Phân tích dữ liệu</Label>
                                      <p className="text-sm text-muted-foreground">Thu thập dữ liệu phân tích</p>
                                    </div>
                                    <Switch defaultChecked />
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="analytics" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Tương tác trung bình</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">{account.engagement}%</div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Tăng trưởng</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold text-green-600">+12.5%</div>
                                    </CardContent>
                                  </Card>
                                </div>
                                <div className="space-y-2">
                                  <Label>Hiệu suất 30 ngày qua</Label>
                                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                                    <span className="ml-2 text-muted-foreground">Biểu đồ sẽ hiển thị ở đây</span>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>

                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                                Hủy
                              </Button>
                              <Button
                                onClick={() => {
                                  setIsSettingsOpen(false)
                                  toast.success("Cập nhật cài đặt thành công")
                                }}
                              >
                                Lưu thay đổi
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa tài khoản <strong>{account.name}</strong>? Hành động này không
                                thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAccount(account.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Xóa tài khoản
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
