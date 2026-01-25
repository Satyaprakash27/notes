// Navigation Data Structure - Single Source of Truth
const navData = [
  {
    title: "Overview",
    items: [{ label: "Introduction", path: "index.html" }],
  },
  {
    title: "I. Core Reasoning",
    items: [
      { label: "Chain of Thought (CoT)", path: "core/cot.html" },
      { label: "Tree of Thoughts (ToT)", path: "core/tot.html" },
      { label: "Graph of Thoughts (GoT)", path: "core/got.html" },
      { label: "Buffer of Thoughts (BoT)", path: "core/bot.html" },
    ],
  },
  {
    title: "II. Agentic Patterns",
    items: [
      { label: "ReAct & Plan-Execute", path: "patterns/plan-execute.html" },
      {
        label: "Reflection & Self-Correction",
        path: "patterns/reflection.html",
      },
      { label: "Tool Use & Function Calling", path: "patterns/tool-use.html" },
    ],
  },
  {
    title: "III. LangGraph State Machines",
    items: [
      { label: "State Machines & Nodes", path: "langgraph/state-machine.html" },
      { label: "Persistence & Memory", path: "langgraph/persistence.html" },
      { label: "Human-in-the-Loop", path: "langgraph/hitl.html" },
    ],
  },
  {
    title: "IV. Multi-Agent Orchestration",
    items: [
      {
        label: "Network Architectures",
        path: "multi-agent/architectures.html",
      },
      {
        label: "Communication Protocols",
        path: "multi-agent/communication.html",
      },
    ],
  },
  {
    title: "V. Deep Agents",
    items: [
      { label: "Long-Horizon Reasoning", path: "deep-agents/reasoning.html" },
      { label: "Sandboxing & Resources", path: "deep-agents/sandboxing.html" },
    ],
  },
  {
    title: "VI. Evaluation & Security",
    items: [
      { label: "Agentic Evals", path: "evals/metrics.html" },
      { label: "Security & Red Teaming", path: "evals/security.html" },
    ],
  },
];

// Initialize Sidebar
function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const currentPath = window.location.pathname;

  // Determine relative path depth to handle links from subdirectories
  // If we count '/' segments after 'study-bible', we know how many '../' to add
  // Simple heuristic: if 'core/', 'patterns/' etc in path -> '../'

  // Better approach: We know where we are based on the script inclusion.
  // We'll trust the paths in navData are relative to the root 'study-bible/'.
  // We need to adjust them based on CURRENT page location.

  const isRoot =
    currentPath.endsWith("study-bible/index.html") ||
    currentPath.endsWith("study-bible/");
  const depth =
    currentPath.split("study-bible/")[1]?.split("/").length - 1 || 0;
  const prefix = depth > 0 ? "../".repeat(depth) : "";

  let html = `
        <div class="sidebar-header">
            <a href="${prefix}index.html" class="logo">
                GenAI & Agentic<br>Study Bible
            </a>
        </div>
        <div class="nav-container">
    `;

  navData.forEach((section) => {
    html += `
            <div class="nav-section">
                <div class="nav-section-title">${section.title}</div>
        `;

    section.items.forEach((item) => {
      // Check if active
      const itemAbsPath = item.path; // e.g. "core/cot.html"
      // Simple active check: strictly by filename match for now
      const isActive = currentPath.includes(item.path);

      const linkPath = prefix + item.path;

      html += `
                <a href="${linkPath}" class="nav-link ${isActive ? "active" : ""}">
                    ${item.label}
                </a>
            `;
    });

    html += `</div>`;
  });

  html += `</div>`;
  sidebar.innerHTML = html;
}

// Initialize Mermaid
function initMermaid() {
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "Inter",
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initMermaid();
});
