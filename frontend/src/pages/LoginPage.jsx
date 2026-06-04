import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { Button, Field, Input } from "../components/Field.jsx";
import { Shell } from "../components/Shell.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    const hasIdentity = form.username.trim() || form.email.trim();
    return Boolean(hasIdentity && form.password.trim());
  }, [form]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      await api.login({
        username: form.username.trim() || undefined,
        email: form.email.trim() || undefined,
        password: form.password,
      });
      navigate("/tasks");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Shell
      title="Welcome back"
      subtitle="Login with your username or email. Your session is stored in a secure cookie."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="text-fuchsia-200 hover:text-fuchsia-100">
            Create an account
          </Link>
          .
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Username" hint="Optional">
            <Input
              value={form.username}
              onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
              placeholder="mitesh"
              autoComplete="username"
            />
          </Field>
          <Field label="Email" hint="Optional">
            <Input
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              placeholder="mitesh@example.com"
              autoComplete="email"
            />
          </Field>
        </div>

        <Field label="Password">
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Field>

        {error ? (
          <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 pt-1">
          <Link to="/tasks" className="text-sm text-slate-300 hover:text-white">
            Go to tasks
          </Link>
          <Button type="submit" disabled={!canSubmit || pending}>
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
    </Shell>
  );
}

