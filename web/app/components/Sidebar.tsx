"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/chat", label: "Chat" },
  { href: "/jobs", label: "Jobs" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-white">
      <div className="px-4 py-4 border-b">
        <div className="text-lg font-semibold">JobIntelligence</div>
        <div className="text-xs text-gray-500">Search • Ingest • Insights</div>
      </div>

      <nav className="p-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-md px-3 py-2 text-sm",
                active ? "bg-gray-100 font-medium" : "hover:bg-gray-50",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t p-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          API: <span className="font-medium">Connected</span>
        </div>
      </div>
    </aside>
  );
}
