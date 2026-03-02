"use client";

import { Bell, PanelLeft, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useAdminStore } from "@/featured/auth/store";

export function AdminHeader() {
  const { admin, logout } = useAdminStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="relative w-60">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="검색..."
            className="h-9 bg-muted/40 pl-9 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-9 items-center gap-2 rounded-full px-2"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                  관
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {admin?.name ?? "관리자"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <p className="text-xs text-muted-foreground">로그인 계정</p>
              <p className="truncate text-sm font-medium">
                {admin?.email ?? "admin@interviewai.kr"}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive"
            >
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
