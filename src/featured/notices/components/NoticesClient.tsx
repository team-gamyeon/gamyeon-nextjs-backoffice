'use client'

import { motion } from 'framer-motion'
import { NoticeDialog } from '@/featured/notices/components/NoticeDialog'
import { NoticeFilters } from '@/featured/notices/components/NoticeFilters'
import { NoticeListItem } from '@/featured/notices/components/NoticeListItem'
import { useNotices } from '@/featured/notices/hooks/useNotices'
import { InfiniteScrollTrigger } from '@/shared/components/InfiniteScrollTrigger'
import { ListEmptyState } from '@/shared/components/ListEmptyState'
import type { GetNoticesParams, Notice } from '@/featured/notices/types'
import type { PaginationMeta } from '@/shared/types/pagination'

interface NoticesClientProps {
  initialNotices: Notice[]
  meta: PaginationMeta
  query: GetNoticesParams
  hasLoadError: boolean
}

export function NoticesClient({ initialNotices, meta, query, hasLoadError }: NoticesClientProps) {
  const {
    notices,
    totalCount,
    filteredCount,
    hasMore,
    isLoadingMore,
    loadMoreError,
    initialLoadFailed,
    loadMore,
    scrollRootRef,
    isPaused,
    isFiltered,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    expandedId,
    setExpandedId,
    dialogOpen,
    setDialogOpen,
    editTarget,
    activeCount,
    inactiveCount,
    handleToggle,
    handleDelete,
    handleEdit,
    handleAdd,
    handleSave,
  } = useNotices({
    initialNotices,
    initialMeta: meta,
    query,
    hasInitialLoadError: hasLoadError,
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      aria-busy={isPaused}
    >
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          전체 <span className="text-foreground mr-1 font-semibold">{totalCount}</span>개
        </span>
        {isFiltered && (
          <span className="text-muted-foreground">
            검색 결과 <span className="text-foreground mr-1 font-semibold">{filteredCount}</span>개
          </span>
        )}
        <span className="text-muted-foreground">
          불러옴 <span className="text-foreground mr-1 font-semibold">{notices.length}</span>개
        </span>
        <span className="text-muted-foreground">
          활성(불러온 항목) <span className="text-primary mr-1 font-semibold">{activeCount}</span>개
        </span>
        <span className="text-muted-foreground">
          비활성(불러온 항목){' '}
          <span className="mr-1 font-semibold text-gray-500">{inactiveCount}</span>개
        </span>
      </div>

      <NoticeFilters
        activeTab={activeTab}
        search={search}
        onTabChange={setActiveTab}
        onSearchChange={setSearch}
        onAdd={handleAdd}
      />

      <div
        ref={scrollRootRef}
        data-testid="notices-scroll-container"
        className="border-border/60 h-150 overflow-y-auto rounded-lg border p-2 [scrollbar-gutter:stable]"
      >
        {notices.length === 0 && !isPaused && (
          <ListEmptyState
            hasError={initialLoadFailed}
            errorMessage="공지사항을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
            emptyMessage="공지사항이 없습니다."
          />
        )}
        <div className="space-y-2">
          {notices.map((notice, index) => (
            <NoticeListItem
              key={notice.id}
              notice={notice}
              index={index}
              isExpanded={expandedId === notice.id}
              onToggleExpand={() => setExpandedId(expandedId === notice.id ? null : notice.id)}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <InfiniteScrollTrigger
          rootRef={scrollRootRef}
          hasMore={hasMore}
          isLoading={isLoadingMore}
          isPaused={isPaused}
          hasError={loadMoreError}
          loadedCount={notices.length}
          onLoadMore={loadMore}
        />
      </div>

      <NoticeDialog
        key={editTarget?.id ?? 'new'}
        open={dialogOpen}
        notice={editTarget}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </motion.div>
  )
}
