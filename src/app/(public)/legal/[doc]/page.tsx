import { notFound } from "next/navigation";

const docs: Record<string, { title: string; updated: string; body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    updated: "May 2026",
    body: [
      "We collect only what we need to give you the best possible care: your contact details, the reason for your visit, and any medical information you choose to share with us.",
      "Your data is stored securely on servers located within Bangladesh and is never sold or shared with advertisers. Access is limited to the staff directly involved in your care.",
      "You can request a full copy of the data we hold about you, or ask us to delete it, at any time by emailing privacy@valothakun.health.",
      "We use cookies only for essential functionality (login, language preference). We do not use third-party advertising trackers.",
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "May 2026",
    body: [
      "By using this website you agree to our terms. The site is provided for informational and booking purposes; it does not replace direct medical care.",
      "Appointments booked online are confirmed by email and SMS. You can reschedule or cancel free of charge up to 4 hours before the appointment using the link in your confirmation message.",
      "Late cancellations and no-shows may be charged a small fee at the discretion of the practice.",
      "Doctors retain the right to refuse a consultation in cases of misconduct, threats, or obvious misuse of the platform.",
    ],
  },
  disclaimer: {
    title: "Medical Disclaimer",
    updated: "May 2026",
    body: [
      "The information published on this website — including blog articles, service descriptions, and doctor bios — is for general educational purposes only and is not a substitute for personalised medical advice.",
      "If you are experiencing an emergency, call 999 or visit your nearest hospital immediately. Do not delay care because of something you read on this site.",
      "Always consult with a qualified physician before starting, stopping, or changing any treatment plan.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(docs).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  return { title: docs[doc]?.title ?? "Legal" };
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const d = docs[doc];
  if (!d) notFound();

  return (
    <div className="container-prose page-enter py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Legal</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">{d.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {d.updated}</p>

      <div className="prose mt-8 space-y-4 text-muted-foreground">
        {d.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
