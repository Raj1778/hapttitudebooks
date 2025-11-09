export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] px-4 sm:px-6 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-[#d5e9dc]">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AffiliateDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] px-4 sm:px-6 lg:px-20 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Affiliate Link Skeleton */}
        <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60 mb-8">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Commission Details Skeleton */}
        <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-72 bg-gray-200 rounded animate-pulse mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SelectAddressSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] px-4 sm:px-6 lg:px-20 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Back Button Skeleton */}
        <div className="mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Title Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Container Skeleton */}
        <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 sm:p-10 border border-[#d5e9dc]/60">
          {/* Address Cards Skeleton */}
          <div className="space-y-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="p-5 rounded-2xl border border-[#d5e9dc] bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Add New Address Button Skeleton */}
          <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Continue Button Skeleton */}
        <div className="mt-8 flex justify-end">
          <div className="h-12 w-40 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] px-4 sm:px-6 lg:px-20 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button Skeleton */}
        <div className="mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Title Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Cart Items Skeleton */}
        <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 sm:p-10 border border-[#d5e9dc]/60 mb-8">
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border-b border-[#d5e9dc]">
                <div className="h-32 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Skeleton */}
        <div className="bg-[#f8fdf9] rounded-3xl shadow-md p-6 border border-[#d5e9dc]/60 mb-8">
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-px bg-[#d5e9dc] my-3"></div>
            <div className="flex justify-between">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Checkout Button Skeleton */}
        <div className="flex justify-end">
          <div className="h-12 w-48 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}







