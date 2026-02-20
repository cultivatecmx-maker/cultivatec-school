import {
  collection,
  getDocs,
  query,
  where,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Class, StudentProgress } from "@/lib/types";

// ─── Classes ─────────────────────────────────────────────

export async function getClassesByTeacher(teacherId: string): Promise<Class[]> {
  const q = query(
    collection(db, "classes"),
    where("teacherId", "==", teacherId),
    orderBy("className")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data(), classId: doc.id } as Class));
}

export async function getClassesBySchool(schoolId: string): Promise<Class[]> {
  const q = query(
    collection(db, "classes"),
    where("schoolId", "==", schoolId),
    orderBy("className")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data(), classId: doc.id } as Class));
}

export async function createClass(data: Omit<Class, "classId">): Promise<string> {
  const docRef = await addDoc(collection(db, "classes"), data);
  return docRef.id;
}

export async function updateClass(classId: string, data: Partial<Class>): Promise<void> {
  await updateDoc(doc(db, "classes", classId), data);
}

export async function deleteClass(classId: string): Promise<void> {
  await deleteDoc(doc(db, "classes", classId));
}

// ─── Student Progress ────────────────────────────────────

export async function getProgressByClass(classId: string): Promise<StudentProgress[]> {
  const q = query(
    collection(db, "studentProgress"),
    where("classId", "==", classId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as StudentProgress);
}

export async function getProgressByStudent(studentId: string): Promise<StudentProgress[]> {
  const q = query(
    collection(db, "studentProgress"),
    where("studentId", "==", studentId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as StudentProgress);
}

// ─── Utilities ───────────────────────────────────────────

export function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
