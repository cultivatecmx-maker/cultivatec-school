// Firestore document types for CultivaTec Schools multi-tenant architecture

export interface School {
  schoolId: string;
  name: string;
  maxStudents: number;
  licenseStatus: "active" | "trial" | "expired" | "suspended";
  createdAt?: string;
  logoUrl?: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: "teacher" | "admin";
  schoolId: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Class {
  classId: string;
  className: string;
  teacherId: string;
  schoolId: string;
  joinCode: string;
  studentCount?: number;
  createdAt?: string;
  description?: string;
}

export interface StudentProgress {
  studentId: string;
  studentName?: string;
  classId: string;
  moduleName: string;
  score: number;
  status: "not_started" | "in_progress" | "completed";
  lastUpdated?: string;
}

// Dashboard summary types
export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  averageScore: number;
  completionRate: number;
  activeModules: number;
  licenseDaysRemaining: number;
}

export interface ModuleProgress {
  moduleName: string;
  avgScore: number;
  totalStudents: number;
  completedCount: number;
}

export interface WeeklyActivity {
  day: string;
  students: number;
  completions: number;
}
