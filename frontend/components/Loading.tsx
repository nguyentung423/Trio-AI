/**
 * Loading.tsx
 *
 * Reusable loading spinner component
 */

interface LoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export default function Loading({
  text = "Đang tải...",
  size = "md",
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sizeClasses[size]} border-uet-200 border-t-uet-600 rounded-full animate-spin`}
      />
      {text && <p className={`text-gray-500 ${textSizes[size]}`}>{text}</p>}
    </div>
  );
}

/**
 * Skeleton loading cho cards
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-300 rounded"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-3 w-32 bg-gray-200 rounded mt-4"></div>
    </div>
  );
}

/**
 * Skeleton loading cho charts
 */
export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
      <div className="h-64 bg-gray-100 rounded flex items-end justify-around p-4 gap-2">
        {[40, 60, 80, 55, 70, 45, 75].map((height, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-t flex-1"
            style={{ height: `${height}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

/**
 * Full page loading overlay
 */
export function PageLoading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-uet-200 border-t-uet-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
      </div>
    </div>
  );
}
