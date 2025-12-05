import { Truck, RefreshCw, Zap, Check } from "lucide-react";

const announcements = [
  { icon: Truck, text: "Free shipping on orders above £25" },
  { icon: Zap, text: "Same day shipping (order before 8pm)" },
  { icon: RefreshCw, text: "30-day return policy" },
  { icon: Check, text: "Free shipping on orders above £25" },
];

export function AnnouncementBar() {
  return (
    <div className="bg-announcement text-announcement-foreground py-2.5 overflow-hidden w-full max-w-full">
      <div className="announcement-scroll flex whitespace-nowrap">
        {[...announcements, ...announcements].map((item, index) => (
          <div key={index} className="flex items-center gap-2 px-4 md:px-8">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs md:text-sm font-medium">{item.text}</span>
            <span className="mx-2 md:mx-4 text-announcement-foreground/40">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
