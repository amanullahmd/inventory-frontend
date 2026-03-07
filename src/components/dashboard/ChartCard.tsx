'use client'

import { memo } from 'react'
import { LucideIcon } from 'lucide-react'

interface ChartCardProps {
    title: string
    subtitle?: string
    icon: LucideIcon
    children: React.ReactNode
    className?: string
}

const ChartCard = memo(({
    title,
    subtitle,
    icon: Icon,
    children,
    className = ''
}: ChartCardProps) => {
    return (
        <div className={`rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col h-[400px] ${className}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary-foreground">
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-foreground leading-tight">{title}</h3>
                    {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
                </div>
            </div>
            <div className="relative flex-1 w-full min-h-[300px]">
                {children}
            </div>
        </div>
    )
})

ChartCard.displayName = 'ChartCard'

export default ChartCard
