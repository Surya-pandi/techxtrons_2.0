"use client";
import { useActionState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { sendMessage } from "@/app/actions/contact";
export default function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, {
    success: false,
    message: "",
  });
  return (
    <div className="contact-form-card">
      <span className="section-number">DROP US A LINE</span>
      <h2>Start a conversation.</h2>
      {state.success ? (
        <div className="success-state" role="status">
          <CheckCircle2 />
          <h3>Thank you for reaching out.</h3>
          <p>{state.message}</p>
        </div>
      ) : (
        <form action={action}>
          <div className="form-row">
            <label>
              Your name
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                placeholder="Full name"
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                name="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label>
            Subject
            <input
              name="subject"
              required
              minLength={3}
              maxLength={150}
              placeholder="What’s on your mind?"
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              rows={5}
              required
              minLength={10}
              maxLength={5000}
              placeholder="Tell us a little more…"
            />
          </label>
          <div className="honeypot" aria-hidden="true">
            <label>
              Leave this blank
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {state.message && (
            <p className="form-notice error-notice" role="alert">
              {state.message}
            </p>
          )}
          <button className="button" disabled={pending}>
            {pending ? "Sending…" : "Send message"}
            <ArrowUpRight size={16} />
          </button>
          <p className="form-footnote">
            Your details are only used to respond to your enquiry.
          </p>
        </form>
      )}
    </div>
  );
}
