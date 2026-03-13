'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { QuestionTable } from './QuestionTable'
import { QuestionDialog } from './QuestionDialog'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { SearchInput } from '@/shared/components/SearchInput'
import type { CommonQuestion } from '@/featured/questions/types'

interface QuestionsClientProps {
  initialQuestions: CommonQuestion[]
}

export function QuestionsClient({ initialQuestions }: QuestionsClientProps) {
  const [questions, setQuestions] = useState<CommonQuestion[]>(initialQuestions)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 200)

  const filtered = useMemo(() => {
    return questions.filter((question) => {
      if (debouncedSearch && !question.content.toLowerCase().includes(debouncedSearch.toLowerCase()))
        return false
      if (activeTab === 'active' && !question.isActive) return false
      if (activeTab === 'inactive' && question.isActive) return false
      return true
    })
  }, [questions, debouncedSearch, activeTab])

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id))
  }

  const handleUpdate = (updated: CommonQuestion) => {
    setQuestions((prev) => prev.map((question) => question.id === updated.id ? updated : question))
  }

  const activeCount = questions.filter((question) => question.isActive).length
  const inactiveCount = questions.filter((question) => !question.isActive).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 min-h-0 flex-col gap-4"
      suppressHydrationWarning
    >
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          전체 <span className="text-foreground mr-1 font-semibold">{questions.length}</span>개
        </span>
        <span className="text-muted-foreground">
          활성 <span className="text-primary mr-1 font-semibold">{activeCount}</span>개
        </span>
        <span className="text-muted-foreground">
          비활성 <span className="mr-1 font-semibold text-gray-500">{inactiveCount}</span>개
        </span>
      </div>

      {/* Tabs + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              전체
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs">
              활성
            </TabsTrigger>
            <TabsTrigger value="inactive" className="text-xs">
              비활성
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="질문 내용 검색..."
          className="min-w-48 flex-1"
        />

        <Button
          size="sm"
          className="h-9 cursor-pointer gap-1.5"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          질문 추가
        </Button>
      </div>

      <div className="flex flex-1 min-h-0 flex-col py-4">
        <QuestionTable questions={filtered} onDelete={handleDelete} onUpdate={handleUpdate} />
      </div>

      <QuestionDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </motion.div>
  )
}
