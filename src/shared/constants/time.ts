export const TIME = {
  SECOND: 60,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  MAX_RELATIVE_DAY: 30,
} as const

export const KOREAN_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}
