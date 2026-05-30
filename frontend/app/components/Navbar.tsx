"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/resume", label: "Resume" },
  { href: "/jobs", label: "Jobs" },
  { href: "/trends", label: "Trends" },
  { href: "/linkedin", label: "LinkedIn" },
  { href: "/interview", label: "Interview" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/90 backdrop-blur-md"
    >
      <Link href="/" className="flex items-center gap-2">
        <span className="text-white font-bold text-xl tracking-tight">CareerGPS</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-yellow-500/40 text-yellow-400 bg-yellow-400/10">AI</span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              pathname === link.href
                ? "text-yellow-400 bg-yellow-400/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/analyze"
          className="ml-3 px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition"
        >
          Analyze →
        </Link>
      </div>
    </motion.nav>
  );
}