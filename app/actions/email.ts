'use server'

export async function sendThankYouEmail(to: string, name: string, amount: number) {
  const subject = '協賛のお礼'
  const text = `
${name}様

この度は、居酒屋「高橋」の開店に向けてご協賛いただき、誠にありがとうございます。

協賛金額：${amount.toLocaleString()}円

皆様からのご支援により、より良いお店作りを進めてまいります。
オープン後も、皆様にご満足いただけるサービスを提供できるよう努めてまいります。

今後ともどうぞよろしくお願いいたします。

居酒屋「高橋」
代表 高橋 太郎
`

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, text }),
    })

    if (!response.ok) {
      throw new Error('メール送信に失敗しました')
    }

    return { success: true }
  } catch (error) {
    console.error('メール送信エラー:', error)
    return { success: false, error: 'メールの送信に失敗しました' }
  }
}

