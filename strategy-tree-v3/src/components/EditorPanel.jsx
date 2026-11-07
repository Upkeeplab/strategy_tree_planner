import React from "react";
import SuggestionEditor from "./SuggestionEditor";


export default function EditorPanel({
  text,
  setText
}) {
  return (
    <section className="editor-panel">
      <SuggestionEditor text={text} setText={setText}/>
    </section>
  );
}