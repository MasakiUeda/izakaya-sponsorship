import fs from 'fs/promises'
import path from 'path'

const sponsorsFilePath = path.join(process.cwd(), 'app/data/sponsors.json')

interface SponsorData {
  id: string
  name: string
  email: string
  message: string
  lineRegistration: boolean
  createdAt: string
  amount?: number
}

async function updateSponsorsAmount() {
  try {
    const content = await fs.readFile(sponsorsFilePath, 'utf-8')
    const sponsors: SponsorData[] = JSON.parse(content)

    const updatedSponsors = sponsors.map(sponsor => ({
      ...sponsor,
      amount: sponsor.amount ?? 5000  // デフォルト値として5000円を設定
    }))

    await fs.writeFile(sponsorsFilePath, JSON.stringify(updatedSponsors, null, 2))
    console.log('協賛者データの更新が完了しました。')
  } catch (error) {
    console.error('協賛者データの更新中にエラーが発生しました:', error)
  }
}

updateSponsorsAmount()

