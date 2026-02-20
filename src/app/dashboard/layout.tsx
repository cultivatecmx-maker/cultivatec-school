"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { DataProvider, useData } from "@/context/data-context";

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { user, school } = useData();

  return (
    <div className="flex h-screen bg-blue-50/30">
      <Sidebar
        userName={user.name}
        schoolName={school.name}
        userRole={user.role}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
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
