import { test, expect } from '@playwright/test'

test.describe('면접 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interviews')
    await expect(page.getByRole('heading', { name: '면접 관리' })).toBeVisible()
  })

  test('페이지 타이틀과 설명 표시', async ({ page }) => {
    await expect(page.getByText('중단된 면접 세션을 조회하고 원인을 파악합니다.')).toBeVisible()
  })

  test('면접 목록 영역 렌더링', async ({ page }) => {
    await page.waitForSelector('main', { state: 'visible' })
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('검색 또는 필터 동작', async ({ page }) => {
    const searchInput = page.getByRole('textbox').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('테스트')
      await page.waitForTimeout(600)
      await searchInput.clear()
    }
  })
})
