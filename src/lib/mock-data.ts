import type {
  DashboardStats,
  Class,
  StudentProgress,
  ModuleProgress,
  WeeklyActivity,
  User,
  School,
} from "@/lib/types";

// ─── Mock User & School ──────────────────────────────────

export const mockUser: User = {
  uid: "teacher-001",
  name: "Prof. Abraham Doñastes",
  email: "abraham.donastes@roboticschool.edu",
  role: "admin",
  schoolId: "school-001",
  avatarUrl: "",
};

export const mockSchool: School = {
  schoolId: "school-001",
  name: "Instituto Tecnológico Monterrey",
  maxStudents: 200,
  licenseStatus: "active",
  createdAt: "2025-08-15",
};

// ─── Dashboard Stats ─────────────────────────────────────

export const mockStats: DashboardStats = {
  totalStudents: 147,
  totalClasses: 8,
  averageScore: 78.5,
  completionRate: 64,
  activeModules: 12,
  licenseDaysRemaining: 245,
};

// ─── Classes ─────────────────────────────────────────────

export const mockClasses: Class[] = [
  {
    classId: "class-001",
    className: "Robótica Básica - 3°A",
    teacherId: "teacher-001",
    schoolId: "school-001",
    joinCode: "RBT3A7",
    studentCount: 24,
    createdAt: "2025-09-01",
    description: "Introducción a la robótica y programación de bloques",
  },
  {
    classId: "class-002",
    className: "Programación Arduino - 4°B",
    teacherId: "teacher-001",
    schoolId: "school-001",
    joinCode: "ARD4B2",
    studentCount: 22,
    createdAt: "2025-09-01",
    description: "Programación de microcontroladores Arduino",
  },
  {
    classId: "class-003",
    className: "Electrónica Creativa - 5°A",
    teacherId: "teacher-001",
    schoolId: "school-001",
    joinCode: "ELC5A9",
    studentCount: 19,
    createdAt: "2025-09-01",
    description: "Circuitos y sensores para proyectos creativos",
  },
  {
    classId: "class-004",
    className: "Robótica Avanzada - 6°A",
    teacherId: "teacher-001",
    schoolId: "school-001",
    joinCode: "RAV6A3",
    studentCount: 18,
    createdAt: "2025-09-01",
    description: "Diseño y construcción de robots autónomos",
  },
  {
    classId: "class-005",
    className: "IoT y Sensores - 5°B",
    teacherId: "teacher-002",
    schoolId: "school-001",
    joinCode: "IOT5B1",
    studentCount: 21,
    createdAt: "2025-09-15",
    description: "Internet de las cosas y redes de sensores",
  },
  {
    classId: "class-006",
    className: "Pensamiento Computacional - 2°A",
    teacherId: "teacher-002",
    schoolId: "school-001",
    joinCode: "PCT2A5",
    studentCount: 26,
    createdAt: "2025-09-15",
    description: "Fundamentos de lógica y programación visual",
  },
  {
    classId: "class-007",
    className: "Diseño 3D - 4°A",
    teacherId: "teacher-001",
    schoolId: "school-001",
    joinCode: "D3D4A8",
    studentCount: 17,
    createdAt: "2025-10-01",
    description: "Modelado e impresión 3D para robótica",
  },
  {
    classId: "class-008",
    className: "Mecatrónica Jr - 3°B",
    teacherId: "teacher-001",
    schoolId: "school-001",
    joinCode: "MCT3B4",
    studentCount: 20,
    createdAt: "2025-10-01",
    description: "Introducción a sistemas mecatrónicos",
  },
];

// ─── Student Progress ────────────────────────────────────

const studentNames = [
  "Carlos Mendoza",
  "Ana Sofía López",
  "Diego Ramírez",
  "Valentina Torres",
  "Sebastián Flores",
  "Isabella García",
  "Mateo Hernández",
  "Camila Morales",
  "Santiago Cruz",
  "Luciana Vargas",
  "Emilio Castillo",
  "Regina Ortiz",
  "Daniel Peña",
  "Mariana Ríos",
  "Andrés Navarro",
  "Paula Guerrero",
  "Nicolás Campos",
  "Renata Medina",
  "Alejandro Vega",
  "Gabriela Reyes",
  "Fernando Silva",
  "Ximena Aguilar",
  "Tomás Herrera",
  "Victoria Jiménez",
];

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

export const mockStudentProgress: StudentProgress[] = studentNames.flatMap(
  (name, idx) =>
    modules.slice(0, Math.floor(Math.random() * 6) + 3).map((mod, modIdx) => ({
      studentId: `student-${String(idx + 1).padStart(3, "0")}`,
      studentName: name,
      classId: mockClasses[idx % 4].classId,
      moduleName: mod,
      score: Math.floor(Math.random() * 40) + 60,
      status: (modIdx < Math.floor(Math.random() * 4) + 1
        ? "completed"
        : modIdx === Math.floor(Math.random() * 4) + 1
        ? "in_progress"
        : "not_started") as StudentProgress["status"],
      lastUpdated: `2026-02-${String(Math.floor(Math.random() * 18) + 1).padStart(2, "0")}`,
    }))
);

// ─── Module Progress (aggregated) ────────────────────────

export const mockModuleProgress: ModuleProgress[] = modules.map((mod) => {
  const entries = mockStudentProgress.filter((p) => p.moduleName === mod);
  return {
    moduleName: mod,
    avgScore: entries.length
      ? Math.round(entries.reduce((a, b) => a + b.score, 0) / entries.length)
      : 0,
    totalStudents: entries.length,
    completedCount: entries.filter((e) => e.status === "completed").length,
  };
});

// ─── Weekly Activity ─────────────────────────────────────

export const mockWeeklyActivity: WeeklyActivity[] = [
  { day: "Lun", students: 89, completions: 12 },
  { day: "Mar", students: 102, completions: 18 },
  { day: "Mié", students: 95, completions: 15 },
  { day: "Jue", students: 110, completions: 22 },
  { day: "Vie", students: 78, completions: 9 },
  { day: "Sáb", students: 34, completions: 4 },
  { day: "Dom", students: 12, completions: 1 },
];

// ─── Score Distribution ──────────────────────────────────

export const mockScoreDistribution = [
  { range: "0-20", count: 2 },
  { range: "21-40", count: 5 },
  { range: "41-60", count: 18 },
  { range: "61-80", count: 67 },
  { range: "81-100", count: 55 },
];

// ─── Top Students ─────────────────────────────────────────

export const mockTopStudents = [
  { name: "Valentina Torres", score: 96, modules: 8, className: "Robótica Básica - 3°A" },
  { name: "Mateo Hernández", score: 94, modules: 7, className: "Programación Arduino - 4°B" },
  { name: "Ana Sofía López", score: 92, modules: 9, className: "Robótica Básica - 3°A" },
  { name: "Santiago Cruz", score: 91, modules: 7, className: "Electrónica Creativa - 5°A" },
  { name: "Isabella García", score: 89, modules: 6, className: "Robótica Avanzada - 6°A" },
];
