'use client'

import { useState } from 'react'
import type { InquiryData, InquiryStatus } from '@/app/actions/inquiry'
import { updateInquiryStatus, deleteInquiries } from '@/app/actions/inquiry'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

const STATUS_OPTIONS: InquiryStatus[] = [
  '📨未対応',
  '🔍対応中',
  '📤️返信済',
  '✅対応完了',
  '⏸️保留',
  '🔒クローズ'
]

interface InquiryListProps {
  inquiries: InquiryData[]
}

export function InquiryList({ inquiries: initialInquiries }: InquiryListProps) {
  const { toast } = useToast()
  const [inquiries, setInquiries] = useState(initialInquiries)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof InquiryData>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isProcessing, setIsProcessing] = useState(false)

  const sortedInquiries = [...inquiries].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] < b[sortField] ? -1 : 1
    } else {
      return a[sortField] > b[sortField] ? -1 : 1
    }
  })

  const handleSort = (field: keyof InquiryData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.length === inquiries.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(inquiries.map(i => i.id))
    }
  }

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleStatusChange = async (status: InquiryStatus) => {
    if (selectedIds.length === 0) {
      toast({
        title: "エラー",
        description: "更新する項目を選択してください。",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await updateInquiryStatus(selectedIds, status)
      if (result.success) {
        const updatedInquiries = inquiries.map(inquiry =>
          selectedIds.includes(inquiry.id) ? { ...inquiry, status } : inquiry
        )
        setInquiries(updatedInquiries)
        setSelectedIds([])
        toast({
          title: "更新完了",
          description: "ステータスを更新しました。",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "ステータスの更新に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "エラー",
        description: "削除する項目を選択してください。",
        variant: "destructive",
      })
      return
    }

    if (!confirm('選択した項目を削除してもよろしいですか？')) {
      return
    }

    setIsProcessing(true)
    try {
      const result = await deleteInquiries(selectedIds)
      if (result.success) {
        const updatedInquiries = inquiries.filter(inquiry => !selectedIds.includes(inquiry.id))
        setInquiries(updatedInquiries)
        setSelectedIds([])
        toast({
          title: "削除完了",
          description: "選択した項目を削除しました。",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "削除に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select
          disabled={isProcessing || selectedIds.length === 0}
          onValueChange={(value) => handleStatusChange(value as InquiryStatus)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="ステータスを変更" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="destructive"
          disabled={isProcessing || selectedIds.length === 0}
          onClick={handleDelete}
        >
          選択項目を削除
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedIds.length === inquiries.length && inquiries.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                受信日時
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
              <TableHead>ステータス</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedInquiries.map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(inquiry.id)}
                    onCheckedChange={() => handleSelect(inquiry.id)}
                  />
                </TableCell>
                <TableCell>
                  {new Date(inquiry.createdAt).toLocaleString('ja-JP')}
                </TableCell>
                <TableCell>{inquiry.name}</TableCell>
                <TableCell>{inquiry.email}</TableCell>
                <TableCell className="max-w-[300px] truncate">{inquiry.message}</TableCell>
                <TableCell 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(inquiry.id)}
                >
                  {inquiry.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

