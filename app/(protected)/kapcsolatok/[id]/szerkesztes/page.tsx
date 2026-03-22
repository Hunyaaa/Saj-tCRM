import { ContactForm } from "@/components/forms/contact-form";
import { Card } from "@/components/ui/card";
import { getContactById } from "@/lib/db/queries";

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await getContactById(id);

  if (!contact) return <p>Nincs ilyen kapcsolat.</p>;

  return (
    <Card>
      <h1 className="mb-4 text-xl font-semibold">Kapcsolat szerkesztése</h1>
      <ContactForm contact={contact} />
    </Card>
  );
}
