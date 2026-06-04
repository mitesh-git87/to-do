import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { Button, Field, Input, TextArea } from "../components/Field.jsx";
import { Shell } from "../components/Shell.jsx";

function normalizeTasksPayload(payload) {
  const doc = payload?.data;
  if (!doc) return { tasks: [] };
  return { tasks: Array.isArray(doc.tasks) ? doc.tasks : [] };
}

export function TasksPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const [newTask, setNewTask] = useState({ task: "", duedate: "", description: "" });
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(null); // { _id, task, duedate, description }
  const [editPending, setEditPending] = useState(false);

  const sortedTasks = useMemo(() => {
    return [...tasks].reverse();
  }, [tasks]);

  async function refresh() {
    setError("");
    try {
      const payload = await api.getTasks();
      const normalized = normalizeTasksPayload(payload);
      setTasks(normalized.tasks);
    } catch (err) {
      if (err?.status === 401) {
        navigate("/login");
        return;
      }
      if (err?.status === 404) {
        setDocumentId(null);
        setTasks([]);
        return;
      }
      setError(err?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addTask(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.addTask({
        task: newTask.task.trim(),
        duedate: newTask.duedate.trim(),
        description: newTask.description.trim(),
      });
      setNewTask({ task: "", duedate: "", description: "" });
      await refresh();
    } catch (err) {
      if (err?.status === 401) navigate("/login");
      else setError(err?.message || "Failed to add task");
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit() {
    if (!editing?._id) return;
    setEditPending(true);
    setError("");
    try {
      await api.updateTask({
        taskId: editing._id,
        task: editing.task?.trim(),
        duedate: editing.duedate?.trim(),
        description: editing.description?.trim(),
      });
      setEditing(null);
      await refresh();
    } catch (err) {
      if (err?.status === 401) navigate("/login");
      else setError(err?.message || "Failed to update task");
    } finally {
      setEditPending(false);
    }
  }

  async function removeTask(taskId) {
    setError("");
    try {
      await api.deleteTask({ taskId });
      await refresh();
    } catch (err) {
      if (err?.status === 401) navigate("/login");
      else setError(err?.message || "Failed to delete task");
    }
  }

  return (
    <Shell
      title="Your tasks"
      subtitle="Create tasks, edit details, and your session stays signed in via cookie."
      footer={
        <>
          If you’re logged out,{" "}
          <Link to="/login" className="text-fuchsia-200 hover:text-fuchsia-100">
            login again
          </Link>
          .
        </>
      }
    >
      <div className="grid gap-6">
        {error ? (
          <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <form onSubmit={addTask} className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Task" hint="Required">
              <Input
                value={newTask.task}
                onChange={(e) => setNewTask((s) => ({ ...s, task: e.target.value }))}
                placeholder="Finish frontend"
              />
            </Field>
            <Field label="Due date" hint="Optional">
              <Input
                value={newTask.duedate}
                onChange={(e) => setNewTask((s) => ({ ...s, duedate: e.target.value }))}
                placeholder="2026-05-30"
              />
            </Field>
          </div>
          <Field label="Description" hint="Optional">
            <TextArea
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask((s) => ({ ...s, description: e.target.value }))}
              placeholder="Add notes here..."
            />
          </Field>
          <div className="flex items-center justify-end gap-3">
            <Button type="submit" disabled={saving || !newTask.task.trim()}>
              {saving ? "Adding..." : "Add task"}
            </Button>
          </div>
        </form>

        <section className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">List</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={async () => {
                  try {
                    await api.logout();
                  } finally {
                    navigate("/login");
                  }
                }}
              >
                Logout
              </Button>
              <Button variant="ghost" onClick={refresh} disabled={loading}>
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              Loading tasks...
            </div>
          ) : sortedTasks.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              No tasks yet. Add your first one above.
            </div>
          ) : (
            <div className="grid gap-3">
              {sortedTasks.map((t) => (
                <div
                  key={t._id || `${t.task}-${t.duedate}-${t.description}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <div className="text-base font-semibold text-slate-50">{t.task}</div>
                        {t.duedate ? (
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                            Due: {t.duedate}
                          </span>
                        ) : null}
                      </div>
                      {t.description ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{t.description}</p>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setEditing({
                            _id: t._id,
                            task: t.task || "",
                            duedate: t.duedate || "",
                            description: t.description || "",
                          })
                        }
                      >
                        Edit
                      </Button>
                      {t._id ? (
                        <Button variant="danger" onClick={() => removeTask(t._id)}>
                          Delete
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-slate-50">Edit task</div>
                <div className="text-sm text-slate-400">Update fields and save.</div>
              </div>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Close
              </Button>
            </div>

            <div className="mt-4 grid gap-4">
              <Field label="Task">
                <Input value={editing.task} onChange={(e) => setEditing((s) => ({ ...s, task: e.target.value }))} />
              </Field>
              <Field label="Due date">
                <Input
                  value={editing.duedate}
                  onChange={(e) => setEditing((s) => ({ ...s, duedate: e.target.value }))}
                />
              </Field>
              <Field label="Description">
                <TextArea
                  rows={4}
                  value={editing.description}
                  onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))}
                />
              </Field>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button variant="ghost" onClick={() => setEditing(null)} disabled={editPending}>
                  Cancel
                </Button>
                <Button onClick={saveEdit} disabled={editPending || !editing.task.trim()}>
                  {editPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Shell>
  );
}

