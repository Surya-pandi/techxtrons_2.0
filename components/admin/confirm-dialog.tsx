"use client";
import { useEffect, useRef } from "react";
export default function ConfirmDialog({
  title,
  text,
  pending,
  onCancel,
  onConfirm,
}: {
  title: string;
  text: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      onCancel={(e) => {
        e.preventDefault();
        if (!pending) onCancel();
      }}
    >
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="dialog-actions">
        <button
          className="button button-outline"
          autoFocus
          onClick={onCancel}
          disabled={pending}
        >
          Cancel
        </button>
        <button
          className="button danger-button"
          onClick={onConfirm}
          disabled={pending}
        >
          {pending ? "Deleting…" : "Delete"}
        </button>
      </div>
    </dialog>
  );
}
