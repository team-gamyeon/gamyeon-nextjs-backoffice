'use client'

import { motion } from 'framer-motion'
import { MemberFilters } from './MemberFilters'
import { MemberTable } from './MemberTable'
import { useMembers } from '@/featured/members/hooks/useMembers'
import type { Member, MemberListQuery } from '@/featured/members/types'
import type { PaginationMeta } from '@/shared/types/pagination'

interface MembersClientProps {
  initialMembers: Member[]
  meta: PaginationMeta
  query: MemberListQuery
}

export function MembersClient({ initialMembers, meta, query }: MembersClientProps) {
  const {
    members,
    pagination,
    hasMore,
    isLoadingMore,
    hasLoadError,
    isPending,
    hasFilters,
    filters,
    handleFilterChange,
    loadMore,
    scrollRootRef,
  } = useMembers({ initialMembers, initialMeta: meta, query })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      suppressHydrationWarning
      aria-busy={isPending || isLoadingMore}
    >
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {hasFilters ? (
            <>
              검색 결과{' '}
              <span className="text-foreground font-semibold">{pagination.filteredCount}</span>명
              <span className="ml-1">/ 전체 {pagination.totalCount}명</span>
            </>
          ) : (
            <>
              총 <span className="text-foreground font-semibold">{pagination.totalCount}</span>명의
              회원
            </>
          )}
        </p>
      </div>

      <MemberFilters filters={filters} onFilterChange={handleFilterChange} />
      <div className={`py-4 transition-opacity ${isPending ? 'opacity-60' : 'opacity-100'}`}>
        <MemberTable
          members={members}
          scrollRootRef={scrollRootRef}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          hasLoadError={hasLoadError}
          onLoadMore={loadMore}
        />
      </div>
    </motion.div>
  )
}
