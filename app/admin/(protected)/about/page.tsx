import { getAbout } from "@/lib/data";
import { aboutFields } from "@/lib/admin-fields";
import ContentForm from "@/components/admin/content-form";
export default async function AboutAdmin() {
  const data = await getAbout();
  return (
    <>
      <div className="admin-page-title">
        <div>
          <span className="section-number">YOUR STORY</span>
          <h1>About the association.</h1>
          <p>Share the vision that brings your community together.</p>
        </div>
      </div>
      <section className="admin-panel">
        <ContentForm
          table="about"
          id={data.id}
          initial={{ ...data }}
          fields={aboutFields}
        />
      </section>
    </>
  );
}
