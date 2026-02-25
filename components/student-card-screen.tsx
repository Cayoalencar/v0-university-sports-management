"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useStudents } from "@/lib/students-context"
import { Search, User, GraduationCap, CalendarClock, ShieldCheck, ShieldAlert, Activity, X, Waves } from "lucide-react"
import { PhotoViewerModal } from "@/components/photo-viewer-modal"
import type { Student, StudentTipo } from "@/lib/types"

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
  const [showPhoto, setShowPhoto] = useState(false)
  const valido = isAtestadoValido(student.vencimentoAtestado)
  const isNatacao = student.tipo === "natacao"

  return (
    <div className="mx-auto w-full max-w-sm">
      <Card className="overflow-hidden border-0 shadow-xl">
        {/* Card Header */}
        <div className={`relative px-6 pb-12 pt-6 ${isNatacao ? "bg-secondary" : "bg-primary"}`}>
          {/* Decorative circles */}
          <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${isNatacao ? "bg-primary/20" : "bg-secondary/20"}`} />
          <div className={`absolute -bottom-4 left-8 h-16 w-16 rounded-full ${isNatacao ? "bg-primary/20" : "bg-accent/20"}`} />

          <div className="relative flex items-center gap-3">
            {isNatacao ? (
              <Waves className="h-6 w-6 text-secondary-foreground" />
            ) : (
              <Activity className="h-6 w-6 text-primary-foreground" />
            )}
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${isNatacao ? "text-secondary-foreground/80" : "text-primary-foreground/80"}`}>
                {isNatacao ? "Clube de Natacao" : "Universidade de Brasilia"}
              </p>
              <p className={`font-heading text-lg font-bold ${isNatacao ? "text-secondary-foreground" : "text-primary-foreground"}`}>
                Centro Olimpico UnB
              </p>
            </div>
          </div>
        </div>

        {/* Avatar overlapping - clicavel */}
        <div className="relative -mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowPhoto(true)}
            className={`flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-card shadow-md transition-transform hover:scale-110 hover:shadow-lg ${isNatacao ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}
            aria-label="Ver foto ampliada"
          >
            {student.foto ? (
              <img src={student.foto} alt={student.nome} className="h-full w-full object-cover" />
            ) : isNatacao ? (
              <Waves className="h-8 w-8" />
            ) : (
              <User className="h-8 w-8" />
            )}
          </button>
        </div>

        <CardContent className="flex flex-col items-center gap-5 px-6 pb-6 pt-4">
          {/* Name */}
          <div className="text-center">
            <h2 className="font-heading text-xl font-bold text-foreground">
              {student.nome}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {isNatacao ? "Membro - Clube de Natacao" : "Aluno(a) - Areas Esportivas"}
            </p>
          </div>

          {/* Info rows */}
          <div className="flex w-full flex-col gap-3">
            {isNatacao ? (
              <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-3">
                <User className="h-5 w-5 shrink-0 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">CPF</p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {student.cpf}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-3">
                <GraduationCap className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Matricula</p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {student.matricula}
                  </p>
                </div>
              </div>
            )}

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

      {/* Photo viewer modal */}
      {showPhoto && (
        <PhotoViewerModal
          foto={student.foto || ""}
          nome={student.nome}
          onClose={() => setShowPhoto(false)}
          isEmpty={!student.foto}
        />
      )}
    </div>
  )
}

interface StudentCardScreenProps {
  role: "admin" | "student"
  studentIdentifier: string | null
  studentTipo: StudentTipo
}

export function StudentCardScreen({ role, studentIdentifier, studentTipo }: StudentCardScreenProps) {
  const { students, getStudentByMatricula, getStudentByCpf } = useStudents()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [error, setError] = useState("")

  // If student role, find their own card directly
  const loggedStudent = role === "student" && studentIdentifier
    ? (studentTipo === "natacao" ? getStudentByCpf(studentIdentifier) : getStudentByMatricula(studentIdentifier))
    : null

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSelectedStudent(null)

    if (!searchQuery.trim()) {
      setError("Digite uma matricula ou CPF para buscar.")
      return
    }

    const q = searchQuery.trim()
    const found = getStudentByMatricula(q) || getStudentByCpf(q)
    if (found) {
      setSelectedStudent(found)
    } else {
      setError("Nenhum aluno encontrado com essa matricula ou CPF.")
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
                {studentTipo === "natacao" ? "CPF" : "Matricula"} nao encontrado(a) no sistema.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Verifique seus dados ou entre em contato com a administracao.
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
            Busque pelo numero de matricula ou CPF
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="search-id">Matricula ou CPF</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search-id"
                  placeholder="Ex: 2024001 ou 123.456.789-00"
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
              Cadastrados
            </p>
            <div className="flex flex-wrap gap-2">
              {students.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery(s.tipo === "natacao" ? s.cpf || "" : s.matricula)
                    setSelectedStudent(s)
                    setError("")
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted ${
                    s.tipo === "natacao"
                      ? "border-secondary/30 bg-secondary/5 text-foreground"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  {s.tipo === "natacao" ? (
                    <>{s.cpf} - {s.nome.split(" ")[0]}</>
                  ) : (
                    <>{s.matricula} - {s.nome.split(" ")[0]}</>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card display */}
      {selectedStudent && (
        <div className="relative mx-auto w-full max-w-sm">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedStudent(null)
              setSearchQuery("")
            }}
            className="absolute -top-2 right-0 z-10 h-8 w-8 rounded-full border-border bg-card shadow-md hover:bg-destructive hover:text-destructive-foreground"
            aria-label="Fechar carteirinha"
          >
            <X className="h-4 w-4" />
          </Button>
          <StudentCardView student={selectedStudent} />
        </div>
      )}
    </div>
  )
}
