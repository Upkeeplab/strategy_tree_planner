import React, { useRef } from "react";
import { Link } from "react-router-dom";
import TooltipButton from "./TooltipButton";

export default function UnderHeader({
  title,
  setTitle,
  dirty,
  status,
  onSave,
  onImport,
  onExport,
  onPrint,
  onClear,
  onGraph,
}) {
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    onImport(await file.text(), file.name);
    e.target.value = ""; // allow re-importing the same file
  }

  return (
    <div className="underheader">
      {/* Input section */}
      <div className="key-info" style={{ borderRight: "1px solid var(--accent)" }}>
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Plan title"
          maxLength={80}
        />
        {dirty && <span title="Unsaved changes">●</span>}
        <div className="right">
          shortcuts:
          <span className="highlight"> key </span>
          <span className="highlight"> status </span>
          <span className="highlight"> today </span>
        </div>
        <Link to="/guide#keyboard-shortcuts" style={{ fontSize: "15px" }}>
          <i className="fa-solid fa-arrow-up-right-from-square"></i> for more
        </Link>
      </div>

      {/* Output section */}
      <div className="key-info">
        <b>Output</b>
        {status && <span className="status-msg">{status}</span>}
        <div className="right">
          <TooltipButton icon="fa-solid fa-diagram-project" text="Generate graph" onClick={onGraph} />
          <TooltipButton icon="fa-sharp fa-solid fa-floppy-disk" text="Save to my plans (Ctrl+S)" onClick={onSave} />
          <TooltipButton icon="fa-sharp fa-solid fa-file-import" text="Load file" onClick={() => fileRef.current.click()} />
          <TooltipButton icon="fa-sharp fa fa-download" text="Export .txt" onClick={onExport} />
          <TooltipButton icon="fa-solid fa-file-pdf" text="Export PDF" onClick={onPrint} />
          <TooltipButton icon="fa-sharp fa-solid fa-trash-can" text="Clear editor" onClick={onClear} />
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,text/plain"
            onChange={handleFile}
            hidden
          />
        </div>
      </div>
    </div>
  );
}
