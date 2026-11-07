// Local account service. Swap the bodies for fetch() calls when you add a backend;
// keep the function signatures and the rest of the app won't change.
const USERS_KEY = "stp:users";
const SESSION_KEY = "stp:session";

const enc = new TextEncoder();
const toHex = (buf) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const fromHex = (hex) =>
  new Uint8Array(hex.match(/.{2}/g).map((h) => parseInt(h, 16)));

async function hashPassword(password, saltHex) {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: fromHex(saltHex), iterations: 150000, hash: "SHA-256" },
    key, 256
  );
  return toHex(bits);
}

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
  catch { return {}; }
}
const writeUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));
const publicUser = (u) => ({ id: u.id, username: u.username });

export async function register(username, password) {
  username = username.trim();
  if (username.length < 3) throw new Error("Username must be at least 3 characters.");
  if (password.length < 6) throw new Error("Password must be at least 6 characters.");

  const users = readUsers();
  const key = username.toLowerCase();
  if (users[key]) throw new Error("That username is already taken.");

  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const user = {
    id: crypto.randomUUID(),
    username,
    salt,
    hash: await hashPassword(password, salt),
    createdAt: Date.now(),
  };
  users[key] = user;
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, user.id);
  return publicUser(user);
}

export async function login(username, password) {
  const user = readUsers()[username.trim().toLowerCase()];
  const fail = new Error("Wrong username or password.");
  if (!user) throw fail;
  if ((await hashPassword(password, user.salt)) !== user.hash) throw fail;
  localStorage.setItem(SESSION_KEY, user.id);
  return publicUser(user);
}

export async function getSessionUser() {
  const id = localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const user = Object.values(readUsers()).find((u) => u.id === id);
  return user ? publicUser(user) : null;
}

export async function logout() {
  localStorage.removeItem(SESSION_KEY);
}
