import { AdminForm } from './components/admin-form'
import { getContent } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AdminNavigation } from './components/AdminNavigation'

export default async function AdminPage() {
  const data = await getContent()

  if (!data) {
    return <div>データの読み込みに失敗しました。</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <AdminNavigation />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">管理画面</h1>
          <div className="space-x-4">
            <Button asChild variant="outline">
              <Link href="/admin/sponsors">
                協賛者一覧を見る
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/inquiries">
                お問い合わせ一覧を見る
              </Link>
            </Button>
          </div>
        </div>
        <AdminForm initialData={data} />
      </div>
    </div>
  )
}

