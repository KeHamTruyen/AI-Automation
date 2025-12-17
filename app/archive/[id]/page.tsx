"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function DraftDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [hashtags, setHashtags] = useState<string>("")
  const [platforms, setPlatforms] = useState<string[]>([])
  const [media, setMedia] = useState<string[]>([])
  const [publishedAt, setPublishedAt] = useState<string>("")
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        // Try to load as published content first
        let res = await fetch(`/api/contents/${params.id}`)
        let json = await res.json()
        
        if (json?.success) {
          const d = json.data
          setTitle(d.title || "")
          setContent(d.content || "")
          const tags = Array.isArray(d.hashtags) ? d.hashtags.join(" ") : ""
          setHashtags(tags)
          setPlatforms(d.platforms || [])
          setMedia(d.media || [])
          setPublishedAt(d.publishedAt || "")
          setIsPublished(true)
        } else {
          // If not found in published, try to load as draft
          res = await fetch(`/api/drafts/${params.id}`)
          json = await res.json()
          
          if (json?.success) {
            const d = json.data
            setTitle(d.title || "")
            setContent(d.content || "")
            const tags = Array.isArray(d.hashtags) ? d.hashtags.join(" ") : ""
            setHashtags(tags)
            setIsPublished(false)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  const handleSave = async () => {
    try {
      setSaving(true)
      const body: any = { title, content_text: content }
      if (hashtags.trim()) body.hashtags = hashtags
      const res = await fetch(`/api/drafts/${params.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Save failed")
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">← Quay lại</Button>
        <Card>
          <CardHeader>
            <CardTitle>{isPublished ? "Chi tiết bài đăng" : "Chỉnh sửa bản nháp"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-sm text-gray-500">Đang tải…</div>
            ) : isPublished ? (
              /* Read-only view for published content */
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{title || "Không có tiêu đề"}</h2>
                  {publishedAt && (
                    <div className="text-sm text-gray-500 mb-4">
                      Đã xuất bản: {new Date(publishedAt).toLocaleString('vi-VN')}
                    </div>
                  )}
                </div>
                
                {platforms.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-semibold mb-2">Nền tảng:</div>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map(p => (
                        <Badge key={p} variant="secondary">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-sm font-semibold mb-2">Nội dung:</div>
                  <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border">
                    {content || "Không có nội dung"}
                  </div>
                </div>

                {hashtags && (
                  <div className="mb-4">
                    <div className="text-sm font-semibold mb-2">Hashtags:</div>
                    <div className="flex flex-wrap gap-2">
                      {hashtags.split(/\s+/).filter(Boolean).map((h) => (
                        <Badge key={h} variant="outline">{h}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {media.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold mb-2">Hình ảnh ({media.length}):</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {media.map((url, idx) => (
                        <div key={idx} className="relative w-full aspect-square overflow-hidden rounded-lg border bg-gray-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Edit view for draft content */
              <>
                <Input placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Textarea rows={14} placeholder="Nội dung" value={content} onChange={(e) => setContent(e.target.value)} />
                <Input placeholder="#hashtag1 #hashtag2 …" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
                {!hashtags.trim() && (
                  <div className="text-xs text-gray-500">N/A — Chưa có dữ liệu hashtags từ máy chủ</div>
                )}
                <div className="flex flex-wrap gap-2">
                  {hashtags.split(/\s+/).filter(Boolean).map((h) => (
                    <Badge key={h} variant="outline">{h}</Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving}>{saving ? "Đang lưu…" : "Lưu nháp"}</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
