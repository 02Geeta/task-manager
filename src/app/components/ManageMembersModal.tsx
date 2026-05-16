import { useState } from "react";
import { X, UserPlus, Trash2, Users } from "lucide-react";

interface ManageMembersModalProps {
  project: any;
  members: any[];
  currentUserId: string;
  onClose: () => void;
  onAddMember: (email: string) => void;
  onRemoveMember: (memberId: string) => void;
}

export function ManageMembersModal({
  project,
  members,
  currentUserId,
  onClose,
  onAddMember,
  onRemoveMember,
}: ManageMembersModalProps) {
  const [email, setEmail] = useState("");

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onAddMember(email);
      setEmail("");
    }
  };

  const isAdmin = project.adminId === currentUserId;

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: "9px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(196,181,232,0.5)",
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    outline: "none",
    fontSize: "14px",
    color: "#2D1B6B",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(45,27,107,0.30)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: "rgba(243,239,254,0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.80)",
          boxShadow: "0 12px 48px rgba(139,110,212,0.22), 0 2px 8px rgba(139,110,212,0.10)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(196,181,232,0.45)",
                border: "1px solid rgba(196,181,232,0.6)",
              }}
            >
              <Users className="w-4 h-4" style={{ color: "#6B4EAF" }} />
            </div>
            <h3 className="text-base font-semibold" style={{ color: "#2D1B6B" }}>
              Manage Members
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "rgba(196,181,232,0.30)",
              border: "1px solid rgba(196,181,232,0.45)",
            }}
          >
            <X className="w-4 h-4" style={{ color: "#6B4EAF" }} />
          </button>
        </div>

        {/* Add member form (admin only) */}
        {isAdmin && (
          <>
            <div
              className="mb-1 text-xs font-semibold"
              style={{ color: "#4B3499" }}
            >
              Add Member by Email
            </div>
            <form onSubmit={handleAddMember} className="flex gap-2 mb-5 mt-1.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(139,110,212,0.7)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196,181,232,0.30)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(196,181,232,0.5)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: "rgba(172,148,220,0.70)",
                  border: "1px solid rgba(172,148,220,0.80)",
                  color: "#2D1B6B",
                  boxShadow: "0 4px 12px rgba(139,110,212,0.18)",
                  whiteSpace: "nowrap",
                }}
              >
                <UserPlus className="w-4 h-4" />
                Add
              </button>
            </form>

            <div
              className="mb-4 h-px"
              style={{ background: "rgba(196,181,232,0.40)" }}
            />
          </>
        )}

        {/* Member list */}
        <div className="mb-5">
          <div
            className="text-xs font-semibold mb-3"
            style={{ color: "#4B3499" }}
          >
            Current Members ({members.length})
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{
                  background: "rgba(255,255,255,0.50)",
                  border: "1px solid rgba(196,181,232,0.35)",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: "rgba(172,148,220,0.55)",
                    color: "#2D1B6B",
                    border: "1px solid rgba(196,181,232,0.6)",
                  }}
                >
                  {getInitials(member.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold truncate"
                    style={{ color: "#2D1B6B" }}
                  >
                    {member.name}
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: "#7B6AAF" }}
                  >
                    {member.email}
                  </div>
                  {member.isAdmin && (
                    <span
                      className="inline-block text-xs font-semibold px-2 py-0.5 rounded-lg mt-1"
                      style={{
                        background: "rgba(172,148,220,0.38)",
                        color: "#4B3499",
                        border: "1px solid rgba(172,148,220,0.5)",
                      }}
                    >
                      Admin
                    </span>
                  )}
                </div>

                {isAdmin && member.id !== project.adminId && (
                  <button
                    onClick={() => onRemoveMember(member.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    style={{
                      background: "rgba(233,168,168,0.35)",
                      border: "1px solid rgba(220,120,120,0.35)",
                      color: "#7A2020",
                    }}
                    title="Remove member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(196,181,232,0.55)",
            color: "#6B4EAF",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}