import { MessageCircleMore } from "lucide-react";

export function WhatsAppFloat() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";

  return (
    <a
      href={`https://wa.me/${phone}?text=Hi%20Z%20Electronics,%20I%20need%20help%20with%20a%20component%20order.`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 right-4 z-40 flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-500/90 px-4 py-3 text-sm font-semibold text-white shadow-card backdrop-blur-xl md:bottom-6"
    >
      <MessageCircleMore className="h-4 w-4" />
      WhatsApp Support
    </a>
  );
}
