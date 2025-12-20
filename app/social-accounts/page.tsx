"use client"

import { useEffect, useState } from "react"
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
  Play,
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
  n8nWebhookUrl?: string | null
}

const platformConfig = {
  facebook: { icon: Facebook, color: "bg-blue-600", name: "Facebook" },
  instagram: { icon: Instagram, color: "bg-pink-600", name: "Instagram" },
  twitter: { icon: Twitter, color: "bg-sky-500", name: "Twitter" },
  linkedin: { icon: Linkedin, color: "bg-blue-700", name: "LinkedIn" },
  youtube: { icon: Youtube, color: "bg-red-600", name: "YouTube" },
}

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [provLoading, setProvLoading] = useState(false)
  const [provPlatform, setProvPlatform] = useState<string>("")
  const [provName, setProvName] = useState("")
  const [provUsername, setProvUsername] = useState("")
  const [provMode, setProvMode] = useState<"token" | "byo" | "oauth">("token")
  const [provAccessToken, setProvAccessToken] = useState("")
  const [provClientId, setProvClientId] = useState("")
  const [provClientSecret, setProvClientSecret] = useState("")
  const [provResult, setProvResult] = useState<{ webhookUrl?: string; connectUrl?: string; oauthNeeded?: boolean; oauthStartUrl?: string } | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [syncingAccounts, setSyncingAccounts] = useState<Set<string>>(new Set())

  // Auto-set mode when platform changes
  useEffect(() => {
    if (provPlatform === 'linkedin') {
      setProvMode('oauth')
    } else if (provPlatform === 'facebook' || provPlatform === 'instagram') {
      setProvMode('token')
    }
  }, [provPlatform])

  async function loadAccounts() {
    try {
      setLoading(true)
      const res = await fetch("/api/social-accounts", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok || !data?.success) throw new Error(data?.error || "Không tải được danh sách tài khoản")
      setAccounts(data.data || [])
    } catch (e: any) {
      console.error(e)
      toast.error(e?.message || "Lỗi tải danh sách tài khoản")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
    
    // Check if redirected back from OAuth callback
    const params = new URLSearchParams(window.location.search)
    if (params.get('connected') === 'linkedin') {
      toast.success("Kết nối LinkedIn thành công!")
      // Clear URL params
      window.history.replaceState({}, '', '/social-accounts')
    } else if (params.get('error')) {
      const errorMsg = params.get('message') || 'OAuth failed'
      toast.error(`Lỗi: ${errorMsg}`)
      window.history.replaceState({}, '', '/social-accounts')
    }
  }, [])

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
    try {
      // Deprovision n8n resources and clear metadata first
      const res = await fetch(`/api/integrations/n8n/provision?socialAccountId=${encodeURIComponent(accountId)}`, {
        method: "DELETE",
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data?.success === false) {
        // Not fatal: still try to delete the account locally
        console.warn("Deprovision failed or partial:", data?.error)
      }
      // Remove the account from DB entirely
      const del = await fetch(`/api/social-accounts/${encodeURIComponent(accountId)}`, { method: "DELETE" })
      if (!del.ok) {
        const j = await del.json().catch(() => ({}))
        throw new Error(j?.error || "Xóa tài khoản thất bại")
      }
      await loadAccounts()
      toast.success("Xóa tài khoản thành công")
    } catch (e: any) {
      console.error(e)
      toast.error(e?.message || "Không thể xóa tài khoản")
    }
  }

  const handleTestAccount = async (account: SocialAccount) => {
    try {
      const res = await fetch('/api/integrations/n8n/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialAccountId: account.id, platform: account.platform })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data?.success === false) {
        throw new Error(data?.error || `Test thất bại (${res.status})`)
      }
      const extId = data?.data?.externalPostId || data?.data?.id || null
      toast.success(`Test ${account.platform} OK${extId ? ` (ID: ${extId})` : ''}`)
    } catch (e: any) {
      console.error(e)
      toast.error(e?.message || `Không test được ${account.platform}`)
    }
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
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            setProvPlatform("")
            setProvName("")
            setProvUsername("")
            setProvMode("token")
            setProvAccessToken("")
            setProvClientId("")
            setProvClientSecret("")
            setProvResult(null)
            setProvLoading(false)
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm tài khoản
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm tài khoản mạng xã hội</DialogTitle>
              <DialogDescription>Nhập thông tin để kết nối và provision workflow trên n8n</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nền tảng</Label>
                <Select value={provPlatform} onValueChange={setProvPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nền tảng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">
                      <div className="flex items-center">
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </div>
                    </SelectItem>
                    <SelectItem value="linkedin">
                      <div className="flex items-center">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {accounts.find(acc => acc.platform === provPlatform) && (
                  <p className="text-xs text-orange-600">
                    ⚠️ Đã có tài khoản {provPlatform}. Kết nối mới sẽ thay thế tài khoản cũ.
                  </p>
                )}
              </div>

              {provPlatform && (
                <>
                  <div className="space-y-2">
                    <Label>Phương thức kết nối</Label>
                    <Select 
                      value={provMode} 
                      onValueChange={(v: string) => setProvMode(v as 'token' | 'byo' | 'oauth')}
                      disabled={provPlatform === 'linkedin' || provPlatform === 'facebook' || provPlatform === 'instagram'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phương thức" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="token">Dùng Access Token</SelectItem>
                        <SelectItem value="byo">BYO Client ID/Secret</SelectItem>
                        <SelectItem value="oauth">OAuth (đề xuất)</SelectItem>
                      </SelectContent>
                    </Select>
                    {provPlatform === 'linkedin' && (
                      <p className="text-xs text-muted-foreground">
                        ✓ LinkedIn mặc định dùng OAuth (bắt buộc)
                      </p>
                    )}
                    {(provPlatform === 'facebook' || provPlatform === 'instagram') && (
                      <p className="text-xs text-muted-foreground">
                        ✓ {provPlatform === 'facebook' ? 'Facebook' : 'Instagram'} mặc định dùng Access Token
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acc-name">Tên hiển thị</Label>
                    <Input id="acc-name" value={provName} onChange={(e) => setProvName(e.target.value)} placeholder="VD: Fanpage Công ty" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acc-username">Username</Label>
                    <Input id="acc-username" value={provUsername} onChange={(e) => setProvUsername(e.target.value)} placeholder="VD: @company_page" />
                  </div>
                  {provMode === "token" ? (
                    <div className="space-y-2">
                      <Label htmlFor="acc-token">Access Token</Label>
                      <Textarea 
                        id="acc-token" 
                        value={provAccessToken} 
                        onChange={(e) => setProvAccessToken(e.target.value)} 
                        placeholder="Dán token từ nền tảng ở đây"
                        className="min-h-[100px] font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        {provPlatform === 'facebook' && 'Lấy token từ: developers.facebook.com/tools/accesstoken'}
                        {provPlatform === 'instagram' && 'Dùng Facebook token với quyền Instagram'}
                      </p>
                    </div>
                  ) : provMode === 'byo' ? (
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client-id">Client ID</Label>
                        <Input id="client-id" value={provClientId} onChange={(e) => setProvClientId(e.target.value)} placeholder="Nhập Client ID" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-secret">Client Secret</Label>
                        <Input id="client-secret" type="password" value={provClientSecret} onChange={(e) => setProvClientSecret(e.target.value)} placeholder="Nhập Client Secret" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Lưu ý: BYO sẽ lưu cặp Client ID/Secret vào credential trong n8n. Việc trao đổi token OAuth chưa được thực hiện trong bước này.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">✓ Phương thức OAuth</p>
                      <p className="text-sm text-blue-700">
                        Hệ thống sẽ chuyển hướng bạn sang {provPlatform === 'linkedin' ? 'LinkedIn' : provPlatform} để cấp quyền an toàn.
                      </p>
                    </div>
                      )}
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      className="w-full"
                      disabled={provLoading}
                      onClick={async () => {
                        if (!provPlatform || !provName || !provUsername) {
                          toast.error("Vui lòng điền đủ thông tin")
                          return
                        }
                        if (provMode === 'token' && !provAccessToken) {
                          toast.error("Thiếu access token")
                          return
                        }
                        if (provMode === 'byo' && (!provClientId || !provClientSecret)) {
                          toast.error("Thiếu Client ID/Secret")
                          return
                            }
                        setProvLoading(true)
                        setProvResult(null)
                        try {
                      // Check if platform already exists and auto-delete old account
                      const existingAccount = accounts.find(acc => acc.platform === provPlatform)
                      if (existingAccount) {
                        toast.info(`Đang thay thế tài khoản ${provPlatform} cũ...`)
                        try {
                          // Delete old account first
                          const deleteRes = await fetch(`/api/integrations/n8n/provision?socialAccountId=${encodeURIComponent(existingAccount.id)}`, {
                            method: "DELETE",
                          })
                          const deleteData = await deleteRes.json()
                          if (!deleteRes.ok) {
                            console.warn("Auto-delete old account failed:", deleteData?.error)
                          }
                        } catch (deleteError) {
                          console.warn("Error deleting old account:", deleteError)
                          // Continue anyway
                        }
                      }

                      const res = await fetch("/api/integrations/n8n/provision", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(
                          provMode === 'token'
                            ? { platform: provPlatform, name: provName, username: provUsername, accessToken: provAccessToken, mode: 'token' }
                            : provMode === 'byo'
                              ? { platform: provPlatform, name: provName, username: provUsername, mode: 'byo', clientId: provClientId, clientSecret: provClientSecret }
                              : { platform: provPlatform, name: provName, username: provUsername, mode: 'oauth', clientId: provClientId, clientSecret: provClientSecret }
                        ),
                      })
                      const data = await res.json()
                      if (!res.ok || !data?.success) {
                        throw new Error(data?.error || "Provision thất bại")
                      }
                          const webhookUrl = data?.data?.socialAccount?.n8nWebhookUrl
                          const connectUrl = data?.data?.connectUrl
                          const oauthNeeded = data?.data?.oauthNeeded
                          const oauthStartUrl = data?.data?.oauthStartUrl
                          setProvResult({ webhookUrl, connectUrl, oauthNeeded, oauthStartUrl })
                          
                          // For OAuth mode (LinkedIn), auto-redirect to OAuth flow instead of reloading accounts
                          if (provMode === 'oauth' && oauthStartUrl) {
                            toast.success("Đang chuyển sang LinkedIn để cấp quyền...")
                            setTimeout(() => {
                              window.location.href = oauthStartUrl
                            }, 500)
                          } else {
                            toast.success("Kết nối & provision thành công")
                            // Only reload list for non-OAuth modes (token/byo)
                            await loadAccounts()
                          }
                        } catch (e: any) {
                          console.error(e)
                          toast.error(e?.message || "Provision thất bại")
                        } finally {
                          setProvLoading(false)
                        }
                      }}
                    >
                      {provLoading ? "Đang kết nối..." : "Kết nối"}
                    </Button>
                  </div>
                  {/* Webhook URL hidden from users */}
                  {provResult?.oauthNeeded && provResult?.connectUrl && (
                    <div className="text-sm text-muted-foreground">
                      Bước tiếp theo: mở credential trong n8n để kết nối OAuth →{" "}
                      <a className="underline" href={provResult.connectUrl} target="_blank" rel="noreferrer">Open in n8n</a>
                    </div>
                  )}
                  {provResult?.oauthStartUrl && provPlatform === 'linkedin' && (
                    <div className="text-sm text-muted-foreground">
                      Hoặc bắt đầu OAuth LinkedIn trực tiếp →{" "}
                      <a className="underline" href={provResult.oauthStartUrl} target="_blank" rel="noreferrer">Kết nối LinkedIn</a>
                    </div>
                  )}
                  {provResult && (
                    <div className="text-sm text-muted-foreground">
                      {provPlatform === 'linkedin' ? (
                        <button
                          className="underline"
                          onClick={() => {
                            const socialId = (accounts.find(a => a.platform === 'linkedin' && a.username === provUsername) || {}).id
                            if (socialId) {
                              const url = `/api/auth/linkedin?socialId=${encodeURIComponent(socialId)}`
                              window.open(url, '_blank')
                            }
                          }}
                        >
                          Kết nối OAuth LinkedIn ngay
                        </button>
                      ) : null}
                    </div>
                  )}
                </>
              )}
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

        {loading ? (
          <Card className="p-12 text-center">
            <div className="space-y-2">
              <div className="text-lg font-medium">Đang tải dữ liệu...</div>
              <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
            </div>
          </Card>
        ) : accounts.length === 0 ? (
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
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Đồng bộ lần cuối: {formatDate(account.lastSync)}</div>
                      {/* Webhook URL hidden from users */}
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

                        {account.platform === 'linkedin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Kết nối OAuth LinkedIn"
                            onClick={() => {
                              const url = `/api/auth/linkedin?socialId=${encodeURIComponent(account.id)}`
                              window.open(url, '_blank')
                            }}
                          >
                            Kết nối LinkedIn
                          </Button>
                        )}

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
