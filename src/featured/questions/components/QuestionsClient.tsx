'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { QUESTION_STATUS_OPTIONS } from '@/featured/questions/constants'
import { useQuestions } from '@/featured/questions/hooks/useQuestions'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { QuestionTable } from './QuestionTable'
import { QuestionDialog } from './QuestionDialog'
import { SearchInput } from '@/shared/components/SearchInput'
import type { CommonQuestion, QuestionListQuery } from '@/featured/questions/types'
import type { PaginationMeta } from '@/shared/types/pagination'

interface QuestionsClientProps {
  questions: CommonQuestion[]
  pagination: PaginationMeta
  query: QuestionListQuery
  hasLoadError: boolean
}

export function QuestionsClient({
  questions,
  pagination,
  query,
  hasLoadError,
}: QuestionsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogKey, setDialogKey] = useState(0)
  const {
    questions: loadedQuestions,
    meta,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    isFiltered,
    isPending: isSearchPending,
    isPaused,
    isLoadingMore,
    loadMoreError,
    hasMore,
    loadMore,
    refreshQuestions,
    scrollRootRef,
  } = useQuestions({
    initialQuestions: questions,
    initialPagination: pagination,
    query,
    hasInitialLoadError: hasLoadError,
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      suppressHydrationWarning
    >
      {/* Stats */}
      {hasLoadError ? null : (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            전체{' '}
            <span className="text-foreground mr-1 font-semibold">
              {meta.totalCount.toLocaleString()}
            </span>
            개
          </span>
          {isFiltered ? (
            <span className="text-muted-foreground">
              검색 결과{' '}
              <span className="text-primary mr-1 font-semibold">
                {meta.filteredCount.toLocaleString()}
              </span>
              개
            </span>
          ) : null}
          <span className="text-muted-foreground">
            불러옴{' '}
            <span className="text-foreground mr-1 font-semibold">
              {loadedQuestions.length.toLocaleString()}
            </span>
            개
          </span>
        </div>
      )}

      {/* Tabs + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              전체
            </TabsTrigger>
            {QUESTION_STATUS_OPTIONS.map((option) => (
              <TabsTrigger key={option.value} value={option.value} className="text-xs">
                {option.label}
              </TabsTrigger>
            ))}
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
          onClick={() => {
            setDialogKey((prev) => prev + 1)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          질문 추가
        </Button>
      </div>

      <div className="py-4 transition-opacity" aria-busy={isSearchPending || isLoadingMore}>
        <QuestionTable
          questions={loadedQuestions}
          onDelete={refreshQuestions}
          onUpdate={refreshQuestions}
          hasLoadError={hasLoadError}
          scrollRootRef={scrollRootRef}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          isLoadMorePaused={isPaused}
          loadMoreError={loadMoreError}
          onLoadMore={loadMore}
        />
      </div>

      <QuestionDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={refreshQuestions}
      />
    </motion.div>
  )
}
