"use client";
import { useActionState } from "react";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { login } from "@/app/actions/admin";
export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(login, {
    success: false,
    message: "",
  });
  return (
    <div className="login-card">
      <div className="login-icon">
        <LockKeyhole />
      </div>
      <span className="section-number">TECHXTRONS 2.0 ADMIN</span>
      <h1>Welcome back.</h1>
      <p>Sign in to shape the experience.</p>
      {!configured && (
        <p className="form-notice">
          Supabase is not connected yet. Add your project URL and public key,
          run the database migration, and create an admin account to enable
          sign-in.
        </p>
      )}
      <form action={action}>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="username"
            required
            placeholder="admin@example.com"
            disabled={!configured}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={!configured}
          />
        </label>
        {state.message && (
          <p role="alert" className="error-notice form-notice">
            {state.message}
          </p>
        )}
        <button className="button" disabled={pending || !configured}>
          {pending ? "Signing in…" : "Sign in"}
          <ArrowUpRight size={16} />
        </button>
      </form>
      <small>Access is limited to authorized association administrators.</small>
    </div>
  );
}
