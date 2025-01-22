'use client'

import { useState } from 'react'
import type { SponsorData } from '@/app/actions/sponsor'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface SponsorListProps {
  sponsors: SponsorData[]
}

export function SponsorList({ sponsors: initialSponsors }: SponsorListProps) {
  const [sortField, setSortField] = useState<keyof SponsorData>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const sortedSponsors = [...initialSponsors].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] < b[sortField] ? -1 : 1
    } else {
      return a[sortField] > b[sortField] ? -1 : 1
    }
  })

  const handleSort = (field: keyof SponsorData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('createdAt')}
            >
              登録日時
              {sortField === 'createdAt' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('name')}
            >
              お名前
              {sortField === 'name' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead>メールアドレス</TableHead>
            <TableHead>メッセージ</TableHead>
            <TableHead>LINE登録</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('amount')}
            >
              協賛金額
              {sortField === 'amount' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSponsors.map((sponsor) => (
            <TableRow key={sponsor.id}>
              <TableCell>
                {new Date(sponsor.createdAt).toLocaleString('ja-JP')}
              </TableCell>
              <TableCell>{sponsor.name}</TableCell>
              <TableCell>{sponsor.email}</TableCell>
              <TableCell>{sponsor.message}</TableCell>
              <TableCell>{sponsor.lineRegistration ? 'はい' : 'いいえ'}</TableCell>
              <TableCell>{(sponsor.amount ?? 0).toLocaleString()}円</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

