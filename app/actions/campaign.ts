'use server'

import fs from 'fs/promises'
import path from 'path'
import { Campaign } from '../types/campaign'

const campaignsFilePath = path.join(process.cwd(), 'app/data/campaigns.json')

export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const content = await fs.readFile(campaignsFilePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('キャンペーンデータの読み込みエラー:', error)
    return []
  }
}

export async function saveCampaign(campaign: Campaign): Promise<{ success: boolean; error?: string }> {
  try {
    const campaigns = await getCampaigns()
    const index = campaigns.findIndex(c => c.id === campaign.id)
    if (index !== -1) {
      campaigns[index] = campaign
    } else {
      campaigns.push(campaign)
    }
    await fs.writeFile(campaignsFilePath, JSON.stringify(campaigns, null, 2))
    return { success: true }
  } catch (error) {
    console.error('キャンペーン保存エラー:', error)
    return { success: false, error: 'データの保存に失敗しました。' }
  }
}

export async function deleteCampaign(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const campaigns = await getCampaigns()
    const updatedCampaigns = campaigns.filter(c => c.id !== id)
    await fs.writeFile(campaignsFilePath, JSON.stringify(updatedCampaigns, null, 2))
    return { success: true }
  } catch (error) {
    console.error('キャンペーン削除エラー:', error)
    return { success: false, error: 'データの削除に失敗しました。' }
  }
}

