// Per-account plan storage. Same idea: async API so a backend can replace it.
const key = (uid) => `stp:plans:${uid}`;

function read(uid) {
  try { return JSON.parse(localStorage.getItem(key(uid))) || []; }
  catch { return []; }
}
const write = (uid, plans) => localStorage.setItem(key(uid), JSON.stringify(plans));

export async function listPlans(uid) {
  return read(uid).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getPlan(uid, id) {
  return read(uid).find((p) => p.id === id) || null;
}

export async function createPlan(uid, { title = "Untitled plan", text = "" } = {}) {
  const now = Date.now();
  const plan = { id: crypto.randomUUID(), title, text, createdAt: now, updatedAt: now };
  write(uid, [...read(uid), plan]);
  return plan;
}

export async function updatePlan(uid, id, patch) {
  let updated = null;
  const plans = read(uid).map((p) => {
    if (p.id !== id) return p;
    updated = { ...p, ...patch, updatedAt: Date.now() };
    return updated;
  });
  if (!updated) throw new Error("Plan not found.");
  write(uid, plans);
  return updated;
}

export async function deletePlan(uid, id) {
  write(uid, read(uid).filter((p) => p.id !== id));
}
