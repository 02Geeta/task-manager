import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
}

interface FilterOptions {
  status?: string[];
  priority?: string[];
  assignedTo?: string[];
  dueDate?: string;
}

export function SearchFilter({ onSearch, onFilter }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilter({});
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  const checkboxStyle = (checked: boolean): React.CSSProperties => ({
    accentColor: "#6B4EAF",
  });

  const sectionLabelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    marginBottom: "8px",
    color: "#4B3499",
  };

  return (
    <div className="space-y-3">
      {/* Search bar row */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#8B6ED4" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tasks..."
            style={{
              width: "100%",
              paddingLeft: "36px",
              paddingRight: searchQuery ? "36px" : "14px",
              paddingTop: "9px",
              paddingBottom: "9px",
              borderRadius: "12px",
              border: "1px solid rgba(196,181,232,0.55)",
              background: "rgba(255,255,255,0.60)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              outline: "none",
              fontSize: "14px",
              color: "#2D1B6B",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(139,110,212,0.7)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196,181,232,0.28)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(196,181,232,0.55)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-all hover:scale-110"
              style={{ color: "#8B6ED4" }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter toggle button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
          style={
            showFilters || activeFilterCount > 0
              ? {
                  background: "rgba(172,148,220,0.70)",
                  border: "1px solid rgba(172,148,220,0.80)",
                  color: "#2D1B6B",
                  boxShadow: "0 4px 12px rgba(139,110,212,0.18)",
                }
              : {
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(196,181,232,0.55)",
                  color: "#6B4EAF",
                }
          }
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "rgba(255,255,255,0.75)",
                color: "#4B3499",
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{
            background: "rgba(243,239,254,0.82)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.75)",
            boxShadow: "0 4px 24px rgba(139,110,212,0.12)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: "#2D1B6B" }}>
              Filter by
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium transition-colors hover:underline"
                style={{ color: "#8B6ED4" }}
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Status */}
            <div>
              <label style={sectionLabelStyle}>Status</label>
              <div className="space-y-2">
                {["To Do", "In Progress", "Done"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(status) ?? false}
                      style={checkboxStyle(filters.status?.includes(status) ?? false)}
                      onChange={(e) => {
                        const current = filters.status || [];
                        const next = e.target.checked
                          ? [...current, status]
                          : current.filter((s) => s !== status);
                        handleFilterChange("status", next);
                      }}
                      className="rounded"
                    />
                    <span className="text-xs font-medium" style={{ color: "#4B3499" }}>
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label style={sectionLabelStyle}>Priority</label>
              <div className="space-y-2">
                {["High", "Medium", "Low"].map((priority) => (
                  <label
                    key={priority}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.priority?.includes(priority) ?? false}
                      style={checkboxStyle(filters.priority?.includes(priority) ?? false)}
                      onChange={(e) => {
                        const current = filters.priority || [];
                        const next = e.target.checked
                          ? [...current, priority]
                          : current.filter((p) => p !== priority);
                        handleFilterChange("priority", next);
                      }}
                      className="rounded"
                    />
                    <span className="text-xs font-medium" style={{ color: "#4B3499" }}>
                      {priority}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label style={sectionLabelStyle}>Due Date</label>
              <select
                value={filters.dueDate || ""}
                onChange={(e) => handleFilterChange("dueDate", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(196,181,232,0.5)",
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  outline: "none",
                  fontSize: "13px",
                  color: "#3D2876",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(139,110,212,0.7)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196,181,232,0.28)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(196,181,232,0.5)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">All</option>
                <option value="today">Due Today</option>
                <option value="this-week">Due This Week</option>
                <option value="overdue">Overdue</option>
                <option value="no-date">No Due Date</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}