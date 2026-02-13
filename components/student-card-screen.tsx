"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useStudents } from "@/lib/students-context"
import { Search, User, GraduationCap, CalendarClock, ShieldCheck, ShieldAlert, Activity } from "lucide-react"
import type { Student } from "@/lib/types"

function isAtestadoValido(vencimento: string) {
  return new Date(vencimento) >= new Date()
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function StudentCardView({ student }: { student: Student }) {
  const valido = isAtestadoValido(student.vencimentoAtestado)

  return (
    <div className="mx-auto w-full max-w-sm">
      <Card className="overflow-hidden border-0 shadow-xl">
        {/* Card Header - green/blue gradient-like top stripe */}
        <div className="relative bg-primary px-6 pb-12 pt-6">
          {/* Decorative circles */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-secondary/20" />
          <div className="absolute -bottom-4 left-8 h-16 w-16 rounded-full bg-accent/20" />

          <div className="relative flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary-foreground" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">
                Universidade
              </p>
              <p className="font-heading text-lg font-bold text-primary-foreground">
                SportsCampus
              </p>
            </div>
          </div>
        </div>

        {/* Avatar overlapping */}
        <div className="relative -mt-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-card bg-secondary text-secondary-foreground shadow-md">
            <User className="h-8 w-8" />
          </div>
        </div>

        <CardContent className="flex flex-col items-center gap-5 px-6 pb-6 pt-4">
          {/* Name */}
          <div className="text-center">
            <h2 className="font-heading text-xl font-bold text-foreground">
              {student.nome}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Aluno(a) - Areas Esportivas
            </p>
          </div>

          {/* Info rows */}
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-3">
              <GraduationCap className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Matricula</p>
                <p className="font-mono text-sm font-semibold text-foreground">
                  {student.matricula}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-3">
              <CalendarClock className="h-5 w-5 shrink-0 text-secondary" />
              <div>
                <p className="text-xs text-muted-foreground">Vencimento do Atestado</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatDate(student.vencimentoAtestado)}
                </p>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div
            className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold ${
              valido
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {valido ? (
              <>
                <ShieldCheck className="h-5 w-5" />
                Atestado Valido
              </>
            ) : (
              <>
                <ShieldAlert className="h-5 w-5" />
                Atestado Vencido
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface StudentCardScreenProps {
  role: "admin" | "student"
  studentMatricula: string | null
}

export function StudentCardScreen({ role, studentMatricula }: StudentCardScreenProps) {
  const { students, getStudentByMatricula } = useStudents()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [error, setError] = useState("")

  // If student role, find their own card directly
  const loggedStudent = role === "student" && studentMatricula
    ? getStudentByMatricula(studentMatricula)
    : null

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSelectedStudent(null)

    if (!searchQuery.trim()) {
      setError("Digite uma matricula para buscar.")
      return
    }

    const found = getStudentByMatricula(searchQuery.trim())
    if (found) {
      setSelectedStudent(found)
    } else {
      setError("Nenhum aluno encontrado com essa matricula.")
    }
  }

  // Student view: show only their own card
  if (role === "student") {
    return (
      <div className="flex flex-col gap-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-foreground">Minha Carteirinha</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sua carteirinha digital para acesso as areas esportivas
            </p>
          </div>
        </div>

        {loggedStudent ? (
          <StudentCardView student={loggedStudent} />
        ) : (
          <div className="mx-auto w-full max-w-sm">
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-6 text-center">
              <ShieldAlert className="mx-auto mb-2 h-8 w-8 text-destructive" />
              <p className="text-sm font-medium text-destructive">
                Matricula nao encontrada no sistema.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Verifique sua matricula ou entre em contato com a administracao.
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Admin view: search any student
  return (
    <div className="flex flex-col gap-8">
      {/* Search section */}
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">Carteirinha Digital</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Busque pelo numero de matricula do aluno
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="search-matricula">Matricula</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search-matricula"
                  placeholder="Ex: 2024001"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Buscar</Button>
            </div>
          </div>
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}
        </form>

        {/* Quick access */}
        {!selectedStudent && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Matriculas cadastradas
            </p>
            <div className="flex flex-wrap gap-2">
              {students.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery(s.matricula)
                    setSelectedStudent(s)
                    setError("")
                  }}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {s.matricula} - {s.nome.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card display */}
      {selectedStudent && <StudentCardView student={selectedStudent} />}
    </div>
  )
}
