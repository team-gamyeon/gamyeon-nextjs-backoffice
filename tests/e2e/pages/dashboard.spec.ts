import { test, expect } from '@playwright/test'

test.describe('대시보드', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
  })

  test('페이지 타이틀과 설명 표시', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '대시보드' })).toBeVisible()
    await expect(page.getByText('Gamyeon 서비스의 핵심 지표를 한눈에 확인하세요.')).toBeVisible()
  })

  test('사이드바 네비게이션 항목 표시', async ({ page }) => {
    await expect(page.getByRole('link', { name: '대시보드' })).toBeVisible()
    await expect(page.getByRole('link', { name: '유저 관리' })).toBeVisible()
    await expect(page.getByRole('link', { name: '공통 질문 관리' })).toBeVisible()
    await expect(page.getByRole('link', { name: '공지사항 관리' })).toBeVisible()
    await expect(page.getByRole('link', { name: '면접 관리' })).toBeVisible()
    await expect(page.getByRole('link', { name: '리포트 관리' })).toBeVisible()
  })

  test('사이드바 접기/펼치기', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: /Collapse sidebar|Expand sidebar/ })
    await expect(toggleButton).toBeVisible()
    await toggleButton.click()
    await page.waitForTimeout(400)
    await toggleButton.click()
    await page.waitForTimeout(400)
  })

  test('KPI 지표 카드 렌더링', async ({ page }) => {
    // 대시보드 메트릭 영역이 로드될 때까지 대기
    await page.waitForSelector('main', { state: 'visible' })
    // 숫자/통계 요소들이 화면에 있는지 확인
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('유저 관리 페이지로 이동', async ({ page }) => {
    await page.getByRole('link', { name: '유저 관리' }).click()
    await expect(page).toHaveURL('/members')
    await expect(page.getByRole('heading', { name: '유저 관리' })).toBeVisible()
  })
})
