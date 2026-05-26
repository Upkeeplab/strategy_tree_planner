function jsonToDot(tree) {

  let dot = `
digraph G {
  rankdir=TB;
  node [shape=box];
`;

  let counter = 0;

  function walk(node, parentId = null) {

    const nodeId = `n${counter++}`;

    let label = "";

    if (node.type === "relation") {
      label = node.relation;
    }
    else if (node.title) {
      label = node.title;
    }
    else {
      label = node.type;
    }

    dot += `
${nodeId} [label="${label}"];
`;

    if (parentId) {
      dot += `
${parentId} -> ${nodeId};
`;
    }

    if (node.children) {
      for (const child of node.children) {
        walk(child, nodeId);
      }
    }
  }

  walk(tree);

  dot += `
}
`;

  return dot;
}

// ----------- Parser -------------

function parseStrategicText(text) {

  // Split lines and remove fully empty ones
  const lines = text
    .split("\n")
    .filter(line => line.trim().length > 0);

  // Root node
  const root = {
    type: "root",
    children: []
  };

  // Stack for hierarchy tracking
  const stack = [
    {
      indent: -1,
      node: root
    }
  ];

  // Walk all lines
  for (const rawLine of lines) {

    // ---------- SAFETY ----------

    if (typeof rawLine !== "string") {
      continue;
    }

    // ---------- INDENT ----------

    const indentMatch = rawLine.match(/^\s*/);

    const indent = indentMatch
      ? indentMatch[0].length
      : 0;

    // ---------- CLEAN LINE ----------

    const line = rawLine.trim();

    if (!line) continue;

    let node = null;

    // ==================================================
    // RELATION TAGS
    // ==================================================

    const relationMatch = line.match(/^\[(.*?)\]$/);

    if (relationMatch) {

      node = {
        type: "relation",
        relation: relationMatch[1],
        children: []
      };
    }

    // ==================================================
    // DECISION POINTS
    // ==================================================

    else if (/^DP\d*/i.test(line)) {

      node = {
        type: "decision",
        title: line,
        children: []
      };
    }

    // ==================================================
    // CONDITIONS
    // ==================================================

    else if (/^if\s+/i.test(line)) {

      node = {
        type: "condition",
        title: line,
        children: []
      };
    }

    // ==================================================
    // ARROWS / ACTION CONSEQUENCES
    // ==================================================

    else if (/^→/.test(line)) {

      node = {
        type: "action",
        title: line.replace(/^→\s*/, ""),
        children: []
      };
    }

    // ==================================================
    // BULLET TASKS
    // ==================================================

    else if (/^- /.test(line)) {

      node = {
        type: "task",
        title: line.replace(/^- /, ""),
        children: []
      };
    }

    // ==================================================
    // NUMBERED GOALS
    // ==================================================

    else {

      const match = line.match(/^(\S+)\s+(.*)$/);

      if (match) {

        node = {
          type: "item",
          id: match[1],
          title: match[2],
          children: []
        };
      }

      else {

        // fallback free-text node

        node = {
          type: "text",
          title: line,
          children: []
        };
      }
    }

    // ==================================================
    // FIND PARENT USING INDENTATION
    // ==================================================

    while (
      stack.length > 0 &&
      indent <= stack[stack.length - 1].indent
    ) {
      stack.pop();
    }

    // Parent node
    const parent = stack[stack.length - 1].node;

    // Attach child
    parent.children.push(node);

    // Push current node
    stack.push({
      indent,
      node
    });
  }

  return root;
}

//console.log(JSON.stringify(tree, null, 2));

// ----------- Rendering ----------

const viz = new Viz();
const text = localStorage.getItem("strategyTreeData");

function renderGraph() {

  const json_tree = parseStrategicText(text);
  const dot = jsonToDot(json_tree);

  viz.renderSVGElement(dot)
    .then(svg => {
      const graph = document.getElementById("graph");
      graph.innerHTML = "";
      graph.appendChild(svg);
    })
    .catch(error => {
      console.error(error);
    });
}

// General 

//document.getElementById("renderBtn")
//        .addEventListener("click", renderGraph);
renderGraph();