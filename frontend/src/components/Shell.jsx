import { Link } from "react-router-dom";
import { cn } from "../lib/ui.js";

export function Shell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-full">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <span className="text-sm font-semibold text-fuchsia-200">B</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-100">Balaji Tasks</div>
              <div className="text-xs text-slate-400">Simple, fast, clean</div>
            </div>
          </Link>

          <nav className="flex items-center gap-3 text-sm text-slate-300">
            <Link className="hover:text-white" to="/tasks">
              Tasks
            </Link>
            <span className="text-white/20">/</span>
            <Link className="hover:text-white" to="/login">
              Login
            </Link>
            <Link className="hover:text-white" to="/register">
              Register
            </Link>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-5xl px-6 pb-14">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.7)]">
            <div className="flex flex-col gap-1 pb-6">
              <h1 className={cn("text-2xl font-semibold text-slate-50")}>{title}</h1>
              {subtitle ? <p className="text-sm text-slate-300">{subtitle}</p> : null}
            </div>
            {children}
          </section>
          {footer ? <div className="pt-4 text-sm text-slate-400">{footer}</div> : null}
        </main>
      </div>
    </div>
  );
}

