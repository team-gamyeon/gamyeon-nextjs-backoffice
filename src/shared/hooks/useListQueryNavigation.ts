'use client'

import { useCallback, useEffect, useRef, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export type ListQueryValue = string | number | boolean | null | undefined

export interface ListQueryNavigationOptions {
  resetPage?: boolean
  scroll?: boolean
}

interface ListQuerySynchronizationResult {
  intendedQuery: string
  internalQueryTargets: Set<string>
}

export function mergeListQueryParams(
  currentQuery: string,
  updates: Record<string, ListQueryValue>,
  { resetPage = false }: Pick<ListQueryNavigationOptions, 'resetPage'> = {},
) {
  const nextParams = new URLSearchParams(currentQuery)

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      nextParams.delete(key)
      return
    }

    nextParams.set(key, String(value))
  })

  if (resetPage) {
    nextParams.delete('page')
    nextParams.delete('limit')
  }

  return nextParams.toString()
}

export function synchronizeListQuery(
  currentQuery: string,
  intendedQuery: string,
  internalQueryTargets: ReadonlySet<string>,
): ListQuerySynchronizationResult {
  if (currentQuery === intendedQuery) {
    return { intendedQuery, internalQueryTargets: new Set() }
  }

  const remainingInternalTargets = new Set(internalQueryTargets)
  if (remainingInternalTargets.delete(currentQuery)) {
    return { intendedQuery, internalQueryTargets: remainingInternalTargets }
  }

  return { intendedQuery: currentQuery, internalQueryTargets: new Set() }
}

export function useListQueryNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const currentQuery = searchParams.toString()
  const intendedQueryRef = useRef(currentQuery)
  const internalQueryTargetsRef = useRef(new Set<string>())
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    if (pathnameRef.current !== pathname) {
      pathnameRef.current = pathname
      intendedQueryRef.current = currentQuery
      internalQueryTargetsRef.current.clear()
      return
    }

    const synchronized = synchronizeListQuery(
      currentQuery,
      intendedQueryRef.current,
      internalQueryTargetsRef.current,
    )
    intendedQueryRef.current = synchronized.intendedQuery
    internalQueryTargetsRef.current = synchronized.internalQueryTargets
  }, [currentQuery, pathname])

  const updateQuery = useCallback(
    (
      updates: Record<string, ListQueryValue>,
      { resetPage = false, scroll = false }: ListQueryNavigationOptions = {},
    ) => {
      const query = mergeListQueryParams(intendedQueryRef.current, updates, { resetPage })
      intendedQueryRef.current = query
      internalQueryTargetsRef.current.add(query)
      const href = query ? `${pathname}?${query}` : pathname

      startTransition(() => {
        router.replace(href, { scroll })
      })
    },
    [pathname, router],
  )

  const clearQuery = useCallback(
    (keys: string[], options?: ListQueryNavigationOptions) => {
      updateQuery(Object.fromEntries(keys.map((key) => [key, null])), options)
    },
    [updateQuery],
  )

  return {
    isPending,
    updateQuery,
    clearQuery,
  }
}
