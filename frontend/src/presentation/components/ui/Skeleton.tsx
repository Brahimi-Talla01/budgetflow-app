interface SkeletonProps {
      className?: string;
}

/** Bloc de chargement neutre, à composer pour dessiner la forme attendue. */
export const Skeleton = ({ className = "" }: SkeletonProps) => (
      <div className={`animate-pulse rounded-md bg-gray-200/80 ${className}`} aria-hidden="true" />
);

export const SkeletonList = ({ rows = 3 }: { rows?: number }) => (
      <div className="space-y-3" role="status" aria-label="Chargement">
            {Array.from({ length: rows }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                              <Skeleton className="h-3 w-1/3" />
                              <Skeleton className="h-3 w-1/4" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                  </div>
            ))}
      </div>
);
