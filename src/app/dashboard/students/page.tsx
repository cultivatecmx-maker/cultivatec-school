"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Users,
  Award,
  BookOpen,
  AlertCircle,
  Pencil,
  X,
  ChevronRight,
  Save,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { TopBar } from "@/components/layout/top-bar";
import { useMobileMenu } from "@/app/dashboard/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useData } from "@/context/data-context";

type AggregatedStudent = {
  studentId: string;
  name: string;
  classId: string;
  className: string;
  totalModules: number;
  completedModules: number;
  avgScore: number;
  scores: number[];
};

/* ── Student Detail Dialog ─────────────────────────────── */

function StudentDetailDialog({
  open,
  onOpenChange,
  student,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: AggregatedStudent | null;
}) {
  const { studentProgress, updateStudentProgress, classes } = useData();
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editScore, setEditScore] = useState(0);
  const [editStatus, setEditStatus] = useState<string>("completed");

  if (!student) return null;

  const modules = studentProgress.filter((p) => p.studentId === student.studentId);

  const handleSaveModule = (moduleName: string) => {
    updateStudentProgress(student.studentId, moduleName, {
      score: Math.max(0, Math.min(100, editScore)),
      status: editStatus as "completed" | "in_progress" | "not_started",
    });
    setEditingModule(null);
  };

  const startEdit = (mod: { moduleName: string; score: number; status: string }) => {
    setEditingModule(mod.moduleName);
    setEditScore(mod.score);
    setEditStatus(mod.status);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-sm bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{student.name}</DialogTitle>
              <DialogDescription>{student.className}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-blue-50 text-center">
            <p className="text-xl font-bold text-blue-700">{student.avgScore}%</p>
            <p className="text-[11px] text-blue-500">Promedio</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-center">
            <p className="text-xl font-bold text-emerald-700">{student.completedModules}/{student.totalModules}</p>
            <p className="text-[11px] text-emerald-500">Módulos</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-center">
            <p className="text-xl font-bold text-amber-700">
              {student.totalModules > 0 ? Math.round((student.completedModules / student.totalModules) * 100) : 0}%
            </p>
            <p className="text-[11px] text-amber-500">Progreso</p>
          </div>
        </div>

        {/* Module list */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700">Detalle por Módulo</h4>
          <div className="space-y-2">
            {modules.map((mod) => (
              <div key={mod.moduleName} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                {editingModule === mod.moduleName ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-900">{mod.moduleName}</p>
                    <div className="flex items-center gap-3">
                      <div className="space-y-1 flex-1">
                        <label className="text-xs text-slate-500">Puntaje</label>
                        <Input type="number" min={0} max={100} value={editScore} onChange={(e) => setEditScore(Number(e.target.value))} className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <label className="text-xs text-slate-500">Estado</label>
                        <select className="h-8 w-full px-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                          <option value="completed">Completado</option>
                          <option value="in_progress">En progreso</option>
                          <option value="not_started">No iniciado</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingModule(null)}><X className="w-3.5 h-3.5 mr-1" />Cancelar</Button>
                      <Button size="sm" onClick={() => handleSaveModule(mod.moduleName)}><Save className="w-3.5 h-3.5 mr-1" />Guardar</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{mod.moduleName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={mod.status === "completed" ? "success" : mod.status === "in_progress" ? "info" : "default"} className="text-[10px]">
                          {mod.status === "completed" ? "Completado" : mod.status === "in_progress" ? "En progreso" : "No iniciado"}
                        </Badge>
                        {mod.lastUpdated && <span className="text-[10px] text-slate-400">{mod.lastUpdated}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${mod.score >= 80 ? "text-emerald-600" : mod.score >= 60 ? "text-amber-600" : "text-red-500"}`}>{mod.score}%</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-600" onClick={() => startEdit(mod)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main Page ────────────────────────────────────────── */

export default function StudentsPage() {
  const { studentProgress, classes } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<AggregatedStudent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Aggregate student data from context
  const students = useMemo(() => {
    const map = new Map<string, { studentId: string; name: string; classId: string; className: string; totalModules: number; completedModules: number; avgScore: number; scores: number[] }>();
    for (const p of studentProgress) {
      const key = p.studentId;
      if (!map.has(key)) {
        const cls = classes.find((c) => c.classId === p.classId);
        map.set(key, { studentId: p.studentId, name: p.studentName || p.studentId, classId: p.classId, className: cls?.className || "—", totalModules: 0, completedModules: 0, avgScore: 0, scores: [] });
      }
      const entry = map.get(key)!;
      entry.totalModules++;
      if (p.status === "completed") entry.completedModules++;
      entry.scores.push(p.score);
    }
    return Array.from(map.values()).map((s) => ({ ...s, avgScore: s.scores.length > 0 ? Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length) : 0 }));
  }, [studentProgress, classes]);

  // Module progress aggregated
  const moduleProgress = useMemo(() => {
    const modules = ["Introducción a la Robótica", "Sensores y Actuadores", "Programación de Bloques", "Circuitos Básicos", "Motores y Movimiento", "Programación Arduino", "Diseño Mecánico", "Control Remoto", "Proyecto Integrador", "Retos Avanzados", "IoT Básico", "Inteligencia Artificial"];
    return modules.map((mod) => {
      const entries = studentProgress.filter((p) => p.moduleName === mod);
      return { moduleName: mod, avgScore: entries.length ? Math.round(entries.reduce((a, b) => a + b.score, 0) / entries.length) : 0, totalStudents: entries.length, completedCount: entries.filter((e) => e.status === "completed").length };
    });
  }, [studentProgress]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass === "all" || s.classId === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, selectedClass]);

  const atRiskStudents = filtered.filter((s) => s.avgScore < 60);
  const topStudentsCount = filtered.filter((s) => s.avgScore >= 90).length;

  const handleRowClick = (student: AggregatedStudent) => {
    setSelectedStudent(student);
    setDetailOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ["Nombre", "Clase", "Módulos Completados", "Total Módulos", "Promedio"];
    const rows = filtered.map((s) => [s.name, s.className, s.completedModules, s.totalModules, s.avgScore]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "estudiantes.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const { openMobileMenu } = useMobileMenu();

  return (
    <div className="min-h-screen">
      <TopBar title="Estudiantes" subtitle="Seguimiento del progreso de tus estudiantes" onMenuClick={openMobileMenu} />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50"><Users className="w-5 h-5 text-blue-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{students.length}</p><p className="text-sm text-slate-500">Total estudiantes</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50"><Award className="w-5 h-5 text-emerald-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{topStudentsCount}</p><p className="text-sm text-slate-500">Estudiantes destacados</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50"><BookOpen className="w-5 h-5 text-amber-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{students.length > 0 ? Math.round(students.reduce((a, b) => a + b.avgScore, 0) / students.length) : 0}%</p><p className="text-sm text-slate-500">Promedio general</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-50"><AlertCircle className="w-5 h-5 text-red-500" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{atRiskStudents.length}</p><p className="text-sm text-slate-500">Necesitan atención</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Buscar estudiante..." className="pl-9 bg-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <select className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="all">Todas las clases</option>
              {classes.map((cls) => (<option key={cls.classId} value={cls.classId}>{cls.className}</option>))}
            </select>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">Tabla</TabsTrigger>
            <TabsTrigger value="modules">Por Módulo</TabsTrigger>
          </TabsList>

          {/* Table View */}
          <TabsContent value="table">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estudiante</th>
                        <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Clase</th>
                        <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Módulos</th>
                        <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progreso</th>
                        <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Promedio</th>
                        <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                        <th className="px-3 py-3.5"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filtered.map((student) => {
                        const progressPct = student.totalModules > 0 ? Math.round((student.completedModules / student.totalModules) * 100) : 0;
                        return (
                          <tr key={student.studentId} className="hover:bg-blue-50/30 transition-colors cursor-pointer group" onClick={() => handleRowClick(student)}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-400 to-blue-600 text-white">{student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                                <span className="text-sm font-medium text-slate-900">{student.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4"><span className="text-sm text-slate-600">{student.className}</span></td>
                            <td className="px-6 py-4 text-center"><span className="text-sm text-slate-700">{student.completedModules}/{student.totalModules}</span></td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 justify-center">
                                <Progress value={progressPct} className="w-20 h-2" indicatorClassName={progressPct >= 70 ? "bg-emerald-500" : progressPct >= 40 ? "bg-amber-500" : "bg-red-400"} />
                                <span className="text-xs text-slate-500 w-10">{progressPct}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`text-sm font-semibold ${student.avgScore >= 80 ? "text-emerald-600" : student.avgScore >= 60 ? "text-amber-600" : "text-red-500"}`}>{student.avgScore}%</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {student.avgScore >= 80 ? <Badge variant="success">Excelente</Badge> : student.avgScore >= 60 ? <Badge variant="warning">Regular</Badge> : <Badge variant="danger">En riesgo</Badge>}
                            </td>
                            <td className="px-3 py-4">
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Search className="w-10 h-10 mb-3" />
                    <p className="text-sm font-medium">No se encontraron estudiantes</p>
                    <p className="text-xs">Intenta con otra búsqueda</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Module View */}
          <TabsContent value="modules">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Módulo</CardTitle>
                <CardDescription>Promedio de calificación por módulo de todos los estudiantes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={moduleProgress} layout="vertical" margin={{ left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={{ stroke: "#E2E8F0" }} />
                    <YAxis dataKey="moduleName" type="category" tick={{ fontSize: 11, fill: "#64748B" }} width={180} axisLine={{ stroke: "#E2E8F0" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    <Bar dataKey="avgScore" fill="#3B82F6" radius={[0, 6, 6, 0]} name="Puntaje Promedio" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Student Detail Dialog */}
      <StudentDetailDialog open={detailOpen} onOpenChange={setDetailOpen} student={selectedStudent} />
    </div>
  );
}
