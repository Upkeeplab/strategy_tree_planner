import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { useAuth } from "../context/AuthContext";
import { createPlan, deletePlan, listPlans, updatePlan } from "../src/utils/plans";

export default function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState(null);

  const refresh = () => listPlans(user.id).then(setPlans);
  useEffect(() => { refresh(); }, [user.id]);

  async function newPlan() {
    const plan = await createPlan(user.id);
    navigate(`/plan/${plan.id}`);
  }

  async function rename(plan) {
    const title = window.prompt("Rename plan", plan.title);
    if (title && title.trim()) {
      await updatePlan(user.id, plan.id, { title: title.trim() });
      refresh();
    }
  }

  async function remove(plan) {
    if (window.confirm(`Delete "${plan.title}"? This cannot be undone.`)) {
      await deletePlan(user.id, plan.id);
      refresh();
    }
  }

  return (
    <>
      <Header />
      <div className="plans-page">
        <div className="plans-head">
          <h2>My plans</h2>
          <button type="button" className="btn-primary" onClick={newPlan}>New plan</button>
        </div>

        {plans === null ? null : plans.length === 0 ? (
          <p>No plans yet. Create one, or write on the home page as a guest and save it to this account.</p>
        ) : (
          <ul className="plan-list">
            {plans.map((p) => (
              <li key={p.id} className="plan-row">
                <button type="button" className="plan-open" onClick={() => navigate(`/plan/${p.id}`)}>
                  <strong>{p.title}</strong>
                  <small>Updated {new Date(p.updatedAt).toLocaleString()}</small>
                </button>
                <button type="button" onClick={() => rename(p)} title="Rename">
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button type="button" onClick={() => remove(p)} title="Delete">
                  <i className="fa-sharp fa-solid fa-trash-can"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
}
