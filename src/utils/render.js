export function renderText(text) {

  const lines = text.split("\n");

  let html = "";


  for (let line of lines) {


    let escaped = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");



    escaped = escaped.replace(
      /\[COMPLETE\]/g,
      '<span class="completed">[COMPLETE]</span>'
    );


    escaped = escaped.replace(
      /\[AVAILABLE\]/g,
      '<span class="completed">[AVAILABLE]</span>'
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



    if (/^\s*\[/.test(escaped)) {
      escaped =
        `<span class="logic">${escaped}</span>`;
    }


    if (/^\s*DP/.test(escaped)) {
      escaped =
        `<span class="special">${escaped}</span>`;
    }


    if (/^\s*\d/.test(escaped)) {
      escaped =
        `<span class="goal">${escaped}</span>`;
    }



    html += escaped + "\n";

  }


  return html;

}