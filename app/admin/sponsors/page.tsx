import { getSponsors } from '@/app/actions/sponsor'
import { SponsorList } from './components/sponsor-list'
import { AdminNavigation } from '../components/AdminNavigation'

export default async function SponsorsPage() {
  const sponsors = await getSponsors()

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <AdminNavigation showAdminTopButton={true} />
        <h1 className="text-3xl font-bold mb-8">協賛者一覧</h1>
        <SponsorList sponsors={sponsors} />
      </div>
    </div>
  )
}

