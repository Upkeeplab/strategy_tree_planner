import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Header from "../src/components/Header";
import UnderHeader from "../src/components/UnderHeader";
import EditorPanel from "../src/components/EditorPanel";
import PreviewPanel from "../src/components/PreviewPanel";
import Footer from "../src/components/Footer";
import { useAuth } from "../context/AuthContext";
import { createPlan, getPlan, updatePlan } from "../src/utils/plans";

const GUEST_KEY = "stp:guest-draft";
const DEFAULT_TITLE = "Untitled plan";

export default function Editor() {
  const { planId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [text, setText] = useState("");
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [saved, setSaved] = useState({ text: "", title: DEFAULT_TITLE });
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");

  const flash = (msg) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), 2500);
  };

  // Load: saved plan from the account, or the guest draft on "/"
  useEffect(() => {
    let cancelled = false;
    setReady(false);

    if (planId && user) {
      getPlan(user.id, planId).then((plan) => {
        if (cancelled) return;
        if (!plan) return navigate("/plans", { replace: true });
        setText(plan.text);
        setTitle(plan.title);
        setSaved({ text: plan.text, title: plan.title });
        setReady(true);
      });
    } else {
      let draft = "";
      try { draft = localStorage.getItem(GUEST_KEY) || ""; } catch {}
      setText(draft);
      setTitle(DEFAULT_TITLE);
      setSaved({ text: "", title: DEFAULT_TITLE });
      setReady(true);
    }
    return () => { cancelled = true; };
  }, [planId, user, navigate]);

  // Guests: keep the draft so it survives the trip to the login page
  useEffect(() => {
    if (!ready || planId) return;
    try { localStorage.setItem(GUEST_KEY, text); } catch {}
  }, [text, ready, planId]);

  const dirty = ready && (text !== saved.text || title !== saved.title);

  const save = useCallback(async () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    try {
      if (planId) {
        await updatePlan(user.id, planId, { text, title });
        setSaved({ text, title });
        flash("Saved");
      } else {
        const plan = await createPlan(user.id, { text, title });
        try { localStorage.removeItem(GUEST_KEY); } catch {}
        navigate(`/plan/${plan.id}`, { replace: true });
      }
    } catch (err) {
      flash(err.message || "Could not save");
    }
  }, [user, planId, text, title, navigate, location]);

  // Ctrl/Cmd+S
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  // Warn before closing with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function handleExport() {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.trim() || "strategy-plan"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(content, filename) {
    if (text && !window.confirm("Replace the current text with the loaded file?")) return;
    setText(content);
    if (title === DEFAULT_TITLE) setTitle(filename.replace(/\.[^.]+$/, ""));
  }

  function handleClear() {
    if (window.confirm("Clear the editor? Saved versions are not affected.")) setText("");
  }

  if (!ready) return null;

  return (
    <>
      <Header />
      <UnderHeader
        title={title}
        setTitle={setTitle}
        dirty={dirty}
        status={status}
        onSave={save}
        onImport={handleImport}
        onExport={handleExport}
        onPrint={() => window.print()}
        onClear={handleClear}
        onGraph={() => flash("Graph view is not built yet")}
      />
      <main>
        <EditorPanel text={text} setText={setText} />
        <PreviewPanel text={text} />
      </main>
      <Footer />
    </>
  );
}
