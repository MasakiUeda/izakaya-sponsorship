'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 実際の運用では、このパスワードは環境変数や安全な場所に保存すべきです
    if (password === 'admin123') {
      // パスワードが正しい場合、セッションやクッキーにログイン状態を保存し、
      // 管理画面にリダイレクトします
      document.cookie = 'auth=true; path=/;'
      router.push('/admin')
    } else {
      setError('パスワードが正しくありません')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">管理画面ログイン</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button type="submit" className="w-full">
            ログイン
          </Button>
        </form>
      </div>
    </div>
  )
}

