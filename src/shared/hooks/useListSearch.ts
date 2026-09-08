'use client'

import { useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'

export const LIST_SEARCH_DEBOUNCE_MS = 300

/**
 * 검색어 입력값과 URL에 확정된 검색어를 잇는다.
 *
 * 입력 중인 값(draft)은 로컬에 두고, 디바운스가 끝나면 commit으로 URL에 반영한다.
 * 뒤로가기처럼 URL이 외부에서 바뀌면 입력값을 따라가되, 사용자가 편집 중이면 유지한다.
 *
 * commit 이펙트는 확정값을 ref로만 읽는다. 의존성에 넣으면 외부에서 URL이 바뀔 때
 * 아직 반영되지 않은 입력값으로 되돌려버린다.
 */
export function useListSearch(
  committedSearch: string,
  commit: (nextSearch: string | undefined) => void,
) {
  const [search, setSearch] = useState(committedSearch)
  const debouncedSearch = useDebounce(search, LIST_SEARCH_DEBOUNCE_MS)
  const previousCommittedRef = useRef(committedSearch)
  const committedRef = useRef(committedSearch)
  const commitRef = useRef(commit)

  useEffect(() => {
    committedRef.current = committedSearch
    commitRef.current = commit
  })

  useEffect(() => {
    const previousCommitted = previousCommittedRef.current
    previousCommittedRef.current = committedSearch
    setSearch((currentSearch) =>
      currentSearch === previousCommitted ? committedSearch : currentSearch,
    )
  }, [committedSearch])

  useEffect(() => {
    const normalizedSearch = debouncedSearch.trim()
    if (normalizedSearch === committedRef.current) return
    commitRef.current(normalizedSearch || undefined)
  }, [debouncedSearch])

  return {
    search,
    setSearch,
    /** 입력값이 아직 URL에 반영되지 않은 상태 */
    isSearchPending: search.trim() !== committedSearch,
  }
}
