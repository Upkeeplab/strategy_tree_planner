
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");

const example = `1 Build Sustainable AI Education Company

    [ASSUMPTION]
    AI demand continues growing

    [AND]

    1.1 Build Product

        [SEQ]
        - Research market
        - Build MVP
        - Test with users
        - Launch beta

    1.2 Build Audience

        [OR]
        - YouTube
        - Long-form articles
        - Partnerships

    1.3 Monetization

        [XOR]
        - Subscription
        - Enterprise licensing
        - Cohort courses

    DP1:
    If enterprise demand rises:
        → prioritize enterprise licensing

    [RISK]
    Large competitors may enter market
`;

function render() {
  const lines = editor.value.split("\n");

  let html = "";

  for (let line of lines) {
    let escaped = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    if (escaped.match(/^\s*\[COMPLETE\]/)) {
      escaped = `<span class="completed">${escaped}</span>`;
    }
    if (escaped.match(/^\s*\[BLOCKED\]/)) {
      escaped = `<span class="blocked">${escaped}</span>`;
    }

    if (escaped.match(/^\s*\[/)) {
      escaped = `<span class="logic">${escaped}</span>`;
    }

    if (escaped.match(/^\s*DP/)) {
      escaped = `<span class="special">${escaped}</span>`;
    }

    if (escaped.match(/^\s*\d/)) {
      escaped = `<span class="goal">${escaped}</span>`;
    }

    html += escaped + "\n";
  }

  preview.innerHTML = html;
}

editor.addEventListener("input", render);

document.getElementById("saveBtn").addEventListener("click", () => {
  localStorage.setItem("strategyTreeData", editor.value);
  alert("Saved locally.");
});

document.getElementById("loadBtn").addEventListener("click", () => {
  const data = localStorage.getItem("strategyTreeData");
  if (data) {
    editor.value = data;
    render();
  } else {
    alert("No saved data found.");
  }
});

document.getElementById("sampleBtn").addEventListener("click", () => {
  editor.value = "";
  render();
});

document.getElementById("exportBtn").addEventListener("click", () => {
  window.print();
});

document.getElementById("renderBtn").addEventListener("click", () => {
  // Save it to local storage
  localStorage.setItem("strategyTreeData", editor.value);

  // Open page.html
  window.open("pages/graph.html", "_blank");
});

editor.value = example;
render();
