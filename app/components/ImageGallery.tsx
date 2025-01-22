'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageData {
  id: string
  url: string
}

interface ImageGalleryProps {
  images: ImageData[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  if (images.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* メイン画像 */}
      <div className="relative w-full" style={{ height: '400px' }}>
        <Image
          src={images[selectedImageIndex].url || "/placeholder.svg"}
          alt="店舗写真"
          fill
          className="rounded-lg object-contain"
          unoptimized
          priority
        />
      </div>

      {/* サムネイル画像一覧 */}
      {images.length > 1 && (
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap justify-center space-x-1">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-14 h-14 flex-shrink-0 ${
                  selectedImageIndex === index ? 'ring-2 ring-primary z-10' : ''
                }`}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt="店舗写真サムネイル"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

