
import React, { useRef, useState, useLayoutEffect } from "react";

export default function SuggestionEditor({ text, setText }) {
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);
  const cursorRef = useRef(null);

  const TAB = "\t";

  const format = (date) => date.toLocaleDateString();

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const triggers = {
    time: [
      "[NOW]", "[NEXT]", "[LATER]",
      "[FUTURE A]", "[FUTURE B]", "[FUTURE C]"
    ],
    status: [
      "[DRAFT]", "[ACTIVE]", "[BLOCKED]",
      "[COMPLETE]", "[ABANDONED]",
      "[POSTPONED]", "[AVAILABLE]"
    ],
    sym: ["→", "★"],
    today: [`: ${format(today)}`],
    tomorrow: [`: ${format(tomorrow)}`],
    yesterday: [`: ${format(yesterday)}`],
    key: [
      "[AND]", "[OR]", "[XOR]", "[SEQ]",
      "[ASSUMPTION]", "[RISK]", "[CONSTRAINTS]",
      "DP", "[BRANCH]", "[Primary]", "[Secondary]"
    ],
    emoji: ["🔥", "⚠️", "✅", "❌", "📌", "🚀", "⏳", "💡", "🔒"]
  };

  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [trigger, setTrigger] = useState(null);
  const [startPos, setStartPos] = useState(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0
  });

  function getCaretPosition() {
    const input = inputRef.current;
    if (!input) return;

    const rect = input.getBoundingClientRect();

    // Approximate caret position using text measurement.
    const before = input.value.substring(
      0,
      input.selectionStart
    );

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const style = window.getComputedStyle(input);
    context.font = style.font;

    const lines = before.split("\n");
    const currentLine = lines[lines.length - 1];

    const lineHeight = parseFloat(style.lineHeight) || 22;
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingTop = parseFloat(style.paddingTop) || 0;

    const textWidth = context.measureText(currentLine).width;

    setPosition({
      top: Math.min(
        input.scrollTop +
          paddingTop +
          (lines.length - 1) * lineHeight + 24,
        input.scrollTop + input.clientHeight - 40
      ),
      left: Math.min(
        paddingLeft + textWidth,
        input.clientWidth - 210
      )
    });
  }

  function showBox(name, start) {
    setTrigger(name);
    setOptions(triggers[name]);
    setActiveIndex(-1);
    setStartPos(start);
    setVisible(true);

    requestAnimationFrame(getCaretPosition);
  }

  function hideBox() {
    setVisible(false);
    setTrigger(null);
    setActiveIndex(-1);
    setStartPos(null);
  }

  function restoreCursor(position) {
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;

      input.focus();
      input.setSelectionRange(position, position);
    });
  }

  function selectOption(value) {
    if (!trigger || startPos === null) return;

    const before = text.substring(0, startPos);
    const after = text.substring(startPos + trigger.length);

    const newText = before + value + after;
    const cursor = before.length + value.length;

    cursorRef.current = cursor;

    setText(newText);
    hideBox();
    restoreCursor(cursor);
  }

  function handleChange(e) {
    const value = e.target.value;
    const cursor = e.target.selectionStart;

    setText(value);

    for (const key of Object.keys(triggers)) {
      const start = cursor - key.length;

      if (start >= 0 && value.slice(start, cursor) === key) {
        showBox(key, start);
        return;
      }
    }

    hideBox();
  }

  function handleKeyDown(e) {
    if (e.nativeEvent.isComposing) return;

    if (visible) {
      if (e.key === "ArrowDown") {
        e.preventDefault();

        setActiveIndex((current) =>
          (current + 1) % options.length
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();

        setActiveIndex((current) =>
          current <= 0 ? options.length - 1 : current - 1
        );
        return;
      }

      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();

        const index = activeIndex < 0 ? 0 : activeIndex;
        selectOption(options[index]);
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        hideBox();
        return;
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();

      const input = inputRef.current;
      if (!input) return;

      const start = input.selectionStart;
      const end = input.selectionEnd;

      const newText =
        text.substring(0, start) +
        TAB +
        text.substring(end);

      setText(newText);
      restoreCursor(start + 1);
    }
  }

  useLayoutEffect(() => {
    if (cursorRef.current !== null && inputRef.current) {
      const pos = cursorRef.current;
      inputRef.current.setSelectionRange(pos, pos);
      cursorRef.current = null;
    }
  }, [text]);

  return (
    <div className="editor-wrapper">
      <textarea
        ref={inputRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        onScroll={() => visible && getCaretPosition()}
      />

      {visible && (
        <div
          id="suggestions"
          ref={suggestionRef}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            zIndex: 100
          }}
        >
          {options.map((item, index) => (
            <div
              key={item}
              className={
                "item " +
                (index === activeIndex ? "active" : "")
              }
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(item);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
