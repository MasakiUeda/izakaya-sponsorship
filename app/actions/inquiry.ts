'use server'

import fs from 'fs/promises'
import path from 'path'

const inquiriesFilePath = path.join(process.cwd(), 'app/data/inquiries.json')

export type InquiryStatus = 
  | '📨未対応' 
  | '🔍対応中' 
  | '📤️返信済' 
  | '✅対応完了' 
  | '⏸️保留' 
  | '🔒クローズ'

export interface InquiryData {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
  status: InquiryStatus
}

export async function getInquiries(): Promise<InquiryData[]> {
  let inquiries: InquiryData[] = []
  try {
    const content = await fs.readFile(inquiriesFilePath, 'utf-8')
    inquiries = JSON.parse(content)
  } catch (error) {
    console.error('お問い合わせデータの読み込みエラー:', error)
  }
  return inquiries;
}

export async function saveInquiry(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
      return { success: false, error: '必須項目が入力されていません。' }
    }

    let inquiries: InquiryData[] = await getInquiries();

    const newInquiry: InquiryData = {
      id: Date.now().toString(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      status: '📨未対応' 
    }

    inquiries.push(newInquiry)
    await fs.writeFile(inquiriesFilePath, JSON.stringify(inquiries, null, 2))

    return { success: true }
  } catch (error) {
    console.error('お問い合わせ保存エラー:', error)
    return { success: false, error: 'データの保存に失敗しました。' }
  }
}

export async function updateInquiryStatus(ids: string[], status: InquiryStatus): Promise<{ success: boolean; error?: string }> {
  try {
    const inquiries = await getInquiries()
    const updatedInquiries = inquiries.map(inquiry => 
      ids.includes(inquiry.id) ? { ...inquiry, status } : inquiry
    )
    
    await fs.writeFile(inquiriesFilePath, JSON.stringify(updatedInquiries, null, 2))
    return { success: true }
  } catch (error) {
    console.error('ステータス更新エラー:', error)
    return { success: false, error: 'ステータスの更新に失敗しました。' }
  }
}

export async function deleteInquiries(ids: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    const inquiries = await getInquiries()
    const filteredInquiries = inquiries.filter(inquiry => !ids.includes(inquiry.id))
    
    await fs.writeFile(inquiriesFilePath, JSON.stringify(filteredInquiries, null, 2))
    return { success: true }
  } catch (error) {
    console.error('削除エラー:', error)
    return { success: false, error: '選択した項目の削除に失敗しました。' }
  }
}

