'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MapPin, Phone, Clock, Send, Loader2 } from 'lucide-react';
import { SectionHeading } from './Services';
import { BUSINESS } from '@/lib/utils';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Please enter your name and phone number.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success("Thanks! We'll call you back shortly.");
      setForm({ name: '', phone: '', message: '' });
    } catch {
      toast.error('Something went wrong. Please call us directly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="relative bg-base-850 py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Visit, Call or Send a Message"
          subtitle="We reply fast — usually within minutes during business hours."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <motion.form
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="glass-panel rounded-2xl p-6 lg:col-span-2"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-500">Your Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ramesh Kumar"
                  className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-3 text-sm text-ink-100 outline-none placeholder:text-ink-700 focus:border-volt-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-500">Phone Number</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="98765 43210"
                  type="tel"
                  className="w-full rounded-lg border border-white/10 bg-base-900 px-4 py-3 text-sm text-ink-100 outline-none placeholder:text-ink-700 focus:border-volt-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-500">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what you need help with..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-white/10 bg-base-900 px-4 py-3 text-sm text-ink-100 outline-none placeholder:text-ink-700 focus:border-volt-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-volt-500 py-3.5 text-sm font-semibold text-white shadow-volt-glow transition-transform hover:scale-[1.01] disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Enquiry
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5 lg:col-span-3"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoCard icon={MapPin} title="Address" text={BUSINESS.fullAddress} />
              <InfoCard icon={Phone} title="Phone" text={BUSINESS.phoneDisplay} href={BUSINESS.phoneHref} />
              <InfoCard icon={Clock} title="Hours" text="Mon–Sun · 9 AM – 8:30 PM" />
            </div>
            <div className="h-72 overflow-hidden rounded-2xl border border-white/5 sm:h-full">
              <iframe
                title="New Nikhil Electrical location"
                src={BUSINESS.mapsEmbedSrc}
                className="h-full w-full grayscale invert-[0.92] contrast-[0.9]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border border-white/5 bg-base-800 p-4">
      <Icon className="h-4 w-4 text-copper-500" />
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink-500">{title}</p>
      <p className="mt-1 text-sm text-ink-100">{text}</p>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
