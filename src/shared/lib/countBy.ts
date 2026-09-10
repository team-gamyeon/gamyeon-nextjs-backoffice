/**
 * 항목을 키별로 센다.
 *
 * 목록 화면의 상태별 개수는 전부 이 함수로 계산하며, 기준은 "불러온 항목"이다.
 * 서버가 상태별 집계를 내려주지 않아 전체 기준 수치는 알 수 없다.
 * 무한 스크롤로 더 불러올수록 숫자가 올라간다.
 */
export function countBy<T, K extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T) => K,
): Partial<Record<K, number>> {
  const counts: Partial<Record<K, number>> = {}

  for (const item of items) {
    const key = getKey(item)
    counts[key] = (counts[key] ?? 0) + 1
  }

  return counts
}
