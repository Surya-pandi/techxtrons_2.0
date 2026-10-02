import { getSettings } from "@/lib/data";
import { settingsFields } from "@/lib/admin-fields";
import ContentForm from "@/components/admin/content-form";
export default async function SettingsAdmin() {
  const data = await getSettings();
  return (
    <>
      <div className="admin-page-title">
        <div>
          <span className="section-number">THE FINISHING TOUCHES</span>
          <h1>Site settings.</h1>
          <p>Branding, countdown, and the cinematic introduction.</p>
        </div>
      </div>
      <section className="admin-panel">
        <ContentForm
          table="settings"
          id={data.id}
          initial={{ ...data, event_starts_at: data.event_starts_at || "" }}
          fields={settingsFields}
        />
      </section>
    </>
  );
}
