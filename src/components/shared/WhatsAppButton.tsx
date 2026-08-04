'use client';

import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-white shadow-[0_8px_30px_-8px_rgba(37,211,102,0.7)] transition-transform hover:scale-105 active:scale-95 md:bottom-8 md:right-8"
    >
      <MessageCircle className="h-6 w-6 fill-white text-[#25D366]" strokeWidth={0} />
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp Us</span>
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
    </a>
  );
}
