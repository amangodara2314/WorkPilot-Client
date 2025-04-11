import { Skeleton } from "@/components/ui/skeleton";

export function TaskSkeleton() {
  return (
    <div className="min-h-screen">
      <main className="max-w-[1800px] mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-1/3" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="flex justify-between gap-6">
              {[1, 2].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg border p-6 flex-1 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <Skeleton className="h-4 w-24 mb-2" />
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                  {i !== 3 && <Skeleton className="h-px w-full bg-gray-200" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
