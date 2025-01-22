import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface AdminNavigationProps {
  showAdminTopButton?: boolean;
}

export function AdminNavigation({ showAdminTopButton = false }: AdminNavigationProps) {
  return (
    <div className="mb-4 flex justify-between items-center">
      <div className="space-x-2">
        <Button asChild variant="outline">
          <Link href="/">トップページへ戻る</Link>
        </Button>
        {showAdminTopButton && (
          <Button asChild variant="outline">
            <Link href="/admin">管理画面TOPへ</Link>
          </Button>
        )}
      </div>
      <Button asChild variant="outline">
        <Link href="/admin/master">マスター管理画面へ</Link>
      </Button>
    </div>
  )
}

