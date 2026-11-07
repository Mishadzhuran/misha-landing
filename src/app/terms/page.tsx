import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { PageHero, Shell } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing use of the Appigon website and paid studio engagements, including payments, IP, and liability.",
};

const updated = "September 8, 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description={`Last updated: ${updated}. These terms cover website use and the commercial framework for paid Appigon engagements.`}
      />
      <section className="pb-24 md:pb-32">
        <Shell>
          <article className="panel legal-prose mx-auto max-w-3xl p-8 md:p-12">
            <p>
              These Terms of Service (&quot;Terms&quot;) apply to (A) use of our website and
              inquiry channels, and (B) the default commercial framework for paid services.
              A signed Statement of Work / Services Agreement (&quot;SOW&quot;) controls if it
              conflicts with these Terms. Have counsel review before you publish final
              company registration details.
            </p>

            <h2>1. Parties & acceptance</h2>
            <p>
              The provider is <strong>{site.legalName}</strong> (&quot;Appigon&quot;,
              &quot;we&quot;). &quot;Client&quot; / &quot;you&quot; means the person or entity
              using the site or contracting for services. By using the site you accept Part A.
              By signing an SOW (or paying an invoice referencing these Terms) you accept Parts
              A and B.
            </p>

            <h2>2. Part A: Website & inquiries</h2>
            <h3>2.1 Informational content</h3>
            <p>
              Case studies, metrics, timelines, and pricing hints on the site are illustrative.
              They do not guarantee identical results. Nothing on the site is an offer capable
              of acceptance until confirmed in a signed SOW.
            </p>
            <h3>2.2 No engagement from a form alone</h3>
            <p>
              Submitting a brief, booking a call, or receiving a proposal does not create a
              client relationship or payment obligation. A relationship begins only when both
              parties execute an SOW (or equivalent written agreement) and any required
              deposit is received.
            </p>
            <h3>2.3 Acceptable use</h3>
            <p>You agree not to:</p>
            <ul>
              <li>Attempt unauthorized access to systems or data</li>
              <li>Submit unlawful, abusive, or infringing content</li>
              <li>Scrape the site at a volume that degrades service (ordinary search indexing excepted)</li>
              <li>Misrepresent affiliation with Appigon</li>
            </ul>
            <h3>2.4 Site IP</h3>
            <p>
              Branding, copy, visuals, motion, and code on this site are owned by Appigon or
              its licensors. You may not copy or exploit them without written permission.
            </p>

            <h2>3. Part B: Paid services</h2>
            <h3>3.1 Scope</h3>
            <p>
              Services may include mobile/web product development, UX/UI, landing pages, App
              Store / Google Play preparation, release support, and retainers, as defined in
              the SOW. Work outside scope requires a written change order and may adjust fees
              and dates.
            </p>
            <h3>3.2 Client responsibilities</h3>
            <p>You will provide, on time:</p>
            <ul>
              <li>A single decision-maker with authority to approve milestones</li>
              <li>Access to accounts, credentials, brand assets, and legal/policy copy needed for store submission</li>
              <li>Feedback within agreed review windows (delays shift timelines)</li>
              <li>Accurate information about regulated product claims (health, finance, gambling, etc.)</li>
            </ul>
            <h3>3.3 Fees, deposits & invoices</h3>
            <ul>
              <li>
                <strong>Discovery / fixed sprints:</strong> typically prepaid in full before
                kickoff
              </li>
              <li>
                <strong>Build engagements:</strong> deposit plus milestone invoices as set in
                the SOW
              </li>
              <li>
                <strong>Retainers:</strong> billed in advance for the period unless the SOW
                states otherwise
              </li>
              <li>
                Invoices are due as stated (commonly Net 7 to 14). Late amounts may accrue
                statutory interest and pause work until cured
              </li>
              <li>
                Fees exclude taxes (VAT/GST) unless stated. You are responsible for applicable
                taxes
              </li>
            </ul>
            <h3>3.4 Refunds & cancellation</h3>
            <ul>
              <li>
                Completed and accepted milestones are <strong>non-refundable</strong>
              </li>
              <li>
                If you cancel before kickoff, we may retain a reasonable admin fee and refund
                unused prepaid amounts not yet allocated
              </li>
              <li>
                If you cancel mid-engagement, you pay for work performed, non-cancelable
                third-party costs, and any kill fee stated in the SOW
              </li>
              <li>
                Unused retainer hours roll only if the SOW expressly allows it
              </li>
              <li>
                Mandatory consumer withdrawal rights (if ever applicable to B2C) are respected
                as required by law; our typical clients are B2B
              </li>
            </ul>
            <h3>3.5 Intellectual property</h3>
            <p>
              Under Polish copyright rules, transfer of proprietary (economic) copyrights
              generally requires a <strong>written agreement</strong>. Unless the SOW says
              otherwise:
            </p>
            <ul>
              <li>
                Upon full payment of a milestone covering specific deliverables, Appigon
                assigns to Client the proprietary rights in those custom deliverables, in the
                fields of exploitation listed in the SOW
              </li>
              <li>
                Appigon retains ownership of pre-existing tools, libraries, frameworks,
                know-how, and generic components; Client receives a non-exclusive license to
                use them as embedded in the deliverables
              </li>
              <li>
                Open-source and third-party licensed materials remain under their own licenses;
                Client must comply with those terms
              </li>
              <li>
                Moral rights are handled as permitted by applicable law; the SOW may include
                waivers/consents where allowed
              </li>
              <li>
                Portfolio rights: unless you opt out in writing, Appigon may show non-confidential
                work in our portfolio and marketing after public launch
              </li>
            </ul>
            <h3>3.6 Store platforms & third parties</h3>
            <p>
              Apple, Google, and other platforms set their own rules. Approval, featuring,
              ranking, and policy outcomes are not guaranteed. We prepare submissions
              diligently within scope; platform decisions outside our control are not a breach.
              Remediation for guideline issues caused by our scoped work is handled per the
              SOW; content/policy choices you make may require change orders.
            </p>
            <h3>3.7 Confidentiality</h3>
            <p>
              Each party will protect the other&apos;s confidential information with reasonable
              care and use it only to perform the engagement, except for information that is
              public, independently developed, or required to be disclosed by law.
            </p>
            <h3>3.8 Warranties</h3>
            <p>
              Services are provided with professional skill and care. Except as expressly
              stated in an SOW, we disclaim other warranties to the fullest extent permitted
              by law, including implied warranties of merchantability or fitness for a
              particular purpose.
            </p>
            <h3>3.9 Limitation of liability</h3>
            <p>
              To the maximum extent permitted by law: (a) neither party is liable for indirect,
              incidental, special, consequential, or lost-profit damages; (b) Appigon&apos;s
              aggregate liability arising from an SOW is capped at the fees paid by Client under
              that SOW in the twelve (12) months preceding the claim; (c) nothing excludes
              liability that cannot be limited by law (e.g. intentional misconduct where
              mandatory).
            </p>
            <h3>3.10 Indemnity</h3>
            <p>
              Client will indemnify Appigon against claims arising from Client materials,
              product claims, regulated-vertical compliance, or use of deliverables outside
              the SOW, except to the extent caused by Appigon&apos;s willful misconduct.
            </p>
            <h3>3.11 Non-solicitation</h3>
            <p>
              During the engagement and for six (6) months after, neither party will solicit
              for employment the other&apos;s personnel primarily involved in the project,
              except via general public job ads.
            </p>
            <h3>3.12 Force majeure</h3>
            <p>
              Neither party is liable for delays caused by events beyond reasonable control
              (including platform outages, war, epidemic, infrastructure failure), provided
              they give prompt notice and mitigate.
            </p>

            <h2>4. Governing law & disputes</h2>
            <p>
              These Terms and related SOWs are governed by the laws of {site.governingLaw},
              without conflict-of-law rules. Courts competent for {site.headOffice} have
              exclusive jurisdiction, unless mandatory consumer protections require otherwise
              or the SOW selects arbitration.
            </p>

            <h2>5. Changes</h2>
            <p>
              We may update website Terms by posting a new version. SOW-bound work continues
              under the version referenced in that SOW unless both parties agree otherwise.
            </p>

            <h2>6. Contact</h2>
            <p>
              Questions: <a href={`mailto:${site.email}`}>{site.email}</a>
              <br />
              Related: <Link href="/privacy">Privacy Policy</Link> ·{" "}
              <Link href="/cookies">Cookie Policy</Link>
            </p>
          </article>
        </Shell>
      </section>
    </>
  );
}
