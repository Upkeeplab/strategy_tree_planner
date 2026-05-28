
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");

const example = `1 Build Sustainable AI Education Company
    [ASSUMPTION]
    AI demand continues growing

    [AND]

    1.1 Build Product

        [SEQ]
        - Research market [COMPLETE] : 01/01/2024
        - Build MVP [ACTIVE]
        - Test with users
        - Launch beta 

    1.2 Build Audience [DRAFT]

        [OR]
        - YouTube
        - Long-form articles
        - Partnerships [BLOCKED] : 02/10/1995

    1.3 Monetization

        [XOR]
        - Subscription
            [AND]
            - Example 1
            - Example 2
        - Enterprise licensing
        - Cohort courses

    1.4 MO
        1.4.1 MO2
            Text here.
        1.4.2 MO3
            Text here.

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

    // Highlight keywords anywhere in the line
    escaped = escaped.replace(
      /\[COMPLETE\]/g,
      '<span class="completed">[COMPLETE]</span>'
    );
    escaped = escaped.replace(
      /\[BLOCKED\]/g,
      '<span class="blocked">[BLOCKED]</span>'
    );
    escaped = escaped.replace(
      /\[DRAFT\]/g,
      '<span class="logic">[DRAFT]</span>'
    );
    escaped = escaped.replace(
      /\[POSTPONED\]/g,
      '<span class="logic">[POSTPONED]</span>'
    );
    escaped = escaped.replace(
      /\[ABANDONED\]/g,
      '<span class="blocked">[ABANDONED]</span>'
    );
    escaped = escaped.replace(
      /\[ACTIVE\]/g,
      '<span class="logic">[ACTIVE]</span>'
    );
    escaped = escaped.replace(
      /\[RISK\]/g,
      '<span class="special">[RISK]</span>'
    );

    // Line-wide styling rules
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
