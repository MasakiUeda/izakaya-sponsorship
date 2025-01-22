'use client'

import { useState } from 'react'
import { Campaign } from '@/app/types/campaign'
import { saveCampaign, deleteCampaign } from '@/app/actions/campaign'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from "@/components/ui/use-toast"

interface CampaignListProps {
  initialCampaigns: Campaign[]
}

export function CampaignList({ initialCampaigns }: CampaignListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const { toast } = useToast()

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign({ ...campaign })
  }

  const handleSave = async (campaign: Campaign) => {
    try {
      const result = await saveCampaign(campaign)
      if (result.success) {
        setCampaigns(prevCampaigns => {
          const index = prevCampaigns.findIndex(c => c.id === campaign.id)
          if (index !== -1) {
            return [...prevCampaigns.slice(0, index), campaign, ...prevCampaigns.slice(index + 1)]
          } else {
            return [...prevCampaigns, campaign]
          }
        })
        setEditingCampaign(null)
        toast({
          title: "成功",
          description: "キャンペーンが正常に保存されました。",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "キャンペーンの保存中にエラーが発生しました。",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('このキャンペーンを削除してもよろしいですか？')) {
      try {
        const result = await deleteCampaign(id)
        if (result.success) {
          setCampaigns(prevCampaigns => prevCampaigns.filter(c => c.id !== id))
          toast({
            title: "成功",
            description: "キャンペーンが正常に削除されました。",
          })
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        toast({
          title: "エラー",
          description: error instanceof Error ? error.message : "キャンペーンの削除中にエラーが発生しました。",
          variant: "destructive",
        })
      }
    }
  }

  const handleCreate = () => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      targetAmount: 0,
      currentAmount: 0,
      isActive: false
    }
    setEditingCampaign(newCampaign)
  }

  return (
    <div className="space-y-8">
      <Button onClick={handleCreate}>新規キャンペーン作成</Button>
      {campaigns.map(campaign => (
        <div key={campaign.id} className="bg-white shadow-md rounded-lg p-6">
          {editingCampaign?.id === campaign.id ? (
            <form onSubmit={(e) => {
              e.preventDefault()
              handleSave(editingCampaign)
            }} className="space-y-4">
              <div>
                <Label htmlFor="name">キャンペーン名</Label>
                <Input
                  id="name"
                  value={editingCampaign.name}
                  onChange={(e) => setEditingCampaign({...editingCampaign, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">説明</Label>
                <Input
                  id="description"
                  value={editingCampaign.description}
                  onChange={(e) => setEditingCampaign({...editingCampaign, description: e.target.value})}
                />
              </div>
              <div className="flex space-x-4">
                <div>
                  <Label htmlFor="startDate">開始日</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={editingCampaign.startDate}
                    onChange={(e) => setEditingCampaign({...editingCampaign, startDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">終了日</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={editingCampaign.endDate}
                    onChange={(e) => setEditingCampaign({...editingCampaign, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="targetAmount">目標金額</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={editingCampaign.targetAmount}
                  onChange={(e) => setEditingCampaign({...editingCampaign, targetAmount: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={editingCampaign.isActive}
                  onCheckedChange={(checked) => setEditingCampaign({...editingCampaign, isActive: checked})}
                />
                <Label htmlFor="isActive">アクティブ</Label>
              </div>
              <div className="flex space-x-4">
                <Button type="submit">保存</Button>
                <Button type="button" variant="outline" onClick={() => setEditingCampaign(null)}>キャンセル</Button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">{campaign.name}</h2>
              <p className="mb-2">{campaign.description}</p>
              <p className="mb-2">期間: {campaign.startDate} 〜 {campaign.endDate}</p>
              <p className="mb-2">目標金額: {campaign.targetAmount.toLocaleString()}円</p>
              <p className="mb-2">現在の金額: {campaign.currentAmount.toLocaleString()}円</p>
              <p className="mb-4">ステータス: {campaign.isActive ? 'アクティブ' : '非アクティブ'}</p>
              <div className="flex space-x-4">
                <Button onClick={() => handleEdit(campaign)}>編集</Button>
                <Button variant="destructive" onClick={() => handleDelete(campaign.id)}>削除</Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

