import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDraftView } from "@/components/drafts/ProductDraft";
import { getDraft, getDraftSlugs } from "@/data/drafts";

export function generateStaticParams() {
  return getDraftSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const draft = getDraft(slug);
  if (!draft) return { title: "Draft" };
  return {
    title: `${draft.title} draft`,
    description: draft.support,
  };
}

export default async function ProductDraftPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const draft = getDraft(slug);
  if (!draft) notFound();
  return <ProductDraftView draft={draft} />;
}
