const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      (body && typeof body === "object" && body.message) ||
      (typeof body === "string" && body) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

export const api = {
  register: (payload) =>
    request("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: () => request("/logout", { method: "POST" }),
  me: () => request("/me"),
  getTasks: () => request("/tasks"),
  addTask: ({ task, duedate, description }) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify({ task, duedate, description }),
    }),
  updateTask: ({ taskId, task, duedate, description }) =>
    request(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ task, duedate, description }),
    }),
  deleteTask: ({ taskId }) =>
    request(`/tasks/${taskId}`, {
      method: "DELETE",
    }),
};

