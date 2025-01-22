"use server"

import fs from "fs/promises"
import path from "path"

const sponsorsFilePath = path.join(process.cwd(), "app/data/sponsors.json")

export interface SponsorData {
  id: string
  name: string
  email: string
  message: string
  lineRegistration: boolean
  createdAt: string
  amount: number
}

export async function saveSponsor(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string
    const lineRegistration = formData.get("lineRegistration") === "true"
    const sponsorship = formData.get("sponsorship") as string
    let amount: number

    if (sponsorship === "custom") {
      amount = Number.parseInt(formData.get("customAmount") as string, 10)
    } else {
      amount = Number.parseInt(sponsorship, 10) * 5000
    }

    if (!name || !email || isNaN(amount)) {
      return { success: false, error: "必須項目が入力されていません。" }
    }

    let sponsors: SponsorData[] = []
    try {
      const content = await fs.readFile(sponsorsFilePath, "utf-8")
      sponsors = JSON.parse(content)
    } catch (error) {
      console.error("スポンサーデータの読み込みエラー:", error)
    }

    const newSponsor: SponsorData = {
      id: Date.now().toString(),
      name,
      email,
      message,
      lineRegistration,
      createdAt: new Date().toISOString(),
      amount,
    }

    sponsors.push(newSponsor)

    await fs.writeFile(sponsorsFilePath, JSON.stringify(sponsors, null, 2))

    // メール送信機能は一時的にコメントアウト
    // const emailResult = await sendThankYouEmail(email, name, amount)
    // if (!emailResult.success) {
    //   console.error('自動メール送信エラー:', emailResult.error)
    // }

    return { success: true }
  } catch (error) {
    console.error("スポンサー保存エラー:", error)
    return { success: false, error: "データの保存に失敗しました。" }
  }
}

export async function getSponsors(): Promise<SponsorData[]> {
  try {
    const content = await fs.readFile(sponsorsFilePath, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    console.error("スポンサーデータの読み込みエラー:", error)
    return []
  }
}

