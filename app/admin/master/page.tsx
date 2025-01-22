import { getCampaigns } from '@/app/actions/campaign'
import { CampaignList } from './components/campaign-list'
import { AdminNavigation } from '../components/AdminNavigation'

export default async function MasterAdminPage() {
  const campaigns = await getCampaigns()

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <AdminNavigation showAdminTopButton={true} />
        <h1 className="text-3xl font-bold mb-8">マスター管理画面</h1>
        <CampaignList initialCampaigns={campaigns} />
      </div>
    </div>
  )
}

