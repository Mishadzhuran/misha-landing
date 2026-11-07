import type { Metadata } from "next";
import { site } from "@/data/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a conversation with ${site.name}: product, apps, and market release.`,
};

export default function ContactPage() {
  return <ContactForm />;
}
