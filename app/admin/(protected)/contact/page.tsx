import { getContact } from "@/lib/data";
import { contactFields } from "@/lib/admin-fields";
import ContentForm from "@/components/admin/content-form";
export default async function ContactAdmin() {
  const data = await getContact();
  return (
    <>
      <div className="admin-page-title">
        <div>
          <span className="section-number">STAY CONNECTED</span>
          <h1>Contact information.</h1>
          <p>Keep your contact details and social links up to date.</p>
        </div>
      </div>
      <section className="admin-panel">
        <ContentForm
          table="contact"
          id={data.id}
          initial={{ ...data }}
          fields={contactFields}
        />
      </section>
    </>
  );
}
