'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { saveSponsor } from '@/app/actions/sponsor'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getContent } from '@/app/admin/actions'

const MOBILE_BREAKPOINT = 768 // モバイルブレークポイント

export function SponsorshipForm() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sponsorshipType, setSponsorshipType] = useState<'fixed' | 'custom'>('fixed')
  const [customAmount, setCustomAmount] = useState<string>('')
  const [lineRegistration, setLineRegistration] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const [content, setContent] = useState<{ lineQrCode: string; lineFriendUrl: string } | null>(null)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    const loadContent = async () => {
      const data = await getContent()
      if (data) {
        setContent(data)
      }
    }
    loadContent()
    
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  const resetForm = () => {
    formRef.current?.reset()
    setSponsorshipType('fixed')
    setCustomAmount('')
    setLineRegistration(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      if (sponsorshipType === 'custom') {
        formData.set('amount', customAmount)
      }
      formData.set('lineRegistration', lineRegistration.toString())
      const result = await saveSponsor(formData)

      if (result.success) {
        setIsSubmitted(true)
        resetForm()
        router.refresh()
      } else {
        setError(result.error || '送信に失敗しました。')
      }
    } catch (error) {
      setError('送信中にエラーが発生しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSponsorshipTypeChange = (value: string) => {
    setSponsorshipType(value as 'fixed' | 'custom')
    if (value === 'fixed') {
      setCustomAmount('')
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">ご協賛ありがとうございます</h2>
        <p className="text-lg mb-6">協賛情報が正常に送信されました。</p>
        <Button onClick={() => setIsSubmitted(false)}>
          新しい協賛を登録する
        </Button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">協賛者情報</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">お名前</Label>
          <Input
            id="name"
            name="name"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
          />
        </div>
        <div>
          <Label htmlFor="sponsorship">協賛金額</Label>
          <Select name="sponsorship" onValueChange={handleSponsorshipTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="口数を選択してください" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(10)].map((_, i) => (
                <SelectItem key={i} value={`${i + 1}`}>{`${i + 1}口 (${(i + 1) * 5000}円)`}</SelectItem>
              ))}
              <SelectItem value="custom">任意の金額</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {sponsorshipType === 'custom' && (
          <div>
            <Label htmlFor="customAmount">金額（円）</Label>
            <Input
              id="customAmount"
              name="customAmount"
              type="number"
              min="1"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <Label htmlFor="message">お店へ一言</Label>
          <Textarea
            id="message"
            name="message"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="lineRegistration"
            checked={lineRegistration}
            onCheckedChange={(checked) => setLineRegistration(checked as boolean)}
          />
          <Label htmlFor="lineRegistration">
            LINE友だち登録で最新情報をGET（任意）
          </Label>
        </div>

        {lineRegistration && content && (
          <div className="mt-6 p-6 bg-[#00B900]/10 rounded-lg text-center">
            {isMobile ? (
              <>
                <Button 
                  onClick={() => window.open(content.lineFriendUrl, '_blank')}
                  className="bg-[#00B900] hover:bg-[#00A000] text-white text-lg px-8 py-6 mb-4"
                >
                  LINE友だち追加ページへ
                </Button>
                <p className="text-sm text-gray-600">
                  ※タップするとLINE友だち追加ページが開きます
                </p>
              </>
            ) : (
              <>
                {content.lineQrCode && (
                  <div className="flex justify-center mb-6">
                    <div className="relative w-[300px] h-[300px]">
                      <Image 
                        src={content.lineQrCode || "/placeholder.svg"}
                        alt="LINE QRコード" 
                        fill
                        className="object-contain"
                        priority
                        unoptimized
                      />
                    </div>
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  ※スマートフォンでQRコードを読み取ってください
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}
      <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
        {isSubmitting ? '送信中...' : '協賛者情報を送信する'}
      </Button>
    </form>
  )
}

