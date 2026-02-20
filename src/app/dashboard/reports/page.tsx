"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Download,
  FileText,
  TrendingUp,
  Calendar,
  Loader2,
} from "lucide-react";

import { TopBar } from "@/components/layout/top-bar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/context/data-context";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];

const monthlyTrend = [
  { month: "Sep", students: 80, avgScore: 65 },
  { month: "Oct", students: 102, avgScore: 68 },
  { month: "Nov", students: 118, avgScore: 72 },
  { month: "Dic", students: 125, avgScore: 71 },
  { month: "Ene", students: 138, avgScore: 75 },
  { month: "Feb", students: 147, avgScore: 78 },
];

export default function ReportsPage() {
  const { classes, studentProgress, scoreDistribution, showToast } = useData();
  const [loadingPdf, setLoadingPdf] = React.useState(false);
  const [loadingExcel, setLoadingExcel] = React.useState(false);

  // Compute module progress dynamically
  const modules = ["Introducción a la Robótica", "Sensores y Actuadores", "Programación de Bloques", "Circuitos Básicos", "Motores y Movimiento", "Programación Arduino", "Diseño Mecánico", "Control Remoto", "Proyecto Integrador", "Retos Avanzados", "IoT Básico", "Inteligencia Artificial"];
  const moduleProgress = useMemo(() => modules.map((mod) => {
    const entries = studentProgress.filter((p) => p.moduleName === mod);
    return {
      moduleName: mod,
      avgScore: entries.length ? Math.round(entries.reduce((a, b) => a + b.score, 0) / entries.length) : 0,
      totalStudents: entries.length,
      completedCount: entries.filter((e) => e.status === "completed").length,
    };
  }), [studentProgress]);

  // Compute status distribution dynamically
  const statusData = useMemo(() => {
    const total = studentProgress.length || 1;
    const completed = studentProgress.filter((p) => p.status === "completed").length;
    const inProgress = studentProgress.filter((p) => p.status === "in_progress").length;
    const notStarted = studentProgress.filter((p) => p.status === "not_started").length;
    return [
      { name: "Completado", value: Math.round((completed / total) * 100), color: "#10B981" },
      { name: "En Progreso", value: Math.round((inProgress / total) * 100), color: "#3B82F6" },
      { name: "No Iniciado", value: Math.round((notStarted / total) * 100), color: "#E2E8F0" },
    ];
  }, [studentProgress]);

  const handleExportPdf = async () => {
    setLoadingPdf(true);
    // Simulate PDF generation
    await new Promise((r) => setTimeout(r, 1500));

    // Build a simple text report
    let content = "REPORTE CULTIVATEC SCHOOLS\\n";
    content += "=".repeat(40) + "\\n\\n";
    content += "RESUMEN POR MÓDULO\\n";
    content += "-".repeat(40) + "\\n";
    moduleProgress.forEach((mod) => {
      const rate = mod.totalStudents > 0 ? Math.round((mod.completedCount / mod.totalStudents) * 100) : 0;
      content += `${mod.moduleName}: ${mod.totalStudents} estudiantes, ${mod.completedCount} completaron (${rate}%), Promedio: ${mod.avgScore}%\\n`;
    });
    content += "\\n\\nCLASES\\n";
    content += "-".repeat(40) + "\\n";
    classes.forEach((cls) => {
      content += `${cls.className}: ${cls.studentCount} estudiantes, Código: ${cls.joinCode}\\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-cultivatec-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setLoadingPdf(false);
    showToast("Reporte generado y descargado exitosamente", "success");
  };

  const handleExportExcel = async () => {
    setLoadingExcel(true);
    await new Promise((r) => setTimeout(r, 1000));

    // Generate CSV
    const headers = ["Módulo", "Estudiantes", "Completaron", "Tasa (%)", "Promedio (%)"];
    const rows = moduleProgress.map((mod) => {
      const rate = mod.totalStudents > 0 ? Math.round((mod.completedCount / mod.totalStudents) * 100) : 0;
      return [mod.moduleName, mod.totalStudents, mod.completedCount, rate, mod.avgScore];
    });

    let csv = headers.join(",") + "\\n";
    rows.forEach((row) => {
      csv += row.join(",") + "\\n";
    });

    // Add classes section
    csv += "\\n\\nClase,Estudiantes,Código de Acceso\\n";
    classes.forEach((cls) => {
      csv += `"${cls.className}",${cls.studentCount},${cls.joinCode}\\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-cultivatec-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setLoadingExcel(false);
    showToast("Archivo CSV exportado exitosamente", "success");
  };

  return (
    <div className="min-h-screen">
      <TopBar
        title="Reportes"
        subtitle="Análisis detallado del rendimiento de tu escuela"
      />

      <div className="p-6 space-y-6">
        {/* ─── Actions ────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="info" className="gap-1">
              <Calendar className="w-3 h-3" />
              Febrero 2026
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPdf} disabled={loadingPdf}>
              {loadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {loadingPdf ? "Generando..." : "Generar Reporte"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExportExcel} disabled={loadingExcel}>
              {loadingExcel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {loadingExcel ? "Exportando..." : "Exportar CSV"}
            </Button>
          </div>
        </div>

        {/* ─── Charts Row 1 ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Tendencia Mensual
              </CardTitle>
              <CardDescription>
                Evolución de estudiantes activos y puntaje promedio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
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
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="students"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Estudiantes"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgScore"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Promedio (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Módulos</CardTitle>
              <CardDescription>
                Distribución por estado de completado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {statusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.value}% de módulos
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Charts Row 2 ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students per Class */}
          <Card>
            <CardHeader>
              <CardTitle>Estudiantes por Clase</CardTitle>
              <CardDescription>
                Distribución de estudiantes en cada clase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={classes.map((c) => ({
                    name: c.className.split(" - ")[0],
                    students: c.studentCount || 0,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#94A3B8" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
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
                  <Bar dataKey="students" name="Estudiantes" radius={[6, 6, 0, 0]}>
                    {classes.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Calificaciones</CardTitle>
              <CardDescription>
                Histograma de puntajes de todos los estudiantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="range"
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
                  <Bar
                    dataKey="count"
                    fill="#8B5CF6"
                    radius={[6, 6, 0, 0]}
                    name="Estudiantes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* ─── Module Performance Table ──────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle por Módulo</CardTitle>
            <CardDescription>
              Rendimiento detallado de cada módulo del programa
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Módulo
                    </th>
                    <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Estudiantes
                    </th>
                    <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Completaron
                    </th>
                    <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Tasa
                    </th>
                    <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Promedio
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {moduleProgress.map((mod) => {
                    const rate =
                      mod.totalStudents > 0
                        ? Math.round(
                            (mod.completedCount / mod.totalStudents) * 100
                          )
                        : 0;
                    return (
                      <tr
                        key={mod.moduleName}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {mod.moduleName}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 text-center">
                          {mod.totalStudents}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 text-center">
                          {mod.completedCount}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge
                            variant={
                              rate >= 70
                                ? "success"
                                : rate >= 40
                                ? "warning"
                                : "danger"
                            }
                          >
                            {rate}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`text-sm font-semibold ${
                              mod.avgScore >= 80
                                ? "text-emerald-600"
                                : mod.avgScore >= 60
                                ? "text-amber-600"
                                : "text-red-500"
                            }`}
                          >
                            {mod.avgScore}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
