import Image from 'next/image'
import Link from 'next/link'
import { PaymentButton } from './components/PaymentButton'
import { ContactForm } from './components/ContactForm'
import { getContent } from './admin/actions'
import { ImageGallery } from './components/ImageGallery'
import { LineFriendLink } from './components/LineFriendLink'

export const revalidate = 0 // ページを常に再検証

export default async function Home() {
  const content = await getContent()

  if (!content) {
    return <div>データの読み込みに失敗しました。</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">{content.shopName}新規開店協賛募集</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="block">
            <div className="mb-8">
              <ImageGallery images={content.images} />
            </div>
            <div className="block">
              <p className="text-lg mb-4 whitespace-pre-wrap">{content.message}</p>
              <p className="text-red-600 font-semibold">
                募集期限：{content.deadline}まで
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <PaymentButton />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">お問い合わせ</h2>
          <ContactForm />
        </div>

        <div className="mt-8 text-center">
          <Link href="/admin/login" className="text-sm text-gray-500 hover:underline">
            管理画面
          </Link>
        </div>
      </main>
      <LineFriendLink />
    </div>
  )
}

