import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata = { title: "Contact" };

const hours = [
  { day: "Sunday", time: "9:00 AM – 1:00 PM" },
  { day: "Monday", time: "9:00 AM – 1:00 PM" },
  { day: "Tuesday", time: "4:00 PM – 8:00 PM" },
  { day: "Wednesday", time: "9:00 AM – 1:00 PM" },
  { day: "Thursday", time: "4:00 PM – 8:00 PM" },
  { day: "Friday", time: "Closed" },
  { day: "Saturday", time: "10:00 AM – 2:00 PM" },
];

export default function ContactPage() {
  return (
    <div className="page-enter">
      <section className="container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Contact</p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-6xl">
            We'd love to hear from you
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            For appointments use our online booking — it's faster. For everything else, we're a message away.
          </p>
        </div>
      </section>

      <section className="container pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <InfoCard icon={<MapPin />} title="Visit us" lines={["House 42, Road 11", "Banani, Dhaka 1213", "Bangladesh"]} />
            <InfoCard icon={<Phone />} title="Call us" lines={["+880 1711-000001", "+880 9612-345678 (front desk)"]} />
            <InfoCard icon={<Mail />} title="Email us" lines={["hello@valothakun.health", "appointments@valothakun.health"]} />

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Clock className="size-5 text-primary" />
                Opening hours
              </h3>
              <div className="mt-4 space-y-2 text-sm">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className={h.time === "Closed" ? "text-destructive" : ""}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border shadow-sm">
              <iframe
                title="Practice location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=90.398%2C23.789%2C90.412%2C23.797&layer=mapnik&marker=23.793%2C90.405"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
            <h2 className="font-display text-2xl font-semibold">Send us a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">We typically reply within one business day.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        {lines.map((l) => <p key={l}>{l}</p>)}
      </div>
    </div>
  );
}
