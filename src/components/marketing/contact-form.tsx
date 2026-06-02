"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function ContactForm() {
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("Message sent", "We'll get back to you within one business day.");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Could not send", "Please double-check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" placeholder="Jane Doe" required minLength={2} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" placeholder="+880 ..." />
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" placeholder="Question about cardiology" required />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Your message</Label>
        <Textarea id="message" name="message" rows={5} placeholder="How can we help?" required minLength={5} />
      </div>

      <Button type="submit" disabled={loading} variant="gradient" size="lg" className="w-full sm:w-auto">
        {loading ? "Sending…" : (<><Send className="size-4" /> Send message</>)}
      </Button>
    </form>
  );
}
