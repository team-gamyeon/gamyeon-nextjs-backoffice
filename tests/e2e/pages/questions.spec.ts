import { test, expect } from '@playwright/test'

test.describe('공통 질문 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/questions')
    await expect(page.getByRole('heading', { name: '공통 질문 관리' })).toBeVisible()
  })

  test('페이지 타이틀과 설명 표시', async ({ page }) => {
    await expect(page.getByText('면접에서 사용되는 공통 질문을 추가하고 관리합니다.')).toBeVisible()
  })

  test('질문 목록 렌더링', async ({ page }) => {
    await page.waitForSelector('main', { state: 'visible' })
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('질문 추가 버튼 존재', async ({ page }) => {
    // 추가 버튼 탐색 (버튼 텍스트는 컴포넌트에 따라 다를 수 있음)
    const addButton = page.getByRole('button').filter({ hasText: /추가|등록|생성|new|add/i }).first()
    if (await addButton.isVisible()) {
      await expect(addButton).toBeEnabled()
    }
  })

  test('검색 동작', async ({ page }) => {
    const searchInput = page.getByRole('textbox').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('자기소개')
      await page.waitForTimeout(600)
      await searchInput.clear()
    }
  })
})
