import { useState } from "react";
import { Bell, Check, X, AlertCircle, CheckCircle, Info } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function Notifications({
  notifications,
  onMarkAsRead,
  onDismiss,
  onMarkAllAsRead,
}: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4" />;
      case "warning": return <AlertCircle className="w-4 h-4" />;
      case "error":   return <AlertCircle className="w-4 h-4" />;
      default:        return <Info className="w-4 h-4" />;
    }
  };

  const getTypeStyle = (type: string): React.CSSProperties => {
    switch (type) {
      case "success":
        return { background: "rgba(168,220,196,0.50)", border: "1px solid rgba(120,190,152,0.50)", color: "#1A5C3A" };
      case "warning":
        return { background: "rgba(252,220,144,0.55)", border: "1px solid rgba(240,180,80,0.50)", color: "#7A4A00" };
      case "error":
        return { background: "rgba(233,168,168,0.50)", border: "1px solid rgba(220,120,120,0.50)", color: "#7A2020" };
      default:
        return { background: "rgba(196,181,232,0.40)", border: "1px solid rgba(172,148,220,0.50)", color: "#3D2876" };
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bell trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
        style={{
          background: isOpen ? "rgba(196,181,232,0.50)" : "rgba(196,181,232,0.25)",
          border: "1px solid rgba(196,181,232,0.50)",
        }}
      >
        <Bell className="w-4 h-4" style={{ color: "#6B4EAF" }} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold"
            style={{
              background: "rgba(220,120,120,0.85)",
              color: "#fff",
              boxShadow: "0 2px 6px rgba(220,120,120,0.40)",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Panel */}
          <div
            className="absolute right-0 top-12 w-96 z-50 max-h-[600px] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "rgba(243,239,254,0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.80)",
              boxShadow: "0 12px 48px rgba(139,110,212,0.22), 0 2px 8px rgba(139,110,212,0.10)",
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between p-4"
              style={{ borderBottom: "1px solid rgba(196,181,232,0.40)" }}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" style={{ color: "#6B4EAF" }} />
                <span className="font-semibold text-sm" style={{ color: "#2D1B6B" }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(172,148,220,0.45)",
                      color: "#3D2876",
                    }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs font-medium transition-colors hover:underline"
                    style={{ color: "#6B4EAF" }}
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "rgba(196,181,232,0.30)",
                    border: "1px solid rgba(196,181,232,0.45)",
                  }}
                >
                  <X className="w-3.5 h-3.5" style={{ color: "#6B4EAF" }} />
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {notifications.length === 0 ? (
                <div
                  className="text-center py-12 text-sm"
                  style={{ color: "#8B6ED4" }}
                >
                  <Bell
                    className="w-10 h-10 mx-auto mb-3"
                    style={{ color: "rgba(196,181,232,0.6)" }}
                  />
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 rounded-xl transition-all"
                    style={
                      notification.read
                        ? {
                            background: "rgba(255,255,255,0.40)",
                            border: "1px solid rgba(196,181,232,0.25)",
                          }
                        : {
                            background: "rgba(212,196,240,0.35)",
                            border: "1px solid rgba(196,181,232,0.50)",
                          }
                    }
                  >
                    {/* Type icon */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={getTypeStyle(notification.type)}
                    >
                      {getIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-semibold mb-0.5"
                        style={{ color: "#2D1B6B" }}
                      >
                        {notification.title}
                      </div>
                      <p
                        className="text-xs leading-relaxed mb-1"
                        style={{ color: "#5B4A9B" }}
                      >
                        {notification.message}
                      </p>
                      <span
                        className="text-xs"
                        style={{ color: "#9B8ACA" }}
                      >
                        {getTimeAgo(notification.timestamp)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{
                            background: "rgba(168,220,196,0.45)",
                            border: "1px solid rgba(120,190,152,0.45)",
                            color: "#1A5C3A",
                          }}
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => onDismiss(notification.id)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{
                          background: "rgba(233,168,168,0.35)",
                          border: "1px solid rgba(220,120,120,0.35)",
                          color: "#7A2020",
                        }}
                        title="Dismiss"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}