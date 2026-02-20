"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  School,
  BookOpen,
  X,
} from "lucide-react";

interface SidebarProps {
  userName: string;
  schoolName: string;
  userRole: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Mis Clases",
    href: "/dashboard/classes",
    icon: BookOpen,
  },
  {
    name: "Estudiantes",
    href: "/dashboard/students",
    icon: Users,
  },
  {
    name: "Reportes",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    name: "Configuración",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar({ userName, schoolName, userRole, mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sidebarContent = (
    <>
      {/* Logo / Brand */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-blue-100 bg-gradient-to-r from-blue-50/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm border border-blue-100 shrink-0 overflow-hidden p-0.5">
            <img src="/logo.png" alt="CultivaTec" className="w-full h-full object-contain" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 truncate">
                CultivaTec
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Schools
              </span>
            </div>
          )}
        </div>
        {/* Close button — mobile only */}
        {mobileOpen && onMobileClose && (
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={onMobileClose}>
            <X className="w-5 h-5 text-slate-500" />
          </Button>
        )}
      </div>

      {/* School info */}
      {(!collapsed || mobileOpen) && (
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-medium text-slate-600 truncate">
              {schoolName}
            </span>
          </div>
          <Badge variant="success" className="mt-1.5 text-[10px]">
            Licencia Activa
          </Badge>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onMobileClose?.()}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {(!collapsed || mobileOpen) && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User section */}
      <div className="p-3">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg",
            collapsed && !mobileOpen ? "justify-center" : ""
          )}
        >
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          {(!collapsed || mobileOpen) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {userName}
              </p>
              <p className="text-xs text-slate-500 capitalize">{userRole}</p>
            </div>
          )}
        </div>

        {/* Collapse toggle — hidden on mobile overlay */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full mt-2 text-slate-400 hover:text-slate-600 hidden md:flex",
            collapsed ? "px-0 justify-center" : ""
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-xs">Colapsar</span>
            </>
          )}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen bg-white border-r border-blue-100 transition-all duration-300 ease-in-out sticky top-0 z-40",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onMobileClose} />
          <aside className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 flex flex-col md:hidden shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
