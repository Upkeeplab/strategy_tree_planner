const input = document.getElementById("editor");
const box = document.getElementById("suggestions");
const TAB = "  "; 

const format = (date) => date.toLocaleDateString();
const today = format(new Date());

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);


// define triggers + options here
const triggers = {
  time: ["[NOW]", "[NEXT]", "[LATER]", "[FUTURE A]","[FUTURE B]","[FUTURE C]"],
  status: ["[DRAFT]","[ACTIVE]","[BLOCKED]","[COMPLETE]","[ABANDONED]"],
  sym: ["→","★"],
  today:[`: ${today}`],
  tomorrow: [`: ${format(tomorrow)}`],
  yesterday:[`: ${format(yesterday)}`],
  key: ["[AND]", "[OR]", "[XOR]","[SEQ]",
        "[ASSUMPTION]", "[RISK]", "[CONSTRAINTS]",
        "DP","[BRANCH]",
        "[Primary]", "[Secondary]"
  ]
};

let activeIndex = -1;
let startPos = null;
let currentOptions = [];
let currentTrigger = null;

// render dropdown
function renderSuggestions() {
  box.innerHTML = "";

  currentOptions.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "item" + (i === activeIndex ? " active" : "");
    div.textContent = opt;

    div.addEventListener("click", () => selectOption(opt));

    box.appendChild(div);
  });
}

// position near cursor
function showAtCaret() {
  const caret = getCaretCoordinates(input, input.selectionStart);
  const rect = input.getBoundingClientRect();

  box.style.left = rect.left + window.scrollX + caret.left + "px";
  box.style.top = rect.top + window.scrollY + caret.top + 20 + "px";

  box.style.display = "block";
}

// show dropdown
function showBox(trigger) {
  currentTrigger = trigger;
  currentOptions = triggers[trigger];

  activeIndex = 0;

  renderSuggestions();
  showAtCaret();
}

// hide dropdown
function hideBox() {
  box.style.display = "none";
  activeIndex = -1;
  currentTrigger = null;
}

// replace trigger word with selected option
function selectOption(value) {
  const text = input.value;

  const before = text.substring(0, startPos);
  const after = text.substring(startPos + currentTrigger.length);

  const newValue = before + value + after;

  // calculate new cursor position
  const newCursorPos = before.length + value.length;

  input.value = newValue;

  // restore cursor position (this is the fix)
  input.setSelectionRange(newCursorPos, newCursorPos);
  input.focus();

  hideBox();
}

// detect triggers dynamically
input.addEventListener("input", () => {
  const cursor = input.selectionStart;
  const text = input.value;

  // check all triggers
  for (const key in triggers) {
    const len = key.length;
    const lastWord = text.slice(cursor - len, cursor);

    if (lastWord === key) {
      startPos = cursor - len;
      showBox(key);
      return;
    }
  }

  hideBox();
});

// keyboard control
input.addEventListener("keydown", (e) => {
  if (box.style.display === "block") {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % currentOptions.length;
      renderSuggestions();
      showAtCaret();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex =
        (activeIndex - 1 + currentOptions.length) %
        currentOptions.length;

      renderSuggestions();
      showAtCaret();
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        selectOption(currentOptions[activeIndex]);
      }
    }

    if (e.key === "Escape") {
      hideBox();
    }
  }
});

// keep aligned while typing
input.addEventListener("keyup", () => {
  if (box.style.display === "block") {
    showAtCaret();
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    if (box.style.display === "block" && activeIndex >= 0) {
      e.preventDefault();
      selectOption(currentOptions[activeIndex]);
      return;
    }
    e.preventDefault();

    const start = input.selectionStart;
    const end = input.selectionEnd;

    // insert tab character
    const value = input.value;

    input.value =
      value.substring(0, start) +
      "\t" +
      value.substring(end);

    // move cursor after tab
    input.selectionStart = input.selectionEnd = start + 1;
  }
});