import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { PageHero, Shell } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Appigon collects, uses, shares, and protects personal data under GDPR and applicable law.",
};

const updated = "September 8, 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`Last updated: ${updated}. This policy explains how ${site.legalName} handles personal data when you use our website, contact us, or engage our studio.`}
      />
      <section className="pb-24 md:pb-32">
        <Shell>
          <article className="panel legal-prose mx-auto max-w-3xl p-8 md:p-12">
            <p>
              This Privacy Policy is designed for visitors, prospects, and clients of an
              agency that provides paid digital product services. It is informed by practices
              common among EU/EEA studios (including GDPR transparency standards). It is not
              a substitute for counsel, replace entity, registration, and DPO details before
              go-live.
            </p>

            <h2>1. Controller</h2>
            <p>
              The data controller is <strong>{site.legalName}</strong> (&quot;Appigon&quot;,
              &quot;we&quot;, &quot;us&quot;). Head office reference: {site.headOffice}.
            </p>
            <p>
              Privacy requests:{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>

            <h2>2. Scope</h2>
            <p>This policy applies to:</p>
            <ul>
              <li>Use of our website and related forms</li>
              <li>Email, call, or messaging inquiries about projects</li>
              <li>Pre-contract discovery and proposal processes</li>
              <li>Client delivery communications under a services agreement (supplemented by that contract)</li>
            </ul>

            <h2>3. Definitions</h2>
            <p>
              <strong>Personal Data</strong> means any information relating to an identified or
              identifiable natural person. <strong>Processing</strong> means any operation on
              personal data (collection, storage, use, disclosure, deletion, etc.).{" "}
              <strong>GDPR</strong> means Regulation (EU) 2016/679.
            </p>

            <h2>4. Data we collect</h2>
            <h3>4.1 You provide directly</h3>
            <ul>
              <li>Name, email, phone (if provided), company, role</li>
              <li>Project briefs, budgets, timelines, and attachments you send</li>
              <li>Billing and contracting details once you become a client</li>
              <li>Communications content (emails, meeting notes relevant to delivery)</li>
            </ul>
            <h3>4.2 Collected automatically</h3>
            <ul>
              <li>IP address, approximate location derived from IP</li>
              <li>Device, browser, OS, language</li>
              <li>Pages viewed, referrer, timestamps, basic interaction metrics</li>
              <li>Cookie identifiers and consent preferences (see{" "}
                <Link href="/cookies">Cookie Policy</Link>)</li>
            </ul>
            <h3>4.3 Children</h3>
            <p>
              Our services are directed to businesses and professionals. We do not knowingly
              collect data from children under 16. If you believe we have, contact us for
              deletion.
            </p>

            <h2>5. Purposes and legal bases</h2>
            <p>We process personal data for:</p>
            <ul>
              <li>
                <strong>Responding to inquiries & preparing proposals</strong>, legitimate
                interests and/or steps prior to contract (Art. 6(1)(b)/(f) GDPR)
              </li>
              <li>
                <strong>Performing paid services & billing</strong>, contract necessity and
                legal obligation (tax/accounting)
              </li>
              <li>
                <strong>Operating, securing, and improving the website</strong>, legitimate
                interests
              </li>
              <li>
                <strong>Analytics (if enabled)</strong>, consent where required
              </li>
              <li>
                <strong>Marketing about our studio</strong>, consent or soft opt-in where
                permitted; you may opt out anytime
              </li>
              <li>
                <strong>Legal claims, compliance, fraud prevention</strong>, legitimate
                interests / legal obligation
              </li>
            </ul>

            <h2>6. Sharing</h2>
            <p>We do not sell personal data. We may share data with:</p>
            <ul>
              <li>
                Infrastructure providers (hosting, email, CRM, analytics, payment processors)
                under data-processing terms
              </li>
              <li>Professional advisors (legal, accounting) under confidentiality</li>
              <li>Authorities when required by law or valid legal process</li>
              <li>
                A successor entity in a merger, acquisition, or asset sale, subject to
                equivalent protection
              </li>
            </ul>
            <p>
              Subprocessors are bound to process data only on our instructions and to apply
              appropriate security measures.
            </p>

            <h2>7. International transfers</h2>
            <p>
              If personal data is transferred outside the EEA/UK, we use appropriate
              safeguards such as adequacy decisions, Standard Contractual Clauses, or other
              lawful mechanisms, plus supplementary measures where needed.
            </p>

            <h2>8. Retention</h2>
            <ul>
              <li>
                <strong>Website inquiries:</strong> typically up to 24 months after last
                meaningful contact, unless you become a client or ask us to delete sooner
              </li>
              <li>
                <strong>Contracts, invoices, tax records:</strong> as required by applicable
                law (often 5 to 10 years depending on jurisdiction)
              </li>
              <li>
                <strong>Analytics cookies:</strong> per tool settings and your consent
                choices
              </li>
            </ul>
            <p>
              When retention ends, we delete or irreversibly anonymize data, except where
              backups or legal holds temporarily prevent immediate erasure.
            </p>

            <h2>9. Your rights</h2>
            <p>Subject to applicable law, you may request:</p>
            <ul>
              <li>Access, rectification, erasure</li>
              <li>Restriction or objection to certain processing</li>
              <li>Data portability</li>
              <li>Withdrawal of consent (without affecting prior lawful processing)</li>
              <li>Complaint to a supervisory authority (e.g. Polish UODO if EU GDPR applies)</li>
            </ul>
            <p>
              To exercise rights, email{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>. We may need to verify your
              identity. We respond within statutory timelines.
            </p>

            <h2>10. Security</h2>
            <p>
              We apply technical and organizational measures appropriate to risk, including
              access controls, encrypted transport (HTTPS/TLS), least-privilege access, and
              vendor due diligence. No method of transmission or storage is perfectly secure;
              if you suspect a security issue involving your data, contact us immediately.
            </p>

            <h2>11. Cookies</h2>
            <p>
              Details on cookie categories, purposes, and controls are in our{" "}
              <Link href="/cookies">Cookie Policy</Link>.
            </p>

            <h2>12. Third-party sites</h2>
            <p>
              Links to third-party sites are not covered by this policy. Review their privacy
              notices separately.
            </p>

            <h2>13. Changes</h2>
            <p>
              We may update this policy. Material changes will be reflected by revising the
              &quot;Last updated&quot; date. Continued use of the site after changes
              constitutes awareness of the updated policy where permitted by law.
            </p>

            <h2>14. Contact</h2>
            <p>
              {site.legalName} · {site.headOffice}
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </article>
        </Shell>
      </section>
    </>
  );
}
