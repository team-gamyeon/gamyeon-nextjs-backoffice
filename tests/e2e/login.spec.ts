import { test, expect, request } from '@playwright/test'

const BASE_URL = 'http://15.164.229.233:3002'

test.describe('백엔드 로그인 API 응답 확인', () => {
  test('POST /api/v1/auth/login 응답 raw 출력', async () => {
    const ctx = await request.newContext({ baseURL: BASE_URL })

    const res = await ctx.post('/api/v1/auth/login', {
      data: { email: 'admin@interviewai.kr', password: 'admin1234!' },
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false,
    })

    const status = res.status()
    const headers = res.headers()
    let body: unknown
    try {
      body = await res.json()
    } catch {
      body = await res.text()
    }

    console.log('=== 백엔드 응답 ===')
    console.log('Status:', status)
    console.log('Headers:', JSON.stringify(headers, null, 2))
    console.log('Body:', JSON.stringify(body, null, 2))
    console.log('Set-Cookie:', headers['set-cookie'] ?? '없음')

    // 로그 출력용 — 실패해도 내용은 볼 수 있음
    expect(status).toBeDefined()
  })
})

test.describe('관리자 로그인 UI', () => {
  test('이메일/비밀번호 입력 후 로그인 성공', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: 'Gamyeon Backoffice' })).toBeVisible()

    await page.getByLabel('이메일').fill('admin@interviewai.kr')
    await page.getByLabel('비밀번호').fill('admin1234!')
    await page.getByRole('button', { name: '로그인' }).click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
  })
})
