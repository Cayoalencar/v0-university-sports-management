"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Student } from "./types"

interface StudentsContextType {
  students: Student[]
  addStudent: (student: Omit<Student, "id" | "createdAt">) => void
  updateStudent: (id: string, data: Partial<Omit<Student, "id" | "createdAt">>) => void
  getStudentByMatricula: (matricula: string) => Student | undefined
  getStudentByCpf: (cpf: string) => Student | undefined
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined)

const initialStudents: Student[] = [
  {
    id: "1",
    nome: "Carlos Eduardo Silva",
    matricula: "2024001",
    tipo: "estudante",
    vencimentoAtestado: "2026-06-15",
    createdAt: "2025-03-01",
  },
  {
    id: "2",
    nome: "Ana Beatriz Oliveira",
    matricula: "2024002",
    tipo: "estudante",
    vencimentoAtestado: "2026-03-20",
    createdAt: "2025-03-02",
  },
  {
    id: "3",
    nome: "Lucas Ferreira Santos",
    matricula: "2024003",
    tipo: "estudante",
    vencimentoAtestado: "2025-12-10",
    createdAt: "2025-03-03",
  },
  {
    id: "4",
    nome: "Mariana Costa Lima",
    matricula: "",
    cpf: "123.456.789-00",
    tipo: "natacao",
    vencimentoAtestado: "2026-08-01",
    createdAt: "2025-04-10",
  },
  {
    id: "5",
    nome: "Roberto Almeida Souza",
    matricula: "",
    cpf: "987.654.321-00",
    tipo: "natacao",
    vencimentoAtestado: "2025-11-20",
    createdAt: "2025-04-12",
  },
]

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(initialStudents)

  function addStudent(data: Omit<Student, "id" | "createdAt">) {
    const newStudent: Student = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setStudents((prev) => [...prev, newStudent])
  }

  function updateStudent(id: string, data: Partial<Omit<Student, "id" | "createdAt">>) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    )
  }

  function getStudentByMatricula(matricula: string) {
    return students.find((s) => s.matricula === matricula)
  }

  function getStudentByCpf(cpf: string) {
    return students.find((s) => s.cpf === cpf)
  }

  return (
    <StudentsContext.Provider value={{ students, addStudent, updateStudent, getStudentByMatricula, getStudentByCpf }}>
      {children}
    </StudentsContext.Provider>
  )
}

export function useStudents() {
  const context = useContext(StudentsContext)
  if (!context) {
    throw new Error("useStudents must be used within a StudentsProvider")
  }
  return context
}
