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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/drafts/${params.id}`)
        const json = await res.json()
        if (json?.success) {
          const d = json.data
          setTitle(d.title || "")
          setContent(d.content || "")
          // server may not include hashtags until migration; accept string join fallback
          const tags = Array.isArray(d.hashtags) ? d.hashtags.join(" ") : ""
          setHashtags(tags)
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
            <CardTitle>Chỉnh sửa bản nháp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-sm text-gray-500">Đang tải…</div>
            ) : (
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
