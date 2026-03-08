"use client";

/* ─────────────────────────────────────────────────────────────
   UI Preview — iframe 방식으로 실제 페이지를 1920 × 1080 프레임에 표시
───────────────────────────────────────────────────────────── */

const TOC = [
  { id: "login", index: "01", label: "로그인", src: "/login" },
  { id: "dashboard", index: "02", label: "대시보드", src: "/dashboard" },
  { id: "members", index: "03", label: "유저 관리", src: "/members" },
  {
    id: "member-detail",
    index: "04",
    label: "유저 상세",
    src: "/members/usr_001",
  },
  {
    id: "questions",
    index: "05",
    label: "공통 질문 관리",
    src: "/questions",
  },
  {
    id: "notices",
    index: "06",
    label: "공지사항 관리",
    src: "/notices",
  },
  {
    id: "interviews",
    index: "07",
    label: "면접 관리",
    src: "/interviews",
  },
  {
    id: "reports",
    index: "08",
    label: "리포트 관리",
    src: "/reports",
  },
];

function Section({
  id,
  index,
  label,
  src,
}: {
  id: string;
  index: string;
  label: string;
  src: string;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <p className="mb-3 px-8 text-xs font-semibold uppercase tracking-widest text-neutral-400">
        {index} — {label}
      </p>
      <div className="overflow-x-auto text-center">
        <div className="mx-auto w-max overflow-hidden rounded-xl border border-neutral-200 shadow-lg text-left">
          <iframe
            src={src}
            width={1920}
            height={1080}
            className="block border-0"
            title={label}
          />
        </div>
      </div>
    </section>
  );
}

export default function UiPreviewPage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      {/* 상단 고정 바 */}
      <div className="sticky top-0 z-50 border-b border-neutral-200 bg-white px-8 py-4 shadow-sm">
        <div className="mx-auto max-w-480">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-lg font-bold text-neutral-900">
                UI Preview · Gamyeon Admin
              </h1>
              <p className="mt-0.5 text-xs text-neutral-500">
                모든 화면 UI/UX 미리보기 · 각 프레임 1920 × 1080 px
              </p>
            </div>
            <nav className="flex flex-wrap justify-end gap-1.5">
              {TOC.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="rounded-md bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-200"
                >
                  {p.index} {p.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* 페이지 목록 */}
      <div className="space-y-12 py-10">
        {TOC.map((p) => (
          <Section
            key={p.id}
            id={p.id}
            index={p.index}
            label={p.label}
            src={p.src}
          />
        ))}
      </div>
    </div>
  );
}
