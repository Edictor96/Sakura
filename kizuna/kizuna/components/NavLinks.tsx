"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/explore", label: "Explore", glyph: "見" },
  { href: "/community", label: "Community", glyph: "輪" },
  { href: "/events", label: "Events", glyph: "生" },
  { href: "/merch", label: "Merch", glyph: "集" },
  { href: "/passport", label: "Profile", glyph: "私" },
];

export default function NavLinks({ variant }: { variant: "top" | "tab" }) {
  const path = usePathname();
  return (
    <nav aria-label={variant === "top" ? "Main" : "Main (mobile)"} className={variant === "top" ? "navlinks" : "tabbar"}>
      {LINKS.map((l) => {
        const active = path === l.href || path.startsWith(l.href + "/");
        return (
          <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined} className={active ? "active" : undefined}>
            {variant === "tab" ? <span className="tab-glyph" aria-hidden="true">{l.glyph}</span> : null}
            <span>{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
