'use server'

import { cookies } from 'next/headers'
import { login } from '@/featured/auth/service'

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
}

export interface LoginActionState {
  success: boolean
  error?: string
}

export async function loginAction(
  _prevState: LoginActionState | null,
  formData: FormData,
): Promise<LoginActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    await login({ email, password })
    return { success: true }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, error: err.message ?? '로그인에 실패했습니다.' }
  }
}
