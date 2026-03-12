'use server'

import { login } from '@/featured/auth/service'
import type { Admin } from '@/featured/auth/types'

export interface LoginActionState {
  success: boolean
  admin?: Admin | null
  error?: string
}

export async function loginAction(
  _prevState: LoginActionState | null,
  formData: FormData,
): Promise<LoginActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const admin = await login({ email, password })
    return { success: true, admin }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, error: err.message ?? '로그인에 실패했습니다.' }
  }
}
