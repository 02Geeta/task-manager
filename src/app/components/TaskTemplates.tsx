import { X, Star, Layers, Zap, FileText, Users, Megaphone, BarChart2 } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  tasks: {
    title: string;
    description: string;
    priority: string;
  }[];
  icon: string;
}

interface TaskTemplatesProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

// Icon map — replaces emojis
const ICON_MAP: Record<string, React.ReactNode> = {
  bug:       <Zap       className="w-5 h-5" />,
  feature:   <Layers    className="w-5 h-5" />,
  content:   <FileText  className="w-5 h-5" />,
  client:    <Users     className="w-5 h-5" />,
  marketing: <Megaphone className="w-5 h-5" />,
  sprint:    <BarChart2 className="w-5 h-5" />,
};

const ICON_GRADIENT: Record<string, string> = {
  bug:       "from-[rgba(233,168,168,0.55)] to-[rgba(220,120,120,0.35)]",
  feature:   "from-[rgba(196,181,232,0.55)] to-[rgba(172,148,220,0.35)]",
  content:   "from-[rgba(212,196,240,0.55)] to-[rgba(196,181,232,0.35)]",
  client:    "from-[rgba(168,220,196,0.55)] to-[rgba(120,190,152,0.35)]",
  marketing: "from-[rgba(252,220,144,0.55)] to-[rgba(240,180,80,0.35)]",
  sprint:    "from-[rgba(196,181,232,0.55)] to-[rgba(172,148,220,0.35)]",
};

const ICON_COLOR: Record<string, string> = {
  bug:       "#7A2020",
  feature:   "#3D2876",
  content:   "#4B3499",
  client:    "#1A5C3A",
  marketing: "#7A4A00",
  sprint:    "#3D2876",
};

const PRIORITY_STYLE: Record<string, React.CSSProperties> = {
  High:   { background: "rgba(233,168,168,0.45)", border: "1px solid rgba(220,120,120,0.45)", color: "#7A2020" },
  Medium: { background: "rgba(212,196,240,0.55)", border: "1px solid rgba(172,148,220,0.55)", color: "#3D2876" },
  Low:    { background: "rgba(168,220,196,0.45)", border: "1px solid rgba(120,190,152,0.45)", color: "#1A5C3A" },
};

export function TaskTemplates({ onSelectTemplate, onClose }: TaskTemplatesProps) {
  const templates: (Template & { iconKey: string })[] = [
    {
      id: "1",
      name: "Bug Fix Sprint",
      description: "Complete workflow for identifying, fixing, and deploying bug resolutions.",
      iconKey: "bug",
      icon: "bug",
      tasks: [
        { title: "Reproduce the issue",    description: "Document steps to reproduce",     priority: "High"   },
        { title: "Identify root cause",    description: "Debug and find the source",        priority: "High"   },
        { title: "Implement fix",          description: "Write and test the solution",       priority: "High"   },
        { title: "Code review",            description: "Get peer review",                  priority: "Medium" },
        { title: "Deploy to production",   description: "Deploy the fix",                   priority: "High"   },
      ],
    },
    {
      id: "2",
      name: "Feature Development",
      description: "End-to-end workflow for designing, building, and shipping a new feature.",
      iconKey: "feature",
      icon: "feature",
      tasks: [
        { title: "Requirements gathering",    description: "Define feature requirements", priority: "High"   },
        { title: "Design mockups",            description: "Create UI/UX designs",         priority: "Medium" },
        { title: "Backend implementation",    description: "Build API endpoints",          priority: "High"   },
        { title: "Frontend implementation",   description: "Build UI components",          priority: "High"   },
        { title: "Testing",                   description: "Write and run tests",           priority: "High"   },
        { title: "Documentation",             description: "Update docs",                  priority: "Medium" },
      ],
    },
    {
      id: "3",
      name: "Content Creation",
      description: "Structured workflow for researching, writing, editing, and publishing content.",
      iconKey: "content",
      icon: "content",
      tasks: [
        { title: "Research topic",    description: "Gather information and sources", priority: "Medium" },
        { title: "Create outline",    description: "Structure the content",          priority: "Medium" },
        { title: "Write first draft", description: "Complete initial write-up",      priority: "High"   },
        { title: "Edit and revise",   description: "Refine the content",             priority: "Medium" },
        { title: "Peer review",       description: "Get feedback",                   priority: "Low"    },
        { title: "Publish",           description: "Post the content",               priority: "High"   },
      ],
    },
    {
      id: "4",
      name: "Client Onboarding",
      description: "Step-by-step process for welcoming a new client and setting up their project.",
      iconKey: "client",
      icon: "client",
      tasks: [
        { title: "Welcome email",       description: "Send welcome and next steps",    priority: "High"   },
        { title: "Schedule kickoff",    description: "Set up initial meeting",          priority: "High"   },
        { title: "Gather requirements", description: "Collect project details",         priority: "High"   },
        { title: "Create project plan", description: "Draft timeline and milestones",   priority: "Medium" },
        { title: "Set up tool access",  description: "Provide system access",           priority: "Medium" },
      ],
    },
    {
      id: "5",
      name: "Marketing Campaign",
      description: "Systematic workflow for planning, launching, and optimising a campaign.",
      iconKey: "marketing",
      icon: "marketing",
      tasks: [
        { title: "Define campaign goals",     description: "Set objectives and KPIs",  priority: "High"   },
        { title: "Identify target audience",  description: "Define demographics",      priority: "High"   },
        { title: "Create content",            description: "Design ads and copy",      priority: "High"   },
        { title: "Set up tracking",           description: "Configure analytics",      priority: "Medium" },
        { title: "Launch campaign",           description: "Go live",                  priority: "High"   },
        { title: "Monitor and optimise",      description: "Track performance",        priority: "Medium" },
      ],
    },
    {
      id: "6",
      name: "Sprint Planning",
      description: "Agile sprint setup — from backlog review to daily standups.",
      iconKey: "sprint",
      icon: "sprint",
      tasks: [
        { title: "Review backlog",    description: "Prioritise items",         priority: "High"   },
        { title: "Define sprint goals", description: "Set sprint objectives",  priority: "High"   },
        { title: "Estimate tasks",    description: "Story pointing",           priority: "Medium" },
        { title: "Assign tasks",      description: "Distribute work",          priority: "High"   },
        { title: "Daily standups",    description: "Schedule check-ins",       priority: "Low"    },
      ],
    },
  ];

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
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "rgba(243,239,254,0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.80)",
          boxShadow: "0 16px 60px rgba(139,110,212,0.24), 0 2px 8px rgba(139,110,212,0.10)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(196,181,232,0.40)" }}
        >
          <div>
            <h2 className="text-base font-semibold" style={{ color: "#2D1B6B" }}>
              Task Templates
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#7B6AAF" }}>
              Start with a pre-built workflow and customise it for your team
            </p>
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

        {/* Template grid */}
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(196,181,232,0.40)",
                  boxShadow: "0 2px 8px rgba(139,110,212,0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(172,148,220,0.65)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(139,110,212,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(196,181,232,0.40)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(139,110,212,0.06)";
                }}
                onClick={() => onSelectTemplate(template)}
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${ICON_GRADIENT[template.iconKey]}`}
                    style={{
                      border: "1px solid rgba(196,181,232,0.45)",
                      color: ICON_COLOR[template.iconKey],
                    }}
                  >
                    {ICON_MAP[template.iconKey]}
                  </div>
                  <Star
                    className="w-4 h-4 transition-colors"
                    style={{ color: "rgba(196,181,232,0.70)" }}
                  />
                </div>

                {/* Name + description */}
                <h3 className="text-sm font-semibold mb-1" style={{ color: "#2D1B6B" }}>
                  {template.name}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "#7B6AAF" }}>
                  {template.description}
                </p>

                {/* Task preview */}
                <div className="space-y-1.5 mb-4">
                  {template.tasks.slice(0, 3).map((task, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg"
                      style={{
                        background: "rgba(243,239,254,0.60)",
                        border: "1px solid rgba(196,181,232,0.30)",
                      }}
                    >
                      <span className="text-xs truncate" style={{ color: "#4B3499" }}>
                        {task.title}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-md font-semibold flex-shrink-0"
                        style={PRIORITY_STYLE[task.priority] ?? PRIORITY_STYLE.Medium}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                  {template.tasks.length > 3 && (
                    <div
                      className="text-xs px-2.5 py-1 font-medium"
                      style={{ color: "#9B8ACA" }}
                    >
                      +{template.tasks.length - 3} more tasks
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: "#9B8ACA" }}>
                    {template.tasks.length} tasks
                  </span>
                  <button
                    className="text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all hover:scale-105"
                    style={{
                      background: "rgba(172,148,220,0.65)",
                      border: "1px solid rgba(172,148,220,0.78)",
                      color: "#2D1B6B",
                      boxShadow: "0 3px 10px rgba(139,110,212,0.16)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(template);
                    }}
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}