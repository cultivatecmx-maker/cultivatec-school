"use client";

import React, { useState, createContext, useContext } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { DataProvider, useData } from "@/context/data-context";

// Context to share mobile menu toggle with child pages
interface MobileMenuContextType {
  openMobileMenu: () => void;
}
const MobileMenuContext = createContext<MobileMenuContextType>({ openMobileMenu: () => {} });
export function useMobileMenu() {
  return useContext(MobileMenuContext);
}

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { user, school } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <MobileMenuContext.Provider value={{ openMobileMenu: () => setMobileOpen(true) }}>
      <div className="flex h-screen bg-blue-50/30">
        <Sidebar
          userName={user.name}
          schoolName={school.name}
          userRole={user.role}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
      </div>
    </MobileMenuContext.Provider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <DashboardInner>{children}</DashboardInner>
    </DataProvider>
  );
}
