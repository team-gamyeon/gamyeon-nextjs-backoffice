"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MemberFilters } from "./MemberFilters";
import { MemberTable } from "./MemberTable";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { Member, MemberFiltersState } from "@/featured/members/types";

interface MembersClientProps {
  initialMembers: Member[];
}

export function MembersClient({ initialMembers }: MembersClientProps) {
  const [filters, setFilters] = useState<MemberFiltersState>({
    search: "",
    status: "all",
    sortBy: "joinedAt",
    sortOrder: "desc",
  });

  const debouncedSearch = useDebounce(filters.search, 200);

  const filtered = useMemo(() => {
    let result = [...initialMembers];

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (member) =>
          member.nickname.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query)
      );
    }

    if (filters.status !== "all") {
      result = result.filter((member) => member.status === filters.status);
    }

    result.sort((memberA, memberB) => {
      const memberAValue = memberA[filters.sortBy];
      const memberBValue = memberB[filters.sortBy];
      const sortMultiplier = filters.sortOrder === "desc" ? -1 : 1;
      return memberAValue > memberBValue ? sortMultiplier : -sortMultiplier;
    });

    return result;
  }, [initialMembers, debouncedSearch, filters.status, filters.sortBy, filters.sortOrder]);

  const handleFilterChange = (partial: Partial<MemberFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 min-h-0 flex-col gap-4"
      suppressHydrationWarning
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          총{" "}
          <span className="font-semibold text-foreground">{filtered.length}</span>
          명의 회원
        </p>
      </div>

      <MemberFilters filters={filters} onFilterChange={handleFilterChange} />
      <div className="flex flex-1 min-h-0 flex-col">
        <MemberTable members={filtered} />
      </div>
    </motion.div>
  );
}
