import type { MetadataRoute } from "next";
import { getDraftSlugs } from "@/data/drafts";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();
  const paths = ["", "/contact", "/privacy", "/terms", "/cookies"];

  const staticEntries = paths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: (path === "" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: path === "" ? 1 : path === "/contact" ? 0.9 : 0.4,
  }));

  const projectEntries = getDraftSlugs().map((slug) => ({
    url: `${base}/drafts/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...projectEntries];
}
