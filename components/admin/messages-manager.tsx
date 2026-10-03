"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRecord } from "@/app/actions/admin";
import { formatDate } from "@/lib/utils";
import ConfirmDialog from "./confirm-dialog";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};
export default function MessagesManager({
  messages,
  ready,
}: {
  messages: Enquiry[];
  ready: boolean;
}) {
  const [deleting, setDeleting] = useState<Enquiry | null>(null);
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <section className="admin-panel">
      {notice && (
        <p role="status" className="form-notice">
          {notice}
        </p>
      )}
      {!messages.length && <p>No enquiries on this page.</p>}
      {messages.map((message) => (
        <article className="message-row" key={message.id}>
          <h2>{message.subject}</h2>
          <a href={`mailto:${message.email}`}>
            {message.name} · {message.email}
          </a>
          <p className="preserve-lines">{message.message}</p>
          <small>{formatDate(message.created_at)}</small>
          <p>
            <button
              className="button button-outline"
              disabled={!ready || pending}
              onClick={() => setDeleting(message)}
            >
              Delete enquiry
            </button>
          </p>
        </article>
      ))}
      {deleting && (
        <ConfirmDialog
          title={`Delete “${deleting.subject}”?`}
          text="This permanently removes the enquiry. This cannot be undone."
          pending={pending}
          onCancel={() => setDeleting(null)}
          onConfirm={() =>
            startTransition(async () => {
              try {
                const result = await deleteRecord("messages", deleting.id);
                setNotice(result.message);
                setDeleting(null);
                if (result.success) {
                  router.refresh();
                }
              } catch {
                setNotice(
                  "Unable to delete. Check your connection and try again.",
                );
                setDeleting(null);
              }
            })
          }
        />
      )}
    </section>
  );
}
