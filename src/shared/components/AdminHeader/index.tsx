'use client'

import { useEffect } from 'react'
import { useAdminStore } from '@/featured/auth/store'
import type { Admin } from '@/featured/auth/types'
import { HeaderSearch } from './HeaderSearch'
import { NotificationDropdown } from './NotificationDropdown'
import { UserMenuDropdown } from './UserMenuDropdown'

export function AdminHeader() {
  const { setAdmin } = useAdminStore()

  useEffect(() => {
    useAdminStore.persist.rehydrate()
    // fetch('/api/auth/me')
    //   .then((res) => res.json())
    //   .then((json) => { if (json?.data) setAdmin(json.data as Admin) })
  }, [setAdmin])

  return (
    <header className="border-border bg-background/95 relative flex h-16 items-center justify-between border-b px-4 backdrop-blur">
      <div className="flex-1" />
      <HeaderSearch />
      <div className="flex flex-1 items-center justify-end gap-3">
        <NotificationDropdown />
        <UserMenuDropdown />
      </div>
    </header>
  )
}
