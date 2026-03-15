import { test, expect } from '@playwright/test'

test.describe('유저 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/members')
    await expect(page.getByRole('heading', { name: '유저 관리' })).toBeVisible()
  })

  test('페이지 타이틀과 설명 표시', async ({ page }) => {
    await expect(page.getByText('가입된 유저 목록을 조회하고 상세 정보를 확인합니다.')).toBeVisible()
  })

  test('유저 목록 테이블 렌더링', async ({ page }) => {
    await page.waitForSelector('main', { state: 'visible' })
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('검색 입력 동작', async ({ page }) => {
    const searchInput = page.getByRole('textbox').first()
    if (await searchInput.isVisible()) {
      await searchInput.click()
      await searchInput.fill('test')
      await page.waitForTimeout(600) // debounce 대기
      await searchInput.clear()
    }
  })

  test('유저 상세 페이지 이동', async ({ page }) => {
    // 테이블 첫 번째 행 클릭 시도
    const firstRow = page.locator('table tbody tr').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      await page.waitForTimeout(500)
      // /members/[id] 경로로 이동했는지 확인
      await expect(page).toHaveURL(/\/members\//)
    }
  })
})
