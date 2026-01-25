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
      { label: "Overview", path: "deep-agents/index.html" },
      { label: "Quickstart", path: "deep-agents/quickstart.html" },
      { label: "Customization", path: "deep-agents/customization.html" },
      { label: "Agent Harness", path: "deep-agents/harness.html" },
      { label: "Backends", path: "deep-agents/backends.html" },
      { label: "Subagents", path: "deep-agents/subagents.html" },
      { label: "Human-in-the-Loop", path: "deep-agents/human-in-the-loop.html" },
      { label: "Long-term Memory", path: "deep-agents/memory.html" },
      { label: "Middleware", path: "deep-agents/middleware.html" },
      { label: "Skills", path: "deep-agents/skills.html" },
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

  navData.forEach((section, index) => {
    // Check if any item in this section is active
    let isSectionActive = false;
    section.items.forEach((item) => {
        if (currentPath.includes(item.path)) {
            isSectionActive = true;
        }
    });

    // Default state: collapsed unless active
    const collapsedClass = isSectionActive ? "" : "collapsed";
    const titleCollapsedClass = isSectionActive ? "" : "collapsed";

    html += `
            <div class="nav-section">
                <div class="nav-section-title ${titleCollapsedClass}" data-target="section-${index}">
                    ${section.title}
                </div>
                <div id="section-${index}" class="nav-items ${collapsedClass}">
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

    html += `   </div>
            </div>`;
  });

  html += `</div>`;
  sidebar.innerHTML = html;

  // Add click handlers for toggling
  const titles = sidebar.querySelectorAll(".nav-section-title");
  titles.forEach((title) => {
      title.addEventListener("click", () => {
          const targetId = title.getAttribute("data-target");
          const target = document.getElementById(targetId);
          
          // Toggle classes
          title.classList.toggle("collapsed");
          target.classList.toggle("collapsed");
      });
  });
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
