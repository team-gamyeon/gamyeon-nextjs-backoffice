import { test as setup, expect } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '../.auth/user.json')

setup('로그인 후 인증 상태 저장', async ({ page }) => {
  await page.goto('/login')

  await expect(page.getByRole('heading', { name: 'Gamyeon Backoffice' })).toBeVisible()

  await page.getByLabel('이메일').fill('admin@interviewai.kr')
  await page.getByLabel('비밀번호').fill('admin1234!')
  await page.getByRole('button', { name: '로그인' }).click()

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 })

  await page.context().storageState({ path: authFile })
})
