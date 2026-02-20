"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Plus,
  Users,
  Copy,
  Search,
  Pencil,
  Trash2,
  Eye,
  Check,
  GraduationCap,
  Calendar,
  Hash,
} from "lucide-react";

import { TopBar } from "@/components/layout/top-bar";
import { useMobileMenu } from "@/app/dashboard/layout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useData } from "@/context/data-context";
import type { Class } from "@/lib/types";

/* ── Create / Edit Dialog ─────────────────────────────── */

function ClassFormDialog({
  open,
  onOpenChange,
  editClass,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editClass?: Class | null;
}) {
  const { addClass, updateClass } = useData();
  const isEdit = !!editClass;

  const [name, setName] = useState(editClass?.className || "");
  const [description, setDescription] = useState(editClass?.description || "");

  React.useEffect(() => {
    if (open) {
      setName(editClass?.className || "");
      setDescription(editClass?.description || "");
    }
  }, [open, editClass]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (isEdit && editClass) {
      updateClass(editClass.classId, { className: name.trim(), description: description.trim() });
    } else {
      addClass({ className: name.trim(), description: description.trim(), teacherId: "teacher-001", schoolId: "school-001", joinCode: "", studentCount: 0 });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Clase" : "Nueva Clase"}</DialogTitle>
          <DialogDescription>{isEdit ? "Modifica los datos de la clase" : "Crea una nueva clase y comparte el código con tus estudiantes"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nombre de la clase *</label>
            <Input placeholder="Ej: Robótica Básica - 3°A" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Descripción</label>
            <Textarea placeholder="Describe brevemente el contenido de la clase..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={!name.trim()}>{isEdit ? "Guardar Cambios" : "Crear Clase"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ── Delete Confirmation ──────────────────────────────── */

function DeleteClassDialog({ open, onOpenChange, cls }: { open: boolean; onOpenChange: (open: boolean) => void; cls: Class | null }) {
  const { deleteClass } = useData();
  const handleDelete = () => { if (cls) { deleteClass(cls.classId); onOpenChange(false); } };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-red-600">Eliminar Clase</DialogTitle>
          <DialogDescription>¿Estás seguro de que deseas eliminar <strong>{cls?.className}</strong>? Esta acción no se puede deshacer.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-1.5" />Eliminar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Class Detail Dialog ──────────────────────────────── */

function ClassDetailDialog({ open, onOpenChange, cls }: { open: boolean; onOpenChange: (open: boolean) => void; cls: Class | null }) {
  const { studentProgress } = useData();
  if (!cls) return null;

  const classProgress = studentProgress.filter((p) => p.classId === cls.classId);
  const uniqueStudents = new Set(classProgress.map((p) => p.studentId));
  const avgScore = classProgress.length > 0 ? Math.round(classProgress.reduce((a, b) => a + b.score, 0) / classProgress.length) : 0;
  const completed = classProgress.filter((p) => p.status === "completed").length;
  const completionRate = classProgress.length > 0 ? Math.round((completed / classProgress.length) * 100) : 0;

  const studentMap = new Map<string, { name: string; scores: number[]; completed: number; total: number }>();
  for (const p of classProgress) {
    if (!studentMap.has(p.studentId)) studentMap.set(p.studentId, { name: p.studentName || p.studentId, scores: [], completed: 0, total: 0 });
    const entry = studentMap.get(p.studentId)!;
    entry.scores.push(p.score);
    entry.total++;
    if (p.status === "completed") entry.completed++;
  }
  const studentList = Array.from(studentMap.entries()).map(([id, d]) => ({
    studentId: id, name: d.name,
    avgScore: d.scores.length > 0 ? Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length) : 0,
    completed: d.completed, total: d.total,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100"><BookOpen className="w-5 h-5 text-blue-600" /></div>
            <div><DialogTitle>{cls.className}</DialogTitle><DialogDescription>{cls.description}</DialogDescription></div>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-blue-50 text-center"><p className="text-xl font-bold text-blue-700">{uniqueStudents.size}</p><p className="text-[11px] text-blue-500">Estudiantes</p></div>
          <div className="p-3 rounded-xl bg-emerald-50 text-center"><p className="text-xl font-bold text-emerald-700">{avgScore}%</p><p className="text-[11px] text-emerald-500">Promedio</p></div>
          <div className="p-3 rounded-xl bg-amber-50 text-center"><p className="text-xl font-bold text-amber-700">{completionRate}%</p><p className="text-[11px] text-amber-500">Completado</p></div>
          <div className="p-3 rounded-xl bg-slate-50 text-center"><p className="text-xl font-bold text-slate-700">{cls.joinCode}</p><p className="text-[11px] text-slate-500">Código</p></div>
        </div>
        {studentList.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700">Estudiantes en esta clase</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {studentList.sort((a, b) => b.avgScore - a.avgScore).map((s) => {
                const pct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
                return (
                  <div key={s.studentId} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-400 to-blue-600 text-white">{s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{s.name}</p>
                      <div className="flex items-center gap-2 mt-1"><Progress value={pct} className="w-20 h-1.5" indicatorClassName={pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-red-400"} /><span className="text-[10px] text-slate-400">{s.completed}/{s.total}</span></div>
                    </div>
                    <p className={`text-sm font-bold ${s.avgScore >= 80 ? "text-emerald-600" : s.avgScore >= 60 ? "text-amber-600" : "text-red-500"}`}>{s.avgScore}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400"><Users className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">No hay estudiantes en esta clase aún</p></div>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" /><span>Creada el {cls.createdAt || "—"}</span><span>·</span><Hash className="w-3.5 h-3.5" /><span>{cls.classId}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main Page ────────────────────────────────────────── */

export default function ClassesPage() {
  const { classes } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editClass, setEditClass] = useState<Class | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Class | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailClass, setDetailClass] = useState<Class | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredClasses = useMemo(() => classes.filter((cls) => cls.className.toLowerCase().includes(searchQuery.toLowerCase()) || cls.joinCode.toLowerCase().includes(searchQuery.toLowerCase())), [classes, searchQuery]);

  const handleCopyCode = (code: string) => { navigator.clipboard.writeText(code); setCopiedCode(code); setTimeout(() => setCopiedCode(null), 2000); };
  const handleEdit = (cls: Class) => { setEditClass(cls); setEditDialogOpen(true); };
  const handleDelete = (cls: Class) => { setDeleteTarget(cls); setDeleteDialogOpen(true); };
  const handleViewDetail = (cls: Class) => { setDetailClass(cls); setDetailDialogOpen(true); };

  const { openMobileMenu } = useMobileMenu();

  return (
    <div className="min-h-screen">
      <TopBar title="Mis Clases" subtitle="Gestiona tus clases y códigos de acceso" onMenuClick={openMobileMenu} />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar por nombre o código..." className="pl-9 bg-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button className="gap-2 shrink-0" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Nueva Clase
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50"><BookOpen className="w-5 h-5 text-blue-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{classes.length}</p><p className="text-sm text-slate-500">Clases totales</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50"><Users className="w-5 h-5 text-emerald-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{classes.reduce((a, b) => a + (b.studentCount || 0), 0)}</p><p className="text-sm text-slate-500">Estudiantes totales</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50"><GraduationCap className="w-5 h-5 text-amber-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{classes.length > 0 ? Math.round(classes.reduce((a, b) => a + (b.studentCount || 0), 0) / classes.length) : 0}</p><p className="text-sm text-slate-500">Promedio por clase</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClasses.map((cls) => (
            <Card key={cls.classId} className="group hover:shadow-lg transition-all duration-200">
              <CardContent className="p-0">
                <div className="h-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-t-xl" />
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 shrink-0"><BookOpen className="w-5 h-5 text-blue-600" /></div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">{cls.className}</h3>
                        <p className="text-xs text-slate-500 truncate">{cls.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /><span className="text-sm text-slate-600">{cls.studentCount} estudiantes</span></div>
                    <Badge variant="info" className="text-[10px]">Activa</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Código de acceso</p>
                      <p className="text-lg font-mono font-bold text-slate-800 tracking-widest">{cls.joinCode}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-slate-500 hover:text-blue-600" onClick={() => handleCopyCode(cls.joinCode)}>
                      {copiedCode === cls.joinCode ? (<><Check className="w-4 h-4 text-emerald-600" /><span className="text-xs text-emerald-600">Copiado</span></>) : (<><Copy className="w-4 h-4" /><span className="text-xs">Copiar</span></>)}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => handleViewDetail(cls)}><Eye className="w-3.5 h-3.5" />Ver Detalle</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600" onClick={() => handleEdit(cls)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => handleDelete(cls)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Class Card */}
          <Card className="border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer" onClick={() => setCreateDialogOpen(true)}>
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] gap-3">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50"><Plus className="w-7 h-7 text-blue-500" /></div>
              <p className="text-sm font-medium text-slate-600">Crear nueva clase</p>
              <p className="text-xs text-slate-400 text-center max-w-[200px]">Agrega una nueva clase y comparte el código de acceso con tus estudiantes</p>
            </CardContent>
          </Card>
        </div>

        {filteredClasses.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Search className="w-10 h-10 mb-3" />
            <p className="text-sm font-medium">No se encontraron clases</p>
            <p className="text-xs">Intenta con otra búsqueda</p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ClassFormDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} editClass={null} />
      <ClassFormDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} editClass={editClass} />
      <DeleteClassDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} cls={deleteTarget} />
      <ClassDetailDialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen} cls={detailClass} />
    </div>
  );
}
