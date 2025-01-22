import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { to, subject, text } = await request.json()

  // ここで実際のメール送信ロジックを実装します
  // 例: SendGridのAPIを使用する場合
  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: process.env.EMAIL_FROM },
        subject: subject,
        content: [{ type: "text/plain", value: text }],
      }),
    })

    if (!response.ok) {
      throw new Error("SendGrid API error")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("メール送信エラー:", error)
    return NextResponse.json({ success: false, error: "メールの送信に失敗しました" }, { status: 500 })
  }
}

