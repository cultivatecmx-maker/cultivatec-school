"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Class, StudentProgress } from "@/lib/types";
import {
  mockClasses as initialClasses,
  mockStudentProgress as initialProgress,
  mockUser as initialUser,
  mockSchool as initialSchool,
  mockStats,
  mockWeeklyActivity,
  mockModuleProgress as initialModuleProgress,
  mockTopStudents,
  mockScoreDistribution,
} from "@/lib/mock-data";

// ─── Toast state ────────────────────────────────────────

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

// ─── Context types ──────────────────────────────────────

interface DataContextType {
  // Classes
  classes: Class[];
  addClass: (cls: Omit<Class, "classId">) => void;
  updateClass: (classId: string, data: Partial<Class>) => void;
  deleteClass: (classId: string) => void;

  // Student progress
  studentProgress: StudentProgress[];
  updateStudentProgress: (studentId: string, moduleName: string, data: Partial<StudentProgress>) => void;
  addStudentProgress: (progress: StudentProgress) => void;
  deleteStudentProgress: (studentId: string, moduleName: string) => void;

  // User & School
  user: typeof initialUser;
  school: typeof initialSchool;
  updateUser: (data: Partial<typeof initialUser>) => void;
  updateSchool: (data: Partial<typeof initialSchool>) => void;

  // Read-only aggregated data
  stats: typeof mockStats;
  weeklyActivity: typeof mockWeeklyActivity;
  topStudents: typeof mockTopStudents;
  scoreDistribution: typeof mockScoreDistribution;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

// ─── Generate unique IDs ────────────────────────────────

let idCounter = 100;
function generateId(prefix: string) {
  idCounter++;
  return `${prefix}-${String(idCounter).padStart(3, "0")}`;
}

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ─── Provider ──────────────────────────────────────────

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useState<Class[]>([...initialClasses]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([...initialProgress]);
  const [user, setUser] = useState({ ...initialUser });
  const [school, setSchool] = useState({ ...initialSchool });
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast
  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Classes CRUD
  const addClass = useCallback((data: Omit<Class, "classId">) => {
    const newClass: Class = {
      ...data,
      classId: generateId("class"),
      joinCode: data.joinCode || generateJoinCode(),
      studentCount: data.studentCount || 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setClasses((prev) => [...prev, newClass]);
    showToast(`Clase "${newClass.className}" creada exitosamente`);
  }, [showToast]);

  const updateClass = useCallback((classId: string, data: Partial<Class>) => {
    setClasses((prev) =>
      prev.map((c) => (c.classId === classId ? { ...c, ...data } : c))
    );
    showToast("Clase actualizada exitosamente");
  }, [showToast]);

  const deleteClass = useCallback((classId: string) => {
    setClasses((prev) => prev.filter((c) => c.classId !== classId));
    setStudentProgress((prev) => prev.filter((p) => p.classId !== classId));
    showToast("Clase eliminada exitosamente");
  }, [showToast]);

  // Student Progress CRUD
  const updateStudentProgress = useCallback(
    (studentId: string, moduleName: string, data: Partial<StudentProgress>) => {
      setStudentProgress((prev) =>
        prev.map((p) =>
          p.studentId === studentId && p.moduleName === moduleName
            ? { ...p, ...data, lastUpdated: new Date().toISOString().split("T")[0] }
            : p
        )
      );
      showToast("Progreso del estudiante actualizado");
    },
    [showToast]
  );

  const addStudentProgress = useCallback(
    (progress: StudentProgress) => {
      setStudentProgress((prev) => [...prev, progress]);
      showToast("Progreso agregado exitosamente");
    },
    [showToast]
  );

  const deleteStudentProgress = useCallback(
    (studentId: string, moduleName: string) => {
      setStudentProgress((prev) =>
        prev.filter((p) => !(p.studentId === studentId && p.moduleName === moduleName))
      );
      showToast("Registro de progreso eliminado");
    },
    [showToast]
  );

  // User & School
  const updateUser = useCallback(
    (data: Partial<typeof initialUser>) => {
      setUser((prev) => ({ ...prev, ...data }));
      showToast("Perfil actualizado exitosamente");
    },
    [showToast]
  );

  const updateSchool = useCallback(
    (data: Partial<typeof initialSchool>) => {
      setSchool((prev) => ({ ...prev, ...data }));
      showToast("Información de la institución actualizada");
    },
    [showToast]
  );

  // Compute dynamic module progress
  const modules = [
    "Introducción a la Robótica",
    "Sensores y Actuadores",
    "Programación de Bloques",
    "Circuitos Básicos",
    "Motores y Movimiento",
    "Programación Arduino",
    "Diseño Mecánico",
    "Control Remoto",
    "Proyecto Integrador",
    "Retos Avanzados",
    "IoT Básico",
    "Inteligencia Artificial",
  ];

  const stats = {
    ...mockStats,
    totalClasses: classes.length,
    totalStudents: new Set(studentProgress.map((p) => p.studentId)).size,
  };

  return (
    <DataContext.Provider
      value={{
        classes,
        addClass,
        updateClass,
        deleteClass,
        studentProgress,
        updateStudentProgress,
        addStudentProgress,
        deleteStudentProgress,
        user,
        school,
        updateUser,
        updateSchool,
        stats,
        weeklyActivity: mockWeeklyActivity,
        topStudents: mockTopStudents,
        scoreDistribution: mockScoreDistribution,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}

      {/* Toast container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-in slide-in-from-right-5 fade-in duration-300 ${
                toast.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : toast.type === "error"
                  ? "bg-red-50 text-red-800 border-red-200"
                  : "bg-blue-50 text-blue-800 border-blue-200"
              }`}
            >
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 text-current opacity-50 hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
