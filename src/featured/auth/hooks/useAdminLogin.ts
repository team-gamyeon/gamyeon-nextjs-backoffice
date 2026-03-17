"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/featured/auth/store";

const ADMIN_CREDENTIALS = {
  email: "admin@interviewai.kr",
  password: "admin1234!",
};

export function useAdminLogin() {
  const router = useRouter();
  const { setAdmin } = useAdminStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      document.cookie = "admin_token=mock_jwt_token; path=/; max-age=86400";
      setAdmin({ email, role: "admin" });
      router.push("/dashboard");
    } else {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    setIsLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    error,
    handleLogin,
  };
}
