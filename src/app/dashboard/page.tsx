"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  GraduationCap,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  MoreHorizontal,
  Check,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { TopBar } from "@/components/layout/top-bar";
import { useMobileMenu } from "@/app/dashboard/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/data-context";

// Stat card component
function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string | number;
  change: string;
  changeType: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 sm:space-y-2 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">{title}</p>
            <p className="text-xl sm:text-3xl font-bold text-slate-900">{value}</p>
            <div className="flex items-center gap-1 flex-wrap">
              {changeType === "up" ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  changeType === "up" ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {change}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">vs mes anterior</span>
            </div>
          </div>
          <div
            className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl shrink-0 ${iconBg}`}
          >
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function DashboardPage() {
  const { stats, weeklyActivity, scoreDistribution, topStudents, classes, user, studentProgress } = useData();
  const router = useRouter();
  const { openMobileMenu } = useMobileMenu();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Compute module progress dynamically
  const modules = ["Introducción a la Robótica", "Sensores y Actuadores", "Programación de Bloques", "Circuitos Básicos", "Motores y Movimiento", "Programación Arduino", "Diseño Mecánico", "Control Remoto", "Proyecto Integrador", "Retos Avanzados", "IoT Básico", "Inteligencia Artificial"];
  const moduleProgress = modules.map((mod) => {
    const entries = studentProgress.filter((p) => p.moduleName === mod);
    return { moduleName: mod, avgScore: entries.length ? Math.round(entries.reduce((a, b) => a + b.score, 0) / entries.length) : 0, totalStudents: entries.length, completedCount: entries.filter((e) => e.status === "completed").length };
  });

  return (
    <div className="min-h-screen">
      <TopBar
        title="Dashboard"
        subtitle={`Bienvenido de vuelta, ${user.name}`}
        onMenuClick={openMobileMenu}
      />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* ─── Stats Grid ────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Estudiantes"
            value={stats.totalStudents}
            change="+12%"
            changeType="up"
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Clases Activas"
            value={stats.totalClasses}
            change="+2"
            changeType="up"
            icon={BookOpen}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatCard
            title="Promedio General"
            value={`${stats.averageScore}%`}
            change="+3.2%"
            changeType="up"
            icon={Trophy}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatCard
            title="Tasa de Completado"
            value={`${stats.completionRate}%`}
            change="-1.5%"
            changeType="down"
            icon={TrendingUp}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
          />
        </div>

        {/* ─── Charts Row ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Activity Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Actividad Semanal</CardTitle>
                  <CardDescription>
                    Estudiantes activos y módulos completados
                  </CardDescription>
                </div>
                <Badge variant="info">Esta semana</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={weeklyActivity}>
                  <defs>
                    <linearGradient
                      id="colorStudents"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorCompletions"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#colorStudents)"
                    name="Estudiantes"
                  />
                  <Area
                    type="monotone"
                    dataKey="completions"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#colorCompletions)"
                    name="Completados"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Puntajes</CardTitle>
              <CardDescription>Rango de calificaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                    name="Estudiantes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* ─── Bottom Row ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Progreso por Módulo</CardTitle>
                  <CardDescription>
                    Rendimiento promedio y completado por módulo
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moduleProgress.slice(0, 6).map((mod) => {
                  const completionPct =
                    mod.totalStudents > 0
                      ? Math.round((mod.completedCount / mod.totalStudents) * 100)
                      : 0;
                  return (
                    <div key={mod.moduleName} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">
                          {mod.moduleName}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">
                            {mod.completedCount}/{mod.totalStudents} completados
                          </span>
                          <Badge
                            variant={
                              mod.avgScore >= 80
                                ? "success"
                                : mod.avgScore >= 60
                                ? "warning"
                                : "danger"
                            }
                          >
                            {mod.avgScore}%
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={completionPct}
                        indicatorClassName={
                          completionPct >= 70
                            ? "bg-emerald-500"
                            : completionPct >= 40
                            ? "bg-amber-500"
                            : "bg-red-400"
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Students */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Estudiantes</CardTitle>
                  <CardDescription>Mejores puntajes generales</CardDescription>
                </div>
                <GraduationCap className="w-5 h-5 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topStudents.map((student, idx) => (
                  <div key={student.name} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-slate-600 shrink-0">
                      {idx + 1}
                    </div>
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {student.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {student.className}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-900">
                        {student.score}%
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {student.modules} módulos
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Recent Classes ────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mis Clases</CardTitle>
                <CardDescription>
                  Vista rápida de tus clases activas
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/classes")}>
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {classes.slice(0, 4).map((cls) => (
                <div
                  key={cls.classId}
                  className="group p-3 sm:p-4 rounded-xl border border-slate-200/60 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => router.push("/dashboard/classes")}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); router.push("/dashboard/classes"); }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    {cls.className}
                  </h4>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                    {cls.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500">
                        {cls.studentCount} estudiantes
                      </span>
                    </div>
                    <button
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
                      onClick={(e) => { e.stopPropagation(); handleCopyCode(cls.joinCode); }}
                    >
                      <span className="text-[10px] font-mono font-bold text-slate-600">
                        {cls.joinCode}
                      </span>
                      {copiedCode === cls.joinCode ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
