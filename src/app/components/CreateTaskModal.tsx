import React, { useState } from "react";
import { X, ClipboardList } from "lucide-react";
import { AITaskAssistant } from "./AITaskAssistant";

interface Member {
  id: string;
  name: string;
}

interface CreateTaskModalProps {
  members: Member[];
  onClose: () => void;
  onCreate: (task: {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    assignedTo: string;
  }) => void;
}

export function CreateTaskModal({ members, onClose, onCreate }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");

  const handleAISuggestion = (suggestion: any) => {
    if (suggestion.title)       setTitle(suggestion.title);
    if (suggestion.description) setDescription(suggestion.description);
    if (suggestion.priority)    setPriority(suggestion.priority);
    if (suggestion.dueDate)     setDueDate(suggestion.dueDate);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, description, dueDate, priority, assignedTo });
    onClose();
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

  const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(139,110,212,0.7)";
    e.currentTarget.style.boxShadow  = "0 0 0 3px rgba(196,181,232,0.30)";
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(196,181,232,0.5)";
    e.currentTarget.style.boxShadow  = "none";
  };

  const priorityColors: Record<string, string> = {
    Low:    "#1A5C3A",
    Medium: "#3D2876",
    High:   "#7A2020",
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
        className="w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
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
              <ClipboardList className="w-4 h-4" style={{ color: "#6B4EAF" }} />
            </div>
            <h2 className="text-base font-semibold" style={{ color: "#2D1B6B" }}>
              Create New Task
            </h2>
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

        {/* AI Task Assistant — fully wired */}
        <div className="mb-5">
          <AITaskAssistant onApplySuggestion={handleAISuggestion} />
        </div>

        {/* Divider */}
        <div
          className="mb-5 h-px w-full"
          style={{ background: "rgba(196,181,232,0.40)" }}
        />

        {/* Manual form below — auto-filled by AI or editable by hand */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#4B3499" }}>
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title or use AI above"
              required
              style={inputStyle}
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#4B3499" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the task or let AI generate a structured description..."
              style={{ ...inputStyle, resize: "none" }}
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>

          {/* Due Date + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#4B3499" }}>
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#4B3499" }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ ...inputStyle, color: priorityColors[priority] ?? "#2D1B6B" }}
                onFocus={focusIn}
                onBlur={focusOut}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#4B3499" }}>
              Assign To
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              style={inputStyle}
              onFocus={focusIn}
              onBlur={focusOut}
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
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
                background: "rgba(107,95,166,0.85)",
                border: "1px solid rgba(107,95,166,0.9)",
                color: "#ffffff",
                boxShadow: "0 4px 16px rgba(107,95,166,0.30)",
              }}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}