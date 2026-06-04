import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { Button, Field, Input } from "../components/Field.jsx";
import { Shell } from "../components/Shell.jsx";

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return Boolean(form.username.trim() && form.email.trim() && form.password.trim());
  }, [form]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      await api.register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/tasks");
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Shell
      title="Create your account"
      subtitle="Register once, then manage tasks from any browser."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-fuchsia-200 hover:text-fuchsia-100">
            Login
          </Link>
          .
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Username">
            <Input
              value={form.username}
              onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
              placeholder="mitesh"
              autoComplete="username"
            />
          </Field>
          <Field label="Email">
            <Input
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              placeholder="mitesh@example.com"
              autoComplete="email"
            />
          </Field>
        </div>

        <Field label="Password" hint="Min 6+ recommended">
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Field>

        {error ? (
          <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 pt-1">
          <Link to="/login" className="text-sm text-slate-300 hover:text-white">
            Back to login
          </Link>
          <Button type="submit" disabled={!canSubmit || pending}>
            {pending ? "Creating..." : "Create account"}
          </Button>
        </div>
      </form>
    </Shell>

  );
}

