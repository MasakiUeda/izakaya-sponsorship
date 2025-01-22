'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SponsorshipForm } from './SponsorshipForm'

export function PaymentButton() {
  const [showForm, setShowForm] = useState(false)

  const handlePaymentClick = () => {
    setShowForm(true)
  }

  return (
    <div>
      {!showForm ? (
        <Button onClick={handlePaymentClick} className="bg-green-600 hover:bg-green-700 text-white">
          協賛金を支払う
        </Button>
      ) : (
        <SponsorshipForm />
      )}
    </div>
  )
}

