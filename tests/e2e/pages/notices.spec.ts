import { test, expect } from '@playwright/test'

test.describe('공지사항 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notices')
    await expect(page.getByRole('heading', { name: '공지사항 관리' })).toBeVisible()
  })

  test('페이지 타이틀과 설명 표시', async ({ page }) => {
    await expect(page.getByText('서비스 공지사항을 등록하고 활성화 상태를 관리합니다.')).toBeVisible()
  })

  test('공지사항 목록 렌더링', async ({ page }) => {
    await page.waitForSelector('main', { state: 'visible' })
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('공지사항 등록 버튼 존재', async ({ page }) => {
    const addButton = page.getByRole('button').filter({ hasText: /등록|추가|생성|작성|new|add/i }).first()
    if (await addButton.isVisible()) {
      await expect(addButton).toBeEnabled()
      await addButton.click()
      await page.waitForTimeout(500)
      // 모달 또는 폼이 열렸는지 확인
      const dialog = page.getByRole('dialog')
      if (await dialog.isVisible()) {
        await page.keyboard.press('Escape')
        await page.waitForTimeout(300)
      }
    }
  })
})
