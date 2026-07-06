"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Baby, LineChart } from "lucide-react";

export default function BottomNav() {
  const p = usePathname();
  const items = [
    { href: "/", label: "Home", I: Home },
    { href: "/womb", label: "Living Womb", I: Baby },
    { href: "/graph", label: "Daily Graph", I: LineChart },
  ];
  return (
    <nav className="glass nav" aria-label="Main navigation">
      {items.map(({ href, label, I }) => (
        <Link key={href} href={href} className={p === href ? "on" : ""}>
          <I size={19} strokeWidth={2.3} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
