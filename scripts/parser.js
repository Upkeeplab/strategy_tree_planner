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

    case "condition":
      return renderConditionNode(node, nodeId);

    case "meta":
      return renderMetaNode(node, nodeId);

    case "decision":
      return renderDecisionNode(node, nodeId);

    case "task":
      return renderTaskNode(node, nodeId);

    case "item":
      return renderItemNode(node, nodeId);

    default:
      return renderDefaultNode(node, nodeId);
  }
}
function renderDefaultNode(node, nodeId) {
  const status = node.status || " ";
  let color = "#000000";
  switch(status) {
    case "ACTIVE":
      color = "#0c9613";
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
  shape=box,
  style="filled",
  width = 2,
  fillcolor="#e3c2af",
  label=<${safeTitle(node.title)}<BR/>
  <font color="${color}">${status}</font>
  >];`;
}
function renderConditionNode(node, nodeId) {
  return `${nodeId} [
  shape=box,
  style="filled",
  fillcolor="#ffe082",
  label="${node.value}"
];`;
}
function renderMetaNode(node, nodeId) {
  return `${nodeId} [
  shape=box,
  style="filled",
  fillcolor="#97ff9e",
  label="${node.value}"
];`;
}
function renderDecisionNode(node, nodeId) {
  return `${nodeId} [
  shape=box,
  style="filled",
  fillcolor="#e297ff",
  label="${node.value}"
];`;
}
function renderTaskNode(node, nodeId) {
const wrappedLabel = wrapText(node.title, 10);
  const status = node.status || " ";
  let color = "#000000";
  switch(status) {
    case "ACTIVE":
      color = "#eeeb2b";
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
  style="filled",
  width = 2,
  fillcolor="#ff99a0",
  label=<${safeTitle(node.title)}<BR/>
  <font color="${color}">${status}</font>
  >];`;
}
function renderItemNode(node, nodeId) {
  const wrappedLabel = wrapText(node.title, 10);
  const status = node.status || " ";
  let color = "#000000";
  switch(status) {
    case "ACTIVE":
      color = "#eeeb2b";
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
  style="filled",
  width = 2,
  fillcolor="#afc7e3",
  label=<${safeTitle(node.title)}<BR/>
  <font color="${color}">${status}</font>
  >];`;
}

// ------------ JSON to DOT ------------------

function jsonToDot(tree) {
  let counter = 0;
  let dot = `
digraph G {
  bgcolor = "transparent"
  rankdir=${document.getElementById("directionToggle").checked ? "TB" : "LR"};
  graph [
  compound=true,
  newrank=true,
  nodesep=0.4,
  ranksep=0.8
];
  node [
    shape=box,
    width=2
  ];`;

  function walk(node, parentId = null) {
  
    const nodeId = `n${counter++}`;

    // case type is a relation
    if (node.type === "relation") {
      const clusterId = `cluster_${counter++}`;
      const deferred = [];
      dot += `subgraph ${clusterId} {
                label="${node.value}";
                style="filled";
                color="#e9e2e2ba";`;
      // Dealing with sequences
      if (node.value === "SEQ"){
        let prevChildId = null;
        let sequence = null;
        for (const child of node.children) {
          const childId = `n${counter++}`;
          dot += renderNode({ ...child, children: [] }, childId);
          if (prevChildId) {
            dot += `${prevChildId} -> ${childId}[dir=back];`;
            sequence = true;
          }
          prevChildId = childId;
          deferred.push({ child, childId , sequence});
        }
        sequence = null;
        dot += `}`;
      }
      else{
        for (const child of node.children) {
          const childId = `n${counter++}`;
          dot += renderNode({...child,children: []}, childId);
          deferred.push({child, childId});
          }
        dot += `}`;
      }

      for (const entry of deferred) {
        const {child, childId, sequence} = entry;
        if (parentId && !sequence) {
              dot += `${parentId} -> ${childId};`;
            }

        if (child.children) {
          for (const grandChild of child.children) {
            walk(grandChild,childId);
          }
        }
      }
      return;
    }
    
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

  for (const child of tree.children) {
  walk(child);
}
  dot += `}`;
  console.log(dot);
  return dot;
}

const tagTypes = {

  AND: "relation",
  OR: "relation",
  XOR: "relation",
  SEQ: "relation",

  DRAFT: "status",
  ACTIVE: "status",
  BLOCKED: "status",
  COMPLETE: "status",
  ABANDONED: "status",
  POSTPONED: "status",
  AVAILABLE: "status",

  RISK: "meta",
  ASSUMPTION: "meta",
  DP:"meta"
};

function parseStrategicText(text) {
  const lines = text
    .split("\n")
    .filter(line => line.trim().length > 0);

  const root = {
    type: "root",
    children: []
  };
  const stack = [
    {
      indent: -1,
      node: root
    }
  ];

  const activeRelations = {};

  for (const rawLine of lines) {

    if (typeof rawLine !== "string") {
      continue;
    }
    // finds indent number of line
    const indentMatch = rawLine.match(/^\s*/);
    const indent = indentMatch
        ? indentMatch[0].length
        : 0;
    const line = rawLine.trim();
    if (!line) continue;

    // Clear deeper active relations
    for (const key in activeRelations) {
      if (Number(key) > indent) {
        delete activeRelations[key];
      }
    }

    // Detect status
    const statusMatch =
      line.match(
        /\[(COMPLETE|BLOCKED|DRAFT|ABANDONED|ACTIVE|POSTPONED|AVAILABLE)\]/i);

    const status = statusMatch
        ? statusMatch[1].toUpperCase()
        : null;

    // Remove status tags from visible line
    const cleanLine = line
      .replace(/\[(COMPLETE|BLOCKED|DRAFT|ABANDONED|ACTIVE|POSTPONED|AVAILABLE)\]/gi,"")
      .trim();

    // Create node
    let node = null;

    // RELATION TAGS
    const relationMatch = cleanLine.match(/^\[(.*?)\]$/);

    if (relationMatch) {
      const tag = relationMatch[1].toUpperCase();
      const tagType = tagTypes[tag];
      node = {
        type: tagType || "tag",
        value: tag,
        children: []
      };

      // Register active relation
      if (tagType === "relation" || tagType === "meta") {
        activeRelations[indent] = node;
        console.log(node);
      }
    }

    // CONDITION 
    else if (/^if\s+/i.test(cleanLine)) {
      node = {
        type: "condition",
        title: cleanLine,
        status,
        children: []
      };
    }
    // Arrow dependecies
    else if (/^→/.test(cleanLine)) {
      //if number after arrow
      const match = cleanLine.match(/→\s*(\d+(\.\d+)*)/);
      const point_to = match
        ? match[1]
        : "";
      node = {
        type: "action",
        title: cleanLine.replace(/^→\s*/, ""),
        points_to: point_to,
        status,
        children: []
      };
    }
    // BULLET TASK
    else if (/^- /.test(cleanLine)) {
      node = {
        type: "task",
        title: cleanLine.replace(/^- /, "").trim(),
        status,
        children: []
      };
    }
    // NUMBERED ITEM
    else {
      const match = cleanLine.match(/^\s*(\d+(\.\d+)*)\s+(.*)$/);
      if (match) {
        node = {
          type: "item",
          id: match[1],
          title: match[3],
          status,
          children: []
        };
      }

      // FALLBACK FREE TEXT
      else {
        node = {
          type: "text",
          title: cleanLine,
          status,
          children: []
        };
      }
    }

    // Resolve indentation stack
    while (
      stack.length > 0 &&
      indent <= stack[stack.length - 1].indent
    ) {
      stack.pop();
    }

    // Default parent from indentation
    let parent = stack[stack.length - 1].node;

    // If active relation exists at this indent,
    // attach to relation instead
    if (activeRelations[indent] && node.type !== "relation" && node.type !== "meta") {
      parent =activeRelations[indent];
    }

    // Attach node
    parent.children.push(node);

    // Push onto stack
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