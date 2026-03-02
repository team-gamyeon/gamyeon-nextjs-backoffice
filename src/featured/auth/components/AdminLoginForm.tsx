"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useAdminLogin } from "@/featured/auth/hooks/useAdminLogin";

export function AdminLoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    error,
    handleLogin,
  } = useAdminLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
            <BrainCircuit className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">InterviewAI Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            관리자 계정으로 로그인해주세요
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-border/60 shadow-xl shadow-primary/5">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 rounded-lg bg-primary/8 px-3 py-2.5">
                <Lock className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">
                  관리자 전용 접근
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@interviewai.kr"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      로그인 중...
                    </span>
                  ) : (
                    "로그인"
                  )}
                </Button>
              </form>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                테스트 계정:{" "}
                <span className="font-mono text-foreground">
                  admin@interviewai.kr / admin1234!
                </span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
