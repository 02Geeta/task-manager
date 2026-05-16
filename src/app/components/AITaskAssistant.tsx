import React, { useState } from "react";
import {
  Sparkles,
  Wand2,
  Lightbulb,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckSquare,
  Tag,
  Brain,
  Zap,
  AlertCircle,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface AITaskAssistantProps {
  onApplySuggestion: (suggestion: any) => void;
}

interface AISuggestion {
  title: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  description: string;
  subtasks: string[];
  tags: string[];
  confidence: number;
  reasoning: string;
  riskFactors: string[];
  estimatedHours: number;
}

export function AITaskAssistant({ onApplySuggestion }: AITaskAssistantProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<AISuggestion | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const today = new Date().toISOString().split("T")[0];

      const prompt = `You are an expert project manager AI. Today's date is ${today}.
Analyze this task description and return ONLY a valid JSON object, no markdown, no explanation, no extra text whatsoever.

Required JSON structure:
{
  "title": "cleaned concise task title",
  "priority": "High",
  "dueDate": "YYYY-MM-DD",
  "description": "structured description with sections: Objective, Steps, Acceptance Criteria",
  "subtasks": ["subtask 1", "subtask 2", "subtask 3"],
  "tags": ["tag1", "tag2"],
  "confidence": 0.88,
  "reasoning": "1-2 sentence explanation of priority and timeline choice",
  "riskFactors": ["risk 1", "risk 2"],
  "estimatedHours": 4
}

Rules:
- priority must be exactly "High", "Medium", or "Low"
- subtasks: 3-6 specific actionable items relevant to the task
- tags: 2-5 from: frontend, backend, bug, security, ux, database, api, testing, devops, design
- riskFactors: 1-3 realistic blockers or dependencies
- estimatedHours: integer between 1 and 40
- dueDate: if urgency words present use them, else High=3 days from today, Medium=7 days, Low=14 days
- confidence: float between 0.75 and 0.99

Task description: "${input}"`;

      // Route through your existing Supabase edge function
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bfa263b0/ai-task-suggestions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ prompt }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Edge function request failed");
      }

      // Handle both possible response shapes
      const rawText =
        data.result ||
        data.text ||
        data.content?.[0]?.text ||
        "";

      if (!rawText) throw new Error("Empty response from AI");

      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const parsed: AISuggestion = JSON.parse(cleaned);
      setSuggestions(parsed);

    } catch (err: any) {
      console.error("AI suggestion error:", err);

      // Fallback: smart local suggestions so the UI is never broken
      const lowered = input.toLowerCase();
      const isHigh =
        lowered.includes("urgent") ||
        lowered.includes("critical") ||
        lowered.includes("asap") ||
        lowered.includes("fix") ||
        lowered.includes("bug");
      const isLow =
        lowered.includes("minor") ||
        lowered.includes("optional") ||
        lowered.includes("later");

      const priority: "High" | "Medium" | "Low" = isHigh
        ? "High"
        : isLow
        ? "Low"
        : "Medium";

      const daysMap = { High: 3, Medium: 7, Low: 14 };
      const due = new Date();
      due.setDate(due.getDate() + daysMap[priority]);
      const dueDate = due.toISOString().split("T")[0];

      const tags: string[] = [];
      if (lowered.includes("frontend") || lowered.includes("ui")) tags.push("frontend");
      if (lowered.includes("backend") || lowered.includes("api")) tags.push("backend");
      if (lowered.includes("bug") || lowered.includes("fix")) tags.push("bug");
      if (lowered.includes("design")) tags.push("design");
      if (lowered.includes("test")) tags.push("testing");
      if (tags.length === 0) tags.push("general");

      setSuggestions({
        title: input,
        priority,
        dueDate,
        description: `Task: ${input}\n\nObjective:\n\nSteps:\n1. \n2. \n\nAcceptance Criteria:\n- `,
        subtasks: [
          "Review requirements",
          "Plan implementation",
          "Execute task",
          "Test and verify",
          "Document changes",
        ],
        tags,
        confidence: 0.65,
        reasoning: `Estimated as ${priority} priority based on task keywords. AI backend unavailable — using local analysis.`,
        riskFactors: ["AI backend unavailable — connect Supabase edge function for full analysis"],
        estimatedHours: priority === "High" ? 4 : priority === "Medium" ? 8 : 16,
      });

      // Show a softer warning rather than a hard error
      setError("AI backend not connected — showing local estimates. Connect your edge function for full Claude AI analysis.");
    } finally {
      setLoading(false);
    }
  };

  const applyAllSuggestions = () => {
    if (!suggestions) return;
    onApplySuggestion({
      title: suggestions.title,
      description: suggestions.description,
      priority: suggestions.priority,
      dueDate: suggestions.dueDate,
    });
    setSuggestions(null);
    setInput("");
    setError(null);
  };

  const glassCard: React.CSSProperties = {
    background: "rgba(255,255,255,0.45)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(197,184,232,0.5)",
    borderRadius: "14px",
    padding: "14px",
  };

  const priorityStyle = {
    High: {
      bg: "rgba(239,68,68,0.10)",
      text: "#b91c1c",
      border: "rgba(239,68,68,0.25)",
    },
    Medium: {
      bg: "rgba(245,158,11,0.10)",
      text: "#92400e",
      border: "rgba(245,158,11,0.25)",
    },
    Low: {
      bg: "rgba(34,197,94,0.10)",
      text: "#065f46",
      border: "rgba(34,197,94,0.25)",
    },
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(197,184,232,0.15)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(197,184,232,0.4)",
      }}
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer flex items-center justify-between select-none"
        style={{
          background: "rgba(197,184,232,0.3)",
          borderBottom: "1px solid rgba(197,184,232,0.35)",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" style={{ color: "#6B5FA6" }} />
          <h3 className="font-semibold text-sm" style={{ color: "#2D1B6B" }}>
            AI Task Assistant
          </h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "rgba(107,95,166,0.15)",
              color: "#6B5FA6",
              border: "1px solid rgba(197,184,232,0.55)",
            }}
          >
            Claude AI
          </span>
        </div>
        {isExpanded
          ? <ChevronUp className="w-4 h-4" style={{ color: "#8B7EC8" }} />
          : <ChevronDown className="w-4 h-4" style={{ color: "#8B7EC8" }} />
        }
      </div>

      {isExpanded && (
        <div className="p-5 space-y-4">

          {/* Input */}
          <div>
            <label
              className="block text-xs font-semibold mb-2"
              style={{ color: "#4A3F7A" }}
            >
              Describe your task — Claude will analyze it
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") generateSuggestions();
                }}
                placeholder="e.g. Fix urgent login bug on mobile, Add payment integration..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(197,184,232,0.5)",
                  color: "#2D1B6B",
                  backdropFilter: "blur(8px)",
                }}
              />
              <button
                onClick={generateSuggestions}
                disabled={!input.trim() || loading}
                className="px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                style={{
                  background: loading
                    ? "rgba(197,184,232,0.4)"
                    : "rgba(107,95,166,0.85)",
                  color: loading ? "#6B5FA6" : "#ffffff",
                  border: "1px solid rgba(197,184,232,0.5)",
                  boxShadow: loading
                    ? "none"
                    : "0 2px 10px rgba(107,95,166,0.3)",
                }}
              >
                {loading ? (
                  <>
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 animate-spin"
                      style={{
                        borderColor: "rgba(107,95,166,0.3)",
                        borderTopColor: "#6B5FA6",
                      }}
                    />
                    Analyzing
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Warning (soft — shown when fallback is used) */}
          {error && (
            <div
              className="flex items-start gap-2 p-3 rounded-xl text-xs"
              style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.25)",
                color: "#92400e",
              }}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Suggestions */}
          {suggestions && (
            <div className="space-y-3">

              {/* Confidence bar + Apply */}
              <div
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.25)",
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Lightbulb className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="text-xs font-medium text-green-800">
                    Confidence: {(suggestions.confidence * 100).toFixed(0)}%
                  </span>
                  <span className="text-xs text-green-700 truncate hidden sm:block">
                    — {suggestions.reasoning}
                  </span>
                </div>
                <button
                  onClick={applyAllSuggestions}
                  className="ml-3 shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                  style={{
                    background: "rgba(34,197,94,0.8)",
                    boxShadow: "0 2px 8px rgba(34,197,94,0.3)",
                  }}
                >
                  Apply All
                </button>
              </div>

              {/* Priority + Due Date + Estimate */}
              <div className="grid grid-cols-3 gap-3">
                <div style={glassCard}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: "#8B7EC8" }} />
                    <span className="text-xs font-semibold" style={{ color: "#2D1B6B" }}>
                      Priority
                    </span>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                    style={{
                      background: priorityStyle[suggestions.priority].bg,
                      color: priorityStyle[suggestions.priority].text,
                      border: `1px solid ${priorityStyle[suggestions.priority].border}`,
                    }}
                  >
                    {suggestions.priority}
                  </span>
                </div>

                <div style={glassCard}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3.5 h-3.5" style={{ color: "#8B7EC8" }} />
                    <span className="text-xs font-semibold" style={{ color: "#2D1B6B" }}>
                      Due Date
                    </span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: "#4A3F7A" }}>
                    {suggestions.dueDate || "Not set"}
                  </span>
                </div>

                <div style={glassCard}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Zap className="w-3.5 h-3.5" style={{ color: "#8B7EC8" }} />
                    <span className="text-xs font-semibold" style={{ color: "#2D1B6B" }}>
                      Estimate
                    </span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: "#4A3F7A" }}>
                    {suggestions.estimatedHours}h
                  </span>
                </div>
              </div>

              {/* Reasoning (mobile only — desktop shows in bar above) */}
              <div
                className="p-3 rounded-xl text-xs sm:hidden"
                style={{
                  background: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(197,184,232,0.4)",
                  color: "#4A3F7A",
                }}
              >
                {suggestions.reasoning}
              </div>

              {/* Risk Factors */}
              {suggestions.riskFactors?.length > 0 && (
                <div style={glassCard}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4" style={{ color: "#c2410c" }} />
                    <span className="text-sm font-semibold" style={{ color: "#2D1B6B" }}>
                      Risk Factors
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {suggestions.riskFactors.map((risk, i) => (
                      <li
                        key={i}
                        className="text-xs flex items-start gap-2"
                        style={{ color: "#7c2d12" }}
                      >
                        <span
                          className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold text-xs"
                          style={{
                            background: "rgba(234,88,12,0.12)",
                            color: "#c2410c",
                          }}
                        >
                          !
                        </span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Subtasks */}
              {suggestions.subtasks?.length > 0 && (
                <div style={glassCard}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckSquare className="w-4 h-4" style={{ color: "#8B7EC8" }} />
                    <span className="text-sm font-semibold" style={{ color: "#2D1B6B" }}>
                      Suggested Subtasks
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {suggestions.subtasks.map((s, i) => (
                      <li
                        key={i}
                        className="text-xs flex items-start gap-2"
                        style={{ color: "#4A3F7A" }}
                      >
                        <span
                          className="mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 font-semibold text-xs"
                          style={{
                            background: "rgba(197,184,232,0.4)",
                            color: "#6B5FA6",
                          }}
                        >
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {suggestions.tags?.length > 0 && (
                <div style={glassCard}>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4" style={{ color: "#8B7EC8" }} />
                    <span className="text-sm font-semibold" style={{ color: "#2D1B6B" }}>
                      Tags
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs rounded-lg font-medium"
                        style={{
                          background: "rgba(197,184,232,0.3)",
                          color: "#4A3F7A",
                          border: "1px solid rgba(197,184,232,0.5)",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Generated Description */}
              <div style={glassCard}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" style={{ color: "#8B7EC8" }} />
                  <span className="text-sm font-semibold" style={{ color: "#2D1B6B" }}>
                    Generated Description
                  </span>
                </div>
                <pre
                  className="whitespace-pre-wrap text-xs font-sans leading-relaxed"
                  style={{ color: "#4A3F7A" }}
                >
                  {suggestions.description}
                </pre>
              </div>

            </div>
          )}

          {/* Empty state */}
          {!suggestions && !loading && !error && (
            <div
              className="text-center py-4 text-xs"
              style={{ color: "#8B7EC8" }}
            >
              Describe any task above and click Analyze — Claude will suggest priority, due date, subtasks, risks and more.
            </div>
          )}

        </div>
      )}
    </div>
  );
}