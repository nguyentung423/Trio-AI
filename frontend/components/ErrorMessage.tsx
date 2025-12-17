/**
 * ErrorMessage.tsx
 *
 * Reusable error message component
 */

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  type?: "error" | "warning" | "info";
}

export default function ErrorMessage({
  title,
  message,
  onRetry,
  type = "error",
}: ErrorMessageProps) {
  const styles = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      title: "text-red-800",
      text: "text-red-700",
      icon: "❌",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      title: "text-amber-800",
      text: "text-amber-700",
      icon: "⚠️",
      button: "bg-amber-600 hover:bg-amber-700",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      title: "text-blue-800",
      text: "text-blue-700",
      icon: "ℹ️",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const s = styles[type];

  return (
    <div className={`${s.bg} ${s.border} border rounded-xl p-4 md:p-6`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{s.icon}</span>
        <div className="flex-1">
          {title && <h3 className={`font-bold ${s.title} mb-1`}>{title}</h3>}
          <p className={`${s.text} text-sm md:text-base`}>{message}</p>

          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 px-4 py-2 ${s.button} text-white rounded-lg text-sm font-medium transition-colors`}
            >
              🔄 Thử lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * API Error với hướng dẫn cụ thể
 */
export function ApiError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🔌</span>
        <div className="flex-1">
          <h3 className="font-bold text-red-800 mb-2">
            Không thể kết nối tới server
          </h3>
          <p className="text-red-700 text-sm mb-3">
            Backend API chưa được khởi động hoặc đang gặp sự cố.
          </p>
          <div className="bg-red-100 rounded-lg p-3 text-sm text-red-800">
            <p className="font-medium mb-1">💡 Hướng dẫn:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>
                Mở terminal tại thư mục{" "}
                <code className="bg-red-200 px-1 rounded">backend/</code>
              </li>
              <li>
                Chạy lệnh:{" "}
                <code className="bg-red-200 px-1 rounded">
                  uvicorn src.api:app --reload
                </code>
              </li>
              <li>Đợi server khởi động xong rồi thử lại</li>
            </ol>
          </div>

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              🔄 Thử lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state
 */
export function EmptyState({
  icon = "📭",
  title = "Không có dữ liệu",
  message = "Chưa có dữ liệu để hiển thị",
}: {
  icon?: string;
  title?: string;
  message?: string;
}) {
  return (
    <div className="text-center py-12">
      <span className="text-6xl block mb-4">{icon}</span>
      <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
