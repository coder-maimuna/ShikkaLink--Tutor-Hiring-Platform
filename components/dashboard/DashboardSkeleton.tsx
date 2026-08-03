interface DashboardSkeletonProps {
  label?: string;
}

export default function DashboardSkeleton({ label = 'Loading dashboard…' }: DashboardSkeletonProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8F5E9] border-t-[#2D7A3A]" />
      <p className="text-sm text-[#1A1A1A]/60">{label}</p>
      <div className="mt-4 grid w-full max-w-4xl gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-[#E8F5E9]/60" />
        ))}
      </div>
    </div>
  );
}
