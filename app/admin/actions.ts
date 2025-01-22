'use server'

import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const contentFilePath = path.join(process.cwd(), 'app/data/content.json')
const uploadDir = path.join(process.cwd(), 'public', 'uploads')

export async function updateContent(data: {
  shopName: string
  message: string
  deadline: string
  imageUrl: string
}) {
  try {
    await fs.writeFile(contentFilePath, JSON.stringify(data, null, 2))
    console.log('Content updated:', data)
    return { success: true }
  } catch (error) {
    console.error('データ更新エラー:', error)
    return { success: false, error: '更新に失敗しました' }
  }
}

export async function getContent() {
  try {
    const content = await fs.readFile(contentFilePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('データ読み込みエラー:', error)
    return null
  }
}

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('ファイルがありません')
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // ファイル名を一意にする
    const uniqueId = uuidv4()
    const extension = path.extname(file.name)
    const fileName = `${uniqueId}${extension}`

    // アップロードディレクトリが存在しない場合は作成
    await fs.mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, fileName)
    await fs.writeFile(filePath, buffer)

    // 画像のURLを生成
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const imageUrl = `${baseUrl}/uploads/${fileName}`
    console.log('Image uploaded:', imageUrl)
    return imageUrl
  } catch (error) {
    console.error('画像アップロードエラー:', error)
    throw new Error('画像のアップロードに失敗しました')
  }
}

