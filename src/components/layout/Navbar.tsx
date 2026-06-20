"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Zap, BookOpen, PenTool, LayoutDashboard, Target, Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Home", icon: Zap },
  { href: "/materials", label: "Materials", icon: BookOpen },
  { href: "/simulation", label: "Simulation", icon: LayoutDashboard },
  { href: "/assessment", label: "Assessment", icon: PenTool },
  { href: "/outcomes", label: "Learning Outcomes", icon: Target },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            animate={{ 
              filter: [
                "drop-shadow(0 0 4px rgba(59,130,246,0.4))",
                "drop-shadow(0 0 12px rgba(59,130,246,0.7))",
                "drop-shadow(0 0 4px rgba(59,130,246,0.4))"
              ]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap className="h-6 w-6 text-blue-400" />
          </motion.div>
          <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight transition-colors">
            Basic <span className="neon-text-blue">Electricity</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link, i) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "text-blue-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-lg bg-blue-500/10 border border-blue-500/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Theme Toggle, Auth & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          {status === "loading" ? null : session ? (
            <div className="hidden md:flex items-center gap-3 mr-2">
              <span className="text-sm font-medium text-slate-300">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 mr-2">
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-500/20"
              >
                Register
              </Link>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            aria-label="Toggle theme"
          >
            <span suppressHydrationWarning>
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </span>
          </button>
          
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors p-2"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-slate-800/60 bg-slate-950/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((link, i) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "text-blue-400 bg-blue-500/10 border border-blue-500/20"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
