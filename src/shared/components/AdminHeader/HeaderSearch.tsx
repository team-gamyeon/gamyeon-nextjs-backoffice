'use client'

import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/input'

export function HeaderSearch() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2">
      <div className="relative w-140">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="검색..."
          className="bg-muted/40 h-9 pl-9 text-sm ring-0 outline-none"
        />
      </div>
    </div>
  )
}
