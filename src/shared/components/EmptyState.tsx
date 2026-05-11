import { type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 py-8">
      <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground h-6 w-6" />
      </div>
      <div className="text-center">
        <p className="text-foreground text-sm font-medium">{title}</p>
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      </div>
    </div>
  )
}
