import { useState } from "react";
import { X, FolderPlus } from "lucide-react";

interface CreateProjectModalProps {
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

export function CreateProjectModal({ onClose, onCreate }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onCreate(name, description);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
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
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
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
              <FolderPlus className="w-4 h-4" style={{ color: "#6B4EAF" }} />
            </div>
            <h3 className="text-base font-semibold" style={{ color: "#2D1B6B" }}>
              Create New Project
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: "#4B3499" }}
            >
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="My Awesome Project"
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
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: "#4B3499" }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the project..."
              style={{ ...inputStyle, resize: "none" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(139,110,212,0.7)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196,181,232,0.30)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(196,181,232,0.5)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(196,181,232,0.55)",
                color: "#6B4EAF",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{
                background: "rgba(172,148,220,0.70)",
                border: "1px solid rgba(172,148,220,0.80)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "#2D1B6B",
                boxShadow: "0 4px 16px rgba(139,110,212,0.18)",
              }}
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}