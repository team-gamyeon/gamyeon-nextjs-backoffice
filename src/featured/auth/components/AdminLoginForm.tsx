'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, AlertCircle, Check, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { loginAction } from '@/featured/auth/actions'
import { useAdminStore } from '@/featured/auth/store'
import Image from 'next/image'
import Link from 'next/link'

const REMEMBER_KEY = 'login_remember'

export function AdminLoginForm() {
  const router = useRouter()
  const { setAuthenticated } = useAdminStore()
  const [showPassword, setShowPassword] = useState(false)
  const [state, action, isPending] = useActionState(loginAction, null)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const isSuccess = state?.success === true

  /* eslint-disable react-hooks/set-state-in-effect -- 브라우저 저장값은 hydration 이후에만 복원할 수 있다. */
  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY)
    if (!saved) return

    try {
      const value = JSON.parse(saved) as { email?: unknown }
      const savedEmail = typeof value.email === 'string' ? value.email : ''
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email: savedEmail }))
      setEmail(savedEmail)
      setRememberMe(true)
    } catch {
      localStorage.removeItem(REMEMBER_KEY)
    }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!isSuccess) return

    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email }))
    } else {
      localStorage.removeItem(REMEMBER_KEY)
    }

    setAuthenticated(true)
    const redirectTimer = window.setTimeout(() => router.push('/dashboard'), 800)
    return () => window.clearTimeout(redirectTimer)
  }, [email, isSuccess, rememberMe, router, setAuthenticated])

  return (
    <div className="bg-muted/20 flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-4 text-center">
          <Link
            href="/dashboard"
            className="text-foreground flex items-center justify-center gap-0.5"
          >
            <Image
              src="/images/Gamyeon_Logo.png"
              alt="Gamyeon logo"
              width={1024}
              height={768}
              style={{ height: '44px', width: 'auto' }}
            />
          </Link>
        </div>

        <Card className="border-border/50 shadow-primary/5 py-6 shadow-xl">
          <CardHeader className="pb-4 text-center">
            <h1 className="text-2xl font-bold">Gamyeon Backoffice</h1>
            <p className="text-muted-foreground text-sm">관리자 계정으로 로그인해주세요</p>

            <div className="mt-4 flex justify-center">
              <div className="bg-primary/5 border-primary/10 flex items-center gap-2 rounded-lg border px-3 py-2">
                <Lock className="text-primary h-3.5 w-3.5" />
                <span className="text-primary text-xs font-medium">관리자 전용 접근</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form action={action} className="space-y-4">
              {state?.error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-md px-3 py-2.5 text-sm"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {state.error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@interviewai.kr"
                    className="pl-10"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    className="pr-10 pl-10"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="accent-primary h-4 w-4 cursor-pointer"
                />
                <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
                  아이디 저장
                </Label>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isPending || isSuccess}>
                {isSuccess ? (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    완료
                  </span>
                ) : isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    로그인 중...
                  </span>
                ) : (
                  '로그인'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
