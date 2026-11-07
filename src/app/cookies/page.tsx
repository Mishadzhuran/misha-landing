import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { PageHero, Shell } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Appigon uses cookies and similar technologies on the website, and how you can control them.",
};

const updated = "September 8, 2026";

export default function CookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Cookie Policy"
        description={`Last updated: ${updated}. This policy explains cookies and similar technologies used on the Appigon website.`}
      />
      <section className="pb-24 md:pb-32">
        <Shell>
          <article className="panel legal-prose mx-auto max-w-3xl p-8 md:p-12">
            <p>
              This Cookie Policy should be read with our{" "}
              <Link href="/privacy">Privacy Policy</Link>. Where GDPR/ePrivacy rules require
              consent for non-essential cookies, we will only set those after you opt in.
            </p>

            <h2>1. What are cookies?</h2>
            <p>
              Cookies are small text files stored on your device. Similar technologies include
              local storage, pixels, and SDKs that read or store identifiers. They help sites
              function, remember preferences, and measure traffic.
            </p>

            <h2>2. How we use cookies</h2>
            <h3>2.1 Strictly necessary</h3>
            <p>
              Required for security, load balancing, consent storage, and basic navigation.
              These do not require consent under most EU implementations.
            </p>
            <h3>2.2 Preferences</h3>
            <p>
              Remember language or UI choices. Used only if we enable such features; consent
              may be required depending on implementation.
            </p>
            <h3>2.3 Analytics</h3>
            <p>
              Help us understand page performance and traffic sources (e.g. aggregated page
              views). Where required, we enable these only with consent and configure tools to
              minimize personal data.
            </p>
            <h3>2.4 Marketing</h3>
            <p>
              Used only if we run ads or retargeting. Require consent. We currently prioritize
              essential + optional analytics; marketing cookies will not be activated without
              an updated notice and consent flow.
            </p>

            <h2>3. Cookie table (illustrative)</h2>
            <p>
              Exact names may change as we add tooling. Typical categories:
            </p>
            <ul>
              <li>
                <strong>appigon_consent</strong>, stores your cookie choices (necessary)
              </li>
              <li>
                <strong>Session / CSRF tokens</strong>, security and form integrity
                (necessary)
              </li>
              <li>
                <strong>Analytics IDs</strong>, traffic measurement (analytics; consent where
                required)
              </li>
            </ul>

            <h2>4. Your controls</h2>
            <ul>
              <li>Browser settings: block or delete cookies (may break site features)</li>
              <li>Consent banner / preference center (when enabled on the site)</li>
              <li>
                Opt-out tools provided by analytics vendors, where applicable
              </li>
            </ul>

            <h2>5. Retention</h2>
            <p>
              Session cookies expire when you close the browser. Persistent cookies last for
              the period set by each cookie (commonly from days to 24 months for analytics).
            </p>

            <h2>6. Updates</h2>
            <p>
              We may revise this policy when our tooling changes. The &quot;Last updated&quot;
              date will change accordingly.
            </p>

            <h2>7. Contact</h2>
            <p>
              Questions: <a href={`mailto:${site.email}`}>{site.email}</a>
              <br />
              {site.legalName} · {site.headOffice}
            </p>
          </article>
        </Shell>
      </section>
    </>
  );
}
