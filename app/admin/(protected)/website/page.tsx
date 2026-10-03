import Link from "next/link";
import { getSettings, getWebsiteContent } from "@/lib/data";
import WebsiteEditor from "@/components/admin/website-editor";

export default async function WebsiteAdmin() {
  const [settings, content] = await Promise.all([
    getSettings(),
    getWebsiteContent(),
  ]);
  const ready = Object.hasOwn(settings, "website_content");
  return (
    <>
      <div className="admin-page-title">
        <div>
          <span className="section-number">MAKE IT YOURS</span>
          <h1>Website content.</h1>
          <p>
            Edit public text, links, intro video URLs and section visibility.
          </p>
        </div>
        <Link className="button button-outline" href="/" target="_blank">
          View website
        </Link>
      </div>
      {!ready && (
        <div role="alert" className="form-notice">
          <strong>Database update required.</strong>
          <p>
            Run <code>supabase/migrations/006_website_content.sql</code> in your
            Supabase SQL editor, then refresh this page. Existing content will
            be preserved. Publishing is disabled until the update is complete.
          </p>
        </div>
      )}
      <WebsiteEditor initial={content} ready={ready} />
    </>
  );
}
