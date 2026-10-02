"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Images,
  FileText,
  Mail,
  Settings,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
import { logout } from "@/app/actions/admin";
export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="admin-sidebar">
      <Link href="/admin/dashboard" className="admin-brand">
        <span>
          IT<span className="yellow">.</span>
        </span>
        <small>
          TECHXTRONS 2.0
          <br />
          CONTROL ROOM
        </small>
      </Link>
      <nav aria-label="Admin navigation">
        {[
          ["dashboard", "Dashboard", LayoutDashboard],
          ["events", "Events", CalendarDays],
          ["gallery", "Gallery", Images],
          ["about", "About", FileText],
          ["contact", "Contact", Mail],
          ["settings", "Settings", Settings],
        ].map(([route, label, Icon]) => {
          const Component = Icon as typeof LayoutDashboard;
          return (
            <Link
              key={route as string}
              href={`/admin/${route}`}
              aria-current={pathname === `/admin/${route}` ? "page" : undefined}
            >
              <Component size={18} />
              {label as string}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <Link href="/" target="_blank">
          View website
          <ArrowUpRight size={16} />
        </Link>
        <form action={logout}>
          <button>
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
