import React from "react";
import { renderText } from "../utils/render";

export default function PreviewPanel({text}) {

  return (
    <section className="preview-panel">
      <div id="preview"  
           dangerouslySetInnerHTML={{
          __html: renderText(text)
        }}
      />
    </section>
  );
}