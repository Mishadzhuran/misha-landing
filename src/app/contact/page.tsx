import type { Metadata } from "next";
import { site } from "@/data/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a conversation with ${site.name}: share what you want to build.`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <ContactForm />
    </div>
  );
}
