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
    title: "III. LangChain Framework",
    items: [
      { label: "Overview", path: "langchain/index.html" },
      { label: "Agents", path: "langchain/agents.html" },
      { label: "Models", path: "langchain/models.html" },
      { label: "Messages", path: "langchain/messages.html" },
      { label: "Tools", path: "langchain/tools.html" },
      { label: "Short-term Memory", path: "langchain/memory-short-term.html" },
      { label: "Streaming", path: "langchain/streaming.html" },
      { label: "Structured Output", path: "langchain/structured-output.html" },
      { label: "Middleware Overview", path: "langchain/middleware-overview.html" },
      { label: "Built-in Middleware", path: "langchain/middleware-builtin.html" },
      { label: "Custom Middleware", path: "langchain/middleware-custom.html" },
      { label: "Guardrails", path: "langchain/guardrails.html" },
      { label: "Runtime", path: "langchain/runtime.html" },
      { label: "Context Engineering", path: "langchain/context-engineering.html" },
      { label: "Model Context Protocol (MCP)", path: "langchain/mcp.html" },
      { label: "Human-in-the-Loop", path: "langchain/hitl.html" },
      { label: "Multi-agent", path: "langchain/multi-agent.html" },
      { label: "Retrieval", path: "langchain/retrieval.html" },
      { label: "Long-term Memory", path: "langchain/memory-long-term.html" },
      { label: "LangSmith Studio", path: "langchain/langsmith.html" },
    ],
  },
  {
    title: "IV. LangGraph State Machines",
    items: [
      { label: "State Machines & Nodes", path: "langgraph/state-machine.html" },
      { label: "Persistence & Memory", path: "langgraph/persistence.html" },
      { label: "Human-in-the-Loop", path: "langgraph/hitl.html" },
    ],
  },
  {
    title: "V. Multi-Agent Orchestration",
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
    title: "VI. Deep Agents",
    items: [
      { label: "Overview", path: "deep-agents/index.html" },
      { label: "Quickstart", path: "deep-agents/quickstart.html" },
      { label: "Customization", path: "deep-agents/customization.html" },
      { label: "Agent Harness", path: "deep-agents/harness.html" },
      { label: "Backends", path: "deep-agents/backends.html" },
      { label: "Subagents", path: "deep-agents/subagents.html" },
      {
        label: "Human-in-the-Loop",
        path: "deep-agents/human-in-the-loop.html",
      },
      { label: "Long-term Memory", path: "deep-agents/memory.html" },
      { label: "Middleware", path: "deep-agents/middleware.html" },
      { label: "Skills", path: "deep-agents/skills.html" },
    ],
  },
  {
    title: "VII. Evaluation & Security",
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
  // We'll trust the paths in navData are relative to the root.
  // We need to adjust them based on CURRENT page location.

  // Normalize path to handle spaces (%20)
  const normalizedPath = decodeURIComponent(currentPath);
  
  // Check if we are at the root (index.html or folder root)
  // we assume the root folder is named "Generative AI" now
  const isRoot =
    normalizedPath.endsWith("Generative AI/index.html") ||
    normalizedPath.endsWith("Generative AI/") ||
    normalizedPath.split("/").pop() === "index.html" && !navData.some(section => section.items.some(item => normalizedPath.endsWith(item.path))); 
    
  // Calculate depth based on known subdirectories in navData if possible, 
  // or simple heuristic based on "Generative AI/" split.
  // Since we moved everything up, we split by "Generative AI/"
  const parts = normalizedPath.split("Generative AI/");
  const relativePart = parts.length > 1 ? parts[1] : "";
  const depth = relativePart.split("/").length - 1;
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
