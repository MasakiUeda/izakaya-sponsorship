'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { saveInquiry } from '@/app/actions/inquiry'

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string | null;
  }>({ type: null, message: null })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setStatus({ type: null, message: null })

    try {
      const formData = new FormData(e.currentTarget)
      const result = await saveInquiry(formData)

      if (result.success) {
        setStatus({
          type: 'success',
          message: 'お問い合わせが正常に送信されました。'
        })
        formRef.current?.reset()
        
        setTimeout(() => {
          setStatus({ type: null, message: null })
        }, 3000)
      } else {
        throw new Error(result.error || '送信に失敗しました。')
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : '送信中にエラーが発生しました。もう一度お試しください。'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="contact-name">お名前</Label>
          <Input
            id="contact-name"
            name="name"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="contact-email">メールアドレス</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="contact-message">お問い合わせ内容</Label>
          <Textarea
            id="contact-message"
            name="message"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      {status.message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            status.type === 'success'
              ? 'bg-green-50 text-green-600 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
          role="alert"
        >
          {status.message}
        </div>
      )}

      <Button 
        type="submit" 
        className="mt-4 w-full sm:w-auto" 
        disabled={isSubmitting}
      >
        {isSubmitting ? '送信中...' : '送信する'}
      </Button>
    </form>
  )
}

