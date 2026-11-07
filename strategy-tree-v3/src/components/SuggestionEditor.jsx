import React, { useRef, useState } from "react";


export default function SuggestionEditor({
  text,
  setText
}) {

  const inputRef = useRef(null);
  const TAB = "\t";
  const format = (date) => date.toLocaleDateString();

  const today = format(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const triggers = {

    time: [
      "[NOW]",
      "[NEXT]",
      "[LATER]",
      "[FUTURE A]",
      "[FUTURE B]",
      "[FUTURE C]"
    ],

    status: [
      "[DRAFT]",
      "[ACTIVE]",
      "[BLOCKED]",
      "[COMPLETE]",
      "[ABANDONED]",
      "[POSTPONED]",
      "[AVAILABLE]"
    ],

    sym: ["→", "★"],
    today:[`: ${today}`],
    tomorrow:[`: ${format(tomorrow)}`],
    yesterday:[`: ${format(yesterday)}`],

    key:[
      "[AND]",
      "[OR]",
      "[XOR]",
      "[SEQ]",
      "[ASSUMPTION]",
      "[RISK]",
      "[CONSTRAINTS]",
      "DP",
      "[BRANCH]",
      "[Primary]",
      "[Secondary]"
    ],
    emoji:["🔥","⚠️","✅","❌","📌","🚀","⏳","💡","🔒"]
  };


  const [visible,setVisible] = useState(false);
  const [options,setOptions] = useState([]);
  const [activeIndex,setActiveIndex] = useState(0);
  const [trigger,setTrigger] = useState(null);
  const [startPos,setStartPos] = useState(null);

  function showBox(name,start){
    setTrigger(name);
    setOptions(triggers[name]);
    setActiveIndex(0);
    setStartPos(start);
    setVisible(true);
  }

  function hideBox(){
    setVisible(false);
    setTrigger(null);
    setActiveIndex(0);
  }

  function selectOption(value){
    const before = text.substring(0,startPos);
    const after = text.substring(startPos + trigger.length);
    const newText = before + value + after;
    setText(newText);

    // restore cursor
    setTimeout(()=>{
      const pos = before.length + value.length;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(pos,pos);
    },0);
    hideBox();
  }

  function handleChange(e){
    const value = e.target.value;
    setText(value);
    const cursor = e.target.selectionStart;

    for(const key in triggers){
      const len = key.length;
      const lastWord = value.slice(cursor-len,cursor);
      if(lastWord === key){
        showBox(key, cursor-len);
        return;
      }
    }
    hideBox();
  }

  function handleKeyDown(e){
    if(visible){
      if(e.key==="ArrowDown"){
        e.preventDefault();
        setActiveIndex(
          (activeIndex+1)%options.length
        );
      }
      if(e.key==="ArrowUp"){
        e.preventDefault();
        setActiveIndex(
          (activeIndex-1+options.length)
          %options.length
        );
      }
      if(e.key==="Enter"){
        e.preventDefault();
        selectOption(
          options[activeIndex]
        );
      }
      if(e.key==="Escape"){
        hideBox();
      }
    }
    // TAB handling
    if(e.key==="Tab"){
      e.preventDefault();
      if(visible){
        selectOption(options[activeIndex]);
        return;
      }
      const start = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;
      const newText = text.substring(0,start) + TAB+ text.substring(end);

      setText(newText);
      setTimeout(()=>{
        inputRef.current.selectionStart =
        inputRef.current.selectionEnd =
          start+1;

      },0);
    }
  }

  return (
    <div className="editor-wrapper">
      <textarea
        ref={inputRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck="false"
      />
      {
        visible && (
          <div id="suggestions">
            {
              options.map((item,index)=>(
                <div
                  key={item}
                  className={
                    "item " +
                    (
                      index===activeIndex
                      ? "active"
                      : ""
                    )
                  }
                  onClick={()=>selectOption(item)}
                >
                  {item}
                </div>
              ))
            }
          </div>)}
    </div>
  );
}