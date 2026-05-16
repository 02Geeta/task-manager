import { Clock, CheckCircle, UserPlus, Trash2, Edit, MessageCircle } from "lucide-react";

interface Activity {
  id: string;
  type: "task_created" | "task_updated" | "task_completed" | "task_deleted" | "member_added" | "comment_added";
  description: string;
  userName: string;
  timestamp: string;
  metadata?: any;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "task_created": return <Edit className="w-4 h-4" />;
      case "task_updated": return <Edit className="w-4 h-4" />;
      case "task_completed": return <CheckCircle className="w-4 h-4" />;
      case "task_deleted": return <Trash2 className="w-4 h-4" />;
      case "member_added": return <UserPlus className="w-4 h-4" />;
      case "comment_added": return <MessageCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case "task_created":   return { bg: "rgba(196,181,232,0.3)", color: "#6B4EAF" };
      case "task_updated":   return { bg: "rgba(164,142,214,0.3)", color: "#6B4EAF" };
      case "task_completed": return { bg: "rgba(74,222,128,0.2)",  color: "#16a34a" };
      case "task_deleted":   return { bg: "rgba(248,113,113,0.2)", color: "#dc2626" };
      case "member_added":   return { bg: "rgba(251,191,36,0.2)",  color: "#b45309" };
      case "comment_added":  return { bg: "rgba(129,140,248,0.2)", color: "#4338ca" };
      default:               return { bg: "rgba(196,181,232,0.2)", color: "#6B4EAF" };
    }
  };

  const getTimeAgo = (dateString: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const m = Math.floor(seconds / 60); if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24); if (d < 7) return `${d}d ago`;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.40)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.65)",
        boxShadow: "0 4px 24px rgba(139,110,212,0.10)",
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(196,181,232,0.35)", border: "1px solid rgba(196,181,232,0.5)" }}>
          <Clock className="w-4 h-4 text-[#6B4EAF]" />
        </div>
        <h3 className="text-base font-semibold text-[#2D1B6B]">Recent Activity</h3>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-10 h-10 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: "rgba(196,181,232,0.25)", border: "1px solid rgba(196,181,232,0.4)" }}>
              <Clock className="w-5 h-5 text-[#C4B5E8]" />
            </div>
            <p className="text-sm text-[#9B8BC0]">No activity yet</p>
          </div>
        ) : (
          activities.map((activity) => {
            const s = getStyle(activity.type);
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl transition-all"
                style={{ background: "rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(196,181,232,0.18)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: s.bg, color: s.color }}>
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#4B3499]">
                    <span className="font-semibold text-[#2D1B6B]">{activity.userName}</span>{" "}
                    {activity.description}
                  </p>
                  <p className="text-xs text-[#9B8BC0] mt-0.5">{getTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}