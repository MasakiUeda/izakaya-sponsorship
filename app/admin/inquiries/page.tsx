import { getInquiries } from '@/app/actions/inquiry'
import { InquiryList } from './component/inquiry-list'
import { AdminNavigation } from '../components/AdminNavigation'

export default async function InquiriesPage() {
  const inquiries = await getInquiries()

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <AdminNavigation showAdminTopButton={true} />
        <h1 className="text-3xl font-bold mb-8">お問い合わせ一覧</h1>
        <InquiryList inquiries={inquiries} />
      </div>
    </div>
  )
}

