import { ContactForm } from "@/components/forms/contact-form";
import { Card } from "@/components/ui/card";

export default function NewContactPage() {
  return <Card><h1 className="mb-4 text-xl font-semibold">Új kapcsolat</h1><ContactForm /></Card>;
}
