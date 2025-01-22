'use client'

import { Button } from '@/components/ui/button'

const LINE_FRIEND_URL = "https://lin.ee/NJvPtmJn"

export function LineFriendLink() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={() => window.open(LINE_FRIEND_URL, '_blank')}
        className="bg-[#00B900] hover:bg-[#00A000] text-white"
      >
        LINE友だち登録
      </Button>
    </div>
  )
}

