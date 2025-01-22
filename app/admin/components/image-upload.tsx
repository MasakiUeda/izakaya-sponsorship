'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { uploadImage } from '../actions'
import { X } from 'lucide-react'

interface ImageData {
  id: string
  url: string
}

interface ImageUploadProps {
  currentImages: ImageData[]
  onImagesChange: (images: ImageData[]) => void
  maxImages?: number
}

export function ImageUpload({ currentImages, onImagesChange, maxImages = Infinity }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (currentImages.length >= maxImages) {
      setError(`画像は${maxImages}枚までアップロードできます`)
      return
    }

    // ファイルサイズチェック (5MB制限)
    if (file.size > 5 * 1024 * 1024) {
      setError('ファイルサイズは5MB以下にしてください')
      return
    }

    // 画像ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルのみアップロード可能です')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const url = await uploadImage(formData)
      
      // 新しい画像を追加
      const newImage: ImageData = {
        id: Date.now().toString(),
        url: url
      }
      onImagesChange([...currentImages, newImage])
    } catch (error) {
      console.error('アップロードエラー:', error)
      setError('画像のアップロードに失敗しました')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = (imageId: string) => {
    const updatedImages = currentImages.filter(img => img.id !== imageId)
    onImagesChange(updatedImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading || currentImages.length >= maxImages}
        />
        {isUploading && (
          <p className="text-sm text-muted-foreground">アップロード中...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* アップロード済み画像一覧 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentImages.map((image) => (
          <div key={image.id} className="relative group">
            <div className="relative w-full h-32">
              <Image
                src={image.url || "/placeholder.svg"}
                alt="アップロード画像"
                fill
                className="rounded-lg object-cover"
                unoptimized
              />
            </div>
            <button
              onClick={() => handleRemoveImage(image.id)}
              className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

