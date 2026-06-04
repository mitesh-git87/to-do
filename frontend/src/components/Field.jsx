import { cn } from "../lib/ui.js";

export function Field({ label, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <div className="flex items-baseline justify-between gap-3">
          <label className="text-sm font-medium text-slate-200">{label}</label>
          {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
        </div>
      ) : null}
      {children}
      {error ? (
        <p className={cn("text-sm", "text-rose-300")}>{error}</p>
      ) : null}
    </div>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-100",
        "placeholder:text-slate-500 outline-none",
        "focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-400/20",
        props.className
      )}
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-100",
        "placeholder:text-slate-500 outline-none",
        "focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-400/20",
        props.className
      )}
    />
  );
}

export function Button({ variant = "primary", className, ...props }) {
  const styles =
    variant === "ghost"
      ? "bg-transparent hover:bg-white/5 border border-white/10"
      : variant === "danger"
        ? "bg-rose-500/90 hover:bg-rose-500 border border-rose-400/30"
        : "bg-fuchsia-500/90 hover:bg-fuchsia-500 border border-fuchsia-400/30";

  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium",
        "text-white shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed",
        styles,
        className
      )}
    />
  );
}

