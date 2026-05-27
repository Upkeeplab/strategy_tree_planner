function safeTitle(title) {
  const t = (title ?? "").toString().trim();
  return t.length ? t : "(empty)";
}

function wrapText(text, maxLength = 12) {
  text = String(text ?? "").trim();
  if (!text) return "";

  let lines = [];
  for (let i = 0; i < text.length; i += maxLength) {
    lines.push(text.slice(i, i + maxLength));
  }
  return lines.join("<br/>");
}

function renderNode(node, nodeId) {
  switch (node.type) {

    case "relation":
      return renderRelationNode(node, nodeId);

    case "status":
      return renderStatusNode(node, nodeId);

    case "item":
      return renderItemNode(node, nodeId);

    default:
      return renderDefaultNode(node, nodeId);
  }
}
function renderDefaultNode(node, nodeId) {
  const status = node.status || "NONE";
  let color = "#000000";
  switch(status) {
    case "ACTIVE":
      color = "#81c784";
      break;
    case "BLOCKED":
      color = "#ef5350";
      break;
    case "COMPLETE":
      color = "#64b5f6";
      break;
  }
  const wrappedLabel = wrapText(node.title, 10);
  return `${nodeId} [
  shape=plain,
  label=<
    <table border="0"
           cellborder="1"
           cellspacing="0"
           cellpadding="4">
      <tr>
        <td bgcolor="#636356">
          <font color="white">
            <b>${safeTitle(node.title)}</b>
          </font>
        </td>
      </tr>
      <tr>
        <td align="left">
          Status: <font color="${color}">${status}</font>
        </td>
      </tr>
    </table>>];`;
}
function renderRelationNode(node, nodeId) {
  return `${nodeId} [
  shape=box,
  style="filled",
  fillcolor="#ffe082",
  label="${node.value}"
];`;
}
function renderStatusNode(node, nodeId) {

  let color = "#cccccc";
  switch(node.value) {

    case "ACTIVE":
      color = "#81c784";
      break;

    case "BLOCKED":
      color = "#ef5350";
      break;

    case "COMPLETE":
      color = "#64b5f6";
      break;
  }
  return `${nodeId} [
  shape=box,
  label=<
    <table border="0"
           cellborder="1"
           cellspacing="0"
           cellpadding="6"
           bgcolor="${color}">
      <tr>
        <td>
          <b>${node.title || "Status"}</b>
        </td>
      </tr>
      <tr>
        <td align="left">
          ${node.value}
        </td>
      </tr>
    </table> >];`;
}
function renderItemNode(node, nodeId) {
  const status = node.status || "NONE";
  const wrappedLabel = wrapText(node.title, 10);
  return `${nodeId} [
  shape=plain,
  label=<
    <table border="0"
           cellborder="1"
           cellspacing="0"
           cellpadding="4">
      <tr>
        <td bgcolor="#4a90e2">
          <font color="white">
            <b>${safeTitle(wrappedLabel)}</b>
          </font>
        </td>
      </tr>
      <tr>
        <td align="left">
          Status: ${status}
        </td>
      </tr>
    </table>>];`;
}

function jsonToDot(tree) {
  let dot = `
digraph G {
  rankdir=LR;
  node [shape=box
  width=2,
];
`
  let counter = 0;

  function walk(node, parentId = null) {
    const nodeId = `n${counter++}`;
    dot += renderNode(node, nodeId);
    if (parentId) {
      dot += `${parentId} -> ${nodeId};`;
    }
    if (node.children) {
      for (const child of node.children) {
        walk(child, nodeId);
      }
    }
  }
  walk(tree);
  dot += `}`;
  return dot;
}

// ----------- Parser -------------
const tagTypes = {

  AND: "relation",
  OR: "relation",
  XOR: "relation",
  SEQ: "relation",

  DRAFT: "status",
  ACTIVE: "status",
  BLOCKED: "status",
  COMPLETE: "status",

  RISK: "meta",
  ASSUMPTION: "meta"
};

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

  // loop all lines
  for (const rawLine of lines) {

    if (typeof rawLine !== "string") {
      continue;
    }

    const indentMatch = rawLine.match(/^\s*/);
    const indent = indentMatch
      ? indentMatch[0].length
      : 0;

    const line = rawLine.trim();

    if (!line) continue;
    let node = null;

    // Relation tags
    const relationMatch = line.match(/^\[(.*?)\]$/);
    // Detect status anywhere in line
    const statusMatch = line.match(/\[(COMPLETE|BLOCKED|DRAFT|ABANDONED|ACTIVE)\]/);
    const status = statusMatch
          ? statusMatch[1]
          : null;
    // Remove status tags from displayed text
    const cleanLine = line
      .replace(/\[(COMPLETE|BLOCKED|DRAFT|ABANDONED|ACTIVE)\]/g, "")
      .trim();

    if (relationMatch) {
      const tag = relationMatch[1].toUpperCase();
      const tagType = tagTypes[tag];
      node = {
        type: tagType || "tag",
        value: tag,
        children: []
      };
    }

    // Decision points
    else if (/^DP\d*/i.test(line)) {
      node = {
        type: "decision",
        title: line,
        children: []
      };
    }

    // CONDITIONS
    else if (/^if\s+/i.test(line)) {
      node = {
        type: "condition",
        title: line,
        children: []
      };
    }

    // ARROWS / ACTION CONSEQUENCES
    else if (/^→/.test(line)) {
      node = {
        type: "action",
        title: line.replace(/^→\s*/, ""),
        children: []
      };
    }

    // BULLET TASKS
    else if (/^- /.test(cleanLine)) {
      node = {
        type: "task",
        title: cleanLine.replace(/^- /, "").trim(),
        status,
        children: []
      };
    }

    // NUMBERED GOALS
    else {
      const match = cleanLine.match(/^(\S+)\s+(.*)$/);
      if (match) {
        node = {
          type: "item",
          id: match[1],
          title: match[2],
          status,
          children: []
        };
      }
      else {
          // fallback free-text node
          node = {
            type: "text",
            title: typeof line === "string" ? line : "",
            status,
            children: []
          };
        }
    }

    // FIND PARENT USING INDENTATION
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

// ----------- Rendering ----------
const viz = new Viz();
const text = localStorage.getItem("strategyTreeData");

function renderGraph() {

  const json_tree = parseStrategicText(text);
  console.log(JSON.stringify(json_tree, null, 2));
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
renderGraph();