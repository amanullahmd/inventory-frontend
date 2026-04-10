export default function VehicleManagementLoading() {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-4 lg:p-6 max-w-350 mx-auto">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
              <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
          </div>
          {/* Tab navigation skeleton */}
          <div className="flex items-center gap-1 border-b border-border">
            <div className="h-10 w-28 bg-muted/50 rounded animate-pulse" />
            <div className="h-10 w-28 bg-muted/50 rounded animate-pulse" />
          </div>
        </div>

        {/* Summary cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-muted animate-pulse" />
                <div className="h-4 w-12 bg-muted/50 rounded animate-pulse" />
              </div>
              <div className="h-8 w-20 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 w-24 bg-muted/50 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Trend chart skeleton */}
        <div className="mb-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
              <div className="h-4 w-32 bg-muted/40 rounded animate-pulse" />
            </div>
            <div className="h-[280px] w-full bg-muted/20 rounded animate-pulse" />
          </div>
        </div>

        {/* Charts row skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="h-5 w-48 bg-muted rounded animate-pulse mb-4" />
              <div className="h-[320px] w-full bg-muted/20 rounded animate-pulse" />
            </div>
          </div>
          <div>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
              <div className="h-[240px] w-full bg-muted/20 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Ranking chart skeleton */}
        <div className="mb-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="h-5 w-40 bg-muted rounded animate-pulse mb-4" />
            <div className="h-48 w-full bg-muted/20 rounded animate-pulse" />
          </div>
        </div>

        {/* Vehicle cards skeleton */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-1 bg-primary rounded-full" />
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-muted animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 w-20 bg-muted/50 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-24 bg-muted rounded animate-pulse mb-3" />
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                  <div className="h-full w-3/4 bg-muted-foreground/30 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-3 w-full bg-muted/40 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
