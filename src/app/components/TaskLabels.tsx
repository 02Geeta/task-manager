import { useState } from "react";
import { Tag, Plus, X } from "lucide-react";

interface Label {
  id: string;
  name: string;
  color: string;
}

interface TaskLabelsProps {
  selectedLabels: string[];
  availableLabels: Label[];
  onAddLabel: (labelId: string) => void;
  onRemoveLabel: (labelId: string) => void;
  onCreateLabel: (name: string, color: string) => void;
}

export function TaskLabels({
  selectedLabels,
  availableLabels,
  onAddLabel,
  onRemoveLabel,
  onCreateLabel,
}: TaskLabelsProps) {
  const [showLabelSelector, setShowLabelSelector] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#DDD6FE");

  const labelColors = [
    { name: "Lavender", value: "#DDD6FE" },
    { name: "Pink",     value: "#FBCFE8" },
    { name: "Blue",     value: "#BFDBFE" },
    { name: "Green",    value: "#BBF7D0" },
    { name: "Yellow",   value: "#FEF08A" },
    { name: "Orange",   value: "#FED7AA" },
    { name: "Red",      value: "#FECACA" },
    { name: "Indigo",   value: "#C7D2FE" },
  ];

  const handleCreateLabel = () => {
    if (newLabelName.trim()) {
      onCreateLabel(newLabelName.trim(), newLabelColor);
      setNewLabelName("");
      setNewLabelColor("#DDD6FE");
    }
  };

  const selectedLabelObjects = availableLabels.filter((l) =>
    selectedLabels.includes(l.id)
  );
  const unselectedLabels = availableLabels.filter(
    (l) => !selectedLabels.includes(l.id)
  );

  return (
    <div>
      {/* Section label */}
      <div
        className="flex items-center gap-2 mb-2"
      >
        <Tag className="w-4 h-4" style={{ color: "#6B4EAF" }} />
        <span className="text-xs font-semibold" style={{ color: "#4B3499" }}>
          Labels
        </span>
      </div>

      {/* Selected labels + Add button */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedLabelObjects.map((label) => (
          <span
            key={label.id}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: `${label.color}88`,
              border: `1px solid ${label.color}`,
              color: "#3D2876",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            {label.name}
            <button
              onClick={() => onRemoveLabel(label.id)}
              className="transition-opacity hover:opacity-60 ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <button
          onClick={() => setShowLabelSelector(!showLabelSelector)}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105"
          style={{
            background: showLabelSelector
              ? "rgba(172,148,220,0.55)"
              : "rgba(196,181,232,0.35)",
            border: "1px solid rgba(196,181,232,0.55)",
            color: "#4B3499",
          }}
        >
          <Plus className="w-3 h-3" />
          Add Label
        </button>
      </div>

      {/* Label selector panel */}
      {showLabelSelector && (
        <div
          className="rounded-xl p-4 space-y-4"
          style={{
            background: "rgba(243,239,254,0.82)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.75)",
            boxShadow: "0 4px 24px rgba(139,110,212,0.12)",
          }}
        >
          {/* Available labels */}
          {unselectedLabels.length > 0 && (
            <div>
              <div
                className="text-xs font-semibold mb-2"
                style={{ color: "#4B3499" }}
              >
                Available Labels
              </div>
              <div className="flex flex-wrap gap-2">
                {unselectedLabels.map((label) => (
                  <button
                    key={label.id}
                    onClick={() => onAddLabel(label.id)}
                    className="px-3 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105 hover:shadow-sm"
                    style={{
                      background: `${label.color}88`,
                      border: `1px solid ${label.color}`,
                      color: "#3D2876",
                    }}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          {unselectedLabels.length > 0 && (
            <div style={{ height: "1px", background: "rgba(196,181,232,0.40)" }} />
          )}

          {/* Create new label */}
          <div>
            <div
              className="text-xs font-semibold mb-2.5"
              style={{ color: "#4B3499" }}
            >
              Create New Label
            </div>

            <div className="flex gap-2 items-center flex-wrap">
              {/* Name input */}
              <input
                type="text"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Label name"
                onKeyDown={(e) => e.key === "Enter" && handleCreateLabel()}
                style={{
                  flex: "1 1 120px",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(196,181,232,0.50)",
                  background: "rgba(255,255,255,0.60)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  outline: "none",
                  fontSize: "13px",
                  color: "#2D1B6B",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  minWidth: 0,
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

              {/* Color swatches */}
              <div className="flex gap-1.5 flex-shrink-0">
                {labelColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewLabelColor(color.value)}
                    title={color.name}
                    className="w-7 h-7 rounded-lg transition-all hover:scale-110"
                    style={{
                      backgroundColor: color.value,
                      border:
                        newLabelColor === color.value
                          ? "2px solid rgba(107,78,175,0.80)"
                          : "1px solid rgba(196,181,232,0.55)",
                      boxShadow:
                        newLabelColor === color.value
                          ? "0 0 0 2px rgba(196,181,232,0.40)"
                          : "none",
                      transform:
                        newLabelColor === color.value ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                ))}
              </div>

              {/* Create button */}
              <button
                onClick={handleCreateLabel}
                disabled={!newLabelName.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                style={{
                  background: "rgba(172,148,220,0.70)",
                  border: "1px solid rgba(172,148,220,0.80)",
                  color: "#2D1B6B",
                  boxShadow: "0 4px 12px rgba(139,110,212,0.18)",
                }}
              >
                Create
              </button>
            </div>

            {/* Color preview */}
            {newLabelName.trim() && (
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-xs" style={{ color: "#7B6AAF" }}>Preview:</span>
                <span
                  className="px-3 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    background: `${newLabelColor}88`,
                    border: `1px solid ${newLabelColor}`,
                    color: "#3D2876",
                  }}
                >
                  {newLabelName}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}