import { useState } from "react";
import { Send, Trash2, MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
  currentUserId: string;
  currentUserName: string;
  onAddComment: (taskId: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export function TaskComments({
  taskId,
  comments,
  currentUserId,
  currentUserName,
  onAddComment,
  onDeleteComment,
}: TaskCommentsProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(taskId, newComment.trim());
      setNewComment("");
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

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
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: "rgba(243,239,254,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.75)",
        boxShadow: "0 4px 24px rgba(139,110,212,0.10)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(196,181,232,0.45)",
            border: "1px solid rgba(196,181,232,0.6)",
          }}
        >
          <MessageCircle className="w-4 h-4" style={{ color: "#6B4EAF" }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: "#2D1B6B" }}>
          Comments
          <span
            className="ml-1.5 text-xs font-medium px-1.5 py-0.5 rounded-full"
            style={{
              background: "rgba(196,181,232,0.45)",
              color: "#4B3499",
            }}
          >
            {comments.length}
          </span>
        </h3>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(196,181,232,0.35)" }} />

      {/* Comment list */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div
            className="text-center py-8 text-xs font-medium rounded-xl"
            style={{
              color: "#9B8ACA",
              background: "rgba(255,255,255,0.35)",
              border: "1px dashed rgba(196,181,232,0.50)",
            }}
          >
            No comments yet. Start the conversation.
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-3 p-3.5 rounded-xl transition-all"
              style={{
                background: "rgba(255,255,255,0.50)",
                border: "1px solid rgba(196,181,232,0.30)",
              }}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: "rgba(172,148,220,0.55)",
                  border: "1px solid rgba(196,181,232,0.60)",
                  color: "#2D1B6B",
                }}
              >
                {getInitials(comment.authorName)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: "#3D2876" }}>
                    {comment.authorName}
                  </span>
                  <span className="text-xs" style={{ color: "#9B8ACA" }}>
                    {getTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed whitespace-pre-wrap break-words"
                  style={{ color: "#5B4A9B" }}
                >
                  {comment.text}
                </p>
              </div>

              {comment.authorId === currentUserId && (
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
                  style={{
                    background: "rgba(233,168,168,0.30)",
                    border: "1px solid rgba(220,120,120,0.30)",
                    color: "#7A2020",
                  }}
                  title="Delete comment"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Current user avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: "rgba(172,148,220,0.55)",
            border: "1px solid rgba(196,181,232,0.60)",
            color: "#2D1B6B",
          }}
        >
          {getInitials(currentUserName)}
        </div>

        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          style={{
            flex: 1,
            padding: "9px 14px",
            borderRadius: "12px",
            border: "1px solid rgba(196,181,232,0.50)",
            background: "rgba(255,255,255,0.60)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            outline: "none",
            fontSize: "13px",
            color: "#2D1B6B",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(139,110,212,0.7)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196,181,232,0.28)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(196,181,232,0.50)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />

        <button
          type="submit"
          disabled={!newComment.trim()}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "rgba(172,148,220,0.70)",
            border: "1px solid rgba(172,148,220,0.80)",
            color: "#2D1B6B",
            boxShadow: "0 4px 12px rgba(139,110,212,0.18)",
          }}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}