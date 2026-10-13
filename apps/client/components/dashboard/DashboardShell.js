
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import api from "@/lib/api";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await api.get("/api/users/me");

        if (active) {
          setUser(response.data.user);
        }
      } catch (error) {
        if (active) {
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            router.replace("/login");
          } else {
            console.error("Unable to verify session:", error);
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d17]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
          <p className="mt-4 text-sm text-slate-400">
            Verifying your session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d17] text-white">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close navigation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              />

              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.22 }}
                className="fixed inset-y-0 left-0 z-50 lg:hidden"
              >
                <Sidebar onNavigate={() => setMenuOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          <Topbar
            user={user}
            onMenuClick={() => setMenuOpen(true)}
          />

          <main className="mx-auto max-w-[1600px] p-4 sm:p-8">
            {children}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
              <p className="text-xs text-slate-500">
                TradeFlow · Paper trading environment
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-red-400/10 hover:text-red-300"
              >
                Sign out ↗
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
