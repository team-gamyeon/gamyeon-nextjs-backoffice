'use client'

import { motion } from 'framer-motion'
import { NoticeDialog } from '@/featured/notices/components/NoticeDialog'
import { NoticeFilters } from '@/featured/notices/components/NoticeFilters'
import { NoticeListItem } from '@/featured/notices/components/NoticeListItem'
import { useNotices } from '@/featured/notices/hooks/useNotices'
import type { Notice } from '@/featured/notices/types'

export function NoticesClient({ initialNotices }: { initialNotices: Notice[] }) {
  const {
    notices,
    filtered,
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
  } = useNotices(initialNotices)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          전체 <span className="text-foreground mr-1 font-semibold">{notices.length}</span>개
        </span>
        <span className="text-muted-foreground">
          활성 <span className="text-primary mr-1 font-semibold">{activeCount}</span>개
        </span>
        <span className="text-muted-foreground">
          비활성 <span className="mr-1 font-semibold text-gray-500">{inactiveCount}</span>개
        </span>
      </div>

      <NoticeFilters
        activeTab={activeTab}
        search={search}
        onTabChange={setActiveTab}
        onSearchChange={setSearch}
        onAdd={handleAdd}
      />

      <div className="border-border/60 h-150 overflow-y-auto rounded-lg border p-2 [scrollbar-gutter:stable]">
        {filtered.length === 0 && (
          <p className="text-muted-foreground py-10 text-center text-sm">공지사항이 없습니다.</p>
        )}
        <div className="space-y-2">
          {filtered.map((notice, index) => (
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
