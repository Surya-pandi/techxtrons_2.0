"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveWebsiteContent } from "@/app/actions/admin";
import {
  websiteFields,
  defaultWebsiteContent,
  type WebsiteContent,
} from "@/lib/website-content";

export default function WebsiteEditor({
  initial,
  ready,
}: {
  initial: WebsiteContent;
  ready: boolean;
}) {
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);
  const groups = [...new Set(websiteFields.map((field) => field.group))];
  return (
    <form
      className="website-editor"
      onSubmit={(event) => {
        event.preventDefault();
        if (!ready || pending) return;
        setNotice(null);
        startTransition(async () => {
          try {
            const result = await saveWebsiteContent(values);
            setNotice(result);
            if (result.success) {
              setSaved(values);
              router.refresh();
            }
          } catch {
            setNotice({
              success: false,
              message:
                "Connection lost. Your edits are still here; please try again.",
            });
          }
        });
      }}
    >
      <p>
        Clear a text field to remove its text. Turn off a visibility control to
        remove that section from public pages. Changes take effect when you
        publish. Event records, photos, branding and contact details have their
        own editors.
      </p>
      <label>
        Find a field
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search headings, navigation, sections…"
        />
      </label>
      <fieldset disabled={!ready || pending}>
        {groups.map((group) => {
          const fields = websiteFields.filter(
            (field) =>
              field.group === group &&
              `${group} ${field.label}`
                .toLowerCase()
                .includes(query.toLowerCase()),
          );
          if (!fields.length) return null;
          return (
            <details
              className="admin-panel"
              key={group}
              open={query ? true : undefined}
            >
              <summary>
                {group} <small>({fields.length} controls)</small>
              </summary>
              <div className="website-fields">
                {fields.map((field) => (
                  <div key={field.key}>
                    <label
                      className={
                        field.type === "visible" ? "checkbox-field" : undefined
                      }
                    >
                      {field.type === "visible" ? (
                        <>
                          <input
                            type="checkbox"
                            checked={values[field.key] === true}
                            onChange={(event) =>
                              setValues((previous) => ({
                                ...previous,
                                [field.key]: event.target.checked,
                              }))
                            }
                          />
                          {field.label}
                        </>
                      ) : (
                        <>
                          <span>{field.label}</span>
                          {field.type === "url" ? (
                            <input
                              value={String(values[field.key] ?? "")}
                              onChange={(event) =>
                                setValues((previous) => ({
                                  ...previous,
                                  [field.key]: event.target.value,
                                }))
                              }
                              placeholder="/events or https://…"
                            />
                          ) : (
                            <textarea
                              rows={2}
                              maxLength={5000}
                              value={String(values[field.key] ?? "")}
                              onChange={(event) =>
                                setValues((previous) => ({
                                  ...previous,
                                  [field.key]: event.target.value,
                                }))
                              }
                            />
                          )}
                        </>
                      )}
                    </label>
                    <button
                      type="button"
                      className="text-link"
                      onClick={() =>
                        setValues((previous) => ({
                          ...previous,
                          [field.key]: defaultWebsiteContent[field.key],
                        }))
                      }
                    >
                      Restore default
                    </button>
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </fieldset>
      {notice && (
        <p role={notice.success ? "status" : "alert"} className="form-notice">
          {notice.message}
        </p>
      )}
      <div className="website-publish">
        <button className="button" disabled={!ready || pending || !dirty}>
          {pending ? "Publishing…" : "Publish changes"}
        </button>
        <button
          type="button"
          className="button button-outline"
          disabled={pending || !dirty}
          onClick={() => {
            setValues(saved);
            setNotice(null);
          }}
        >
          Discard unsaved changes
        </button>
        <span role="status">
          {dirty ? "Unsaved changes" : "All changes saved"}
        </span>
      </div>
    </form>
  );
}
