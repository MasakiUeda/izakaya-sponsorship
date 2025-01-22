'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateContent } from '../actions'
import { ImageUpload } from './image-upload'
import { useToast } from '@/components/ui/use-toast'
import { Toast } from '@/components/ui/toast'
import Image from 'next/image'

interface ImageData {
  id: string
  url: string
}

interface AdminFormProps {
  initialData: {
    shopName: string
    message: string
    deadline: string
    images: ImageData[]
    lineQrCode: string
    lineFriendUrl: string
  }
}

export function AdminForm({ initialData }: AdminFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(initialData)
  const { toast, showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateContent(formData)
      if (result.success) {
        showToast({
          title: "更新成功",
          description: "内容が正常に更新されました。",
        })
        router.push('/')
      } else {
        throw new Error(result.error || '更新に失敗しました')
      }
    } catch (error) {
      console.error('更新エラー:', error)
      showToast({
        title: "更新エラー",
        description: "内容の更新に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="shopName">店名</Label>
          <Input
            id="shopName"
            value={formData.shopName}
            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="message">メッセージ</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            className="min-h-[150px]"
          />
        </div>

        <div>
          <Label htmlFor="deadline">募集期限</Label>
          <Input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>店舗写真</Label>
          <div className="mt-2">
            <ImageUpload
              currentImages={formData.images}
              onImagesChange={(images) => setFormData({ ...formData, images })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="lineFriendUrl">LINE友だち追加URL</Label>
            <Input
              id="lineFriendUrl"
              value={formData.lineFriendUrl}
              onChange={(e) => setFormData({ ...formData, lineFriendUrl: e.target.value })}
              placeholder="https://lin.ee/xxxxxxxx"
            />
          </div>

          <div>
            <Label>LINE QRコード</Label>
            <div className="mt-2">
              <ImageUpload
                currentImages={formData.lineQrCode ? [{ id: 'qr', url: formData.lineQrCode }] : []}
                onImagesChange={(images) => setFormData({ ...formData, lineQrCode: images[0]?.url || '' })}
                maxImages={1}
              />
            </div>
            {formData.lineQrCode && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">現在のQRコード：</p>
                <div className="relative w-[200px] h-[200px]">
                  <Image
                    src={formData.lineQrCode || "/placeholder.svg"}
                    alt="LINE QRコード"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push('/')}>
          キャンセル
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '更新中...' : '保存する'}
        </Button>
      </div>
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => showToast(null)}
        />
      )}
    </form>
  )
}

