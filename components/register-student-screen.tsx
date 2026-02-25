"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useStudents } from "@/lib/students-context"
import { UserPlus, CheckCircle2, Users, GraduationCap, CalendarClock, Pencil, Waves } from "lucide-react"
import { EditStudentModal } from "@/components/edit-student-modal"
import { PhotoUpload } from "@/components/photo-upload"
import type { Student, StudentTipo } from "@/lib/types"

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function isAtestadoValido(vencimento: string) {
  return new Date(vencimento) >= new Date()
}

export function RegisterStudentScreen() {
  const { students, addStudent, updateStudent } = useStudents()
  const [nome, setNome] = useState("")
  const [matricula, setMatricula] = useState("")
  const [cpf, setCpf] = useState("")
  const [vencimentoAtestado, setVencimentoAtestado] = useState("")
  const [foto, setFoto] = useState<string | undefined>(undefined)
  const [tipo, setTipo] = useState<StudentTipo>("estudante")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  function handleSaveEdit(id: string, data: { nome: string; matricula: string; cpf?: string; foto?: string; vencimentoAtestado: string }) {
    updateStudent(id, data)
    setEditingStudent(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!nome.trim() || !vencimentoAtestado) {
      setError("Preencha todos os campos.")
      return
    }

    if (tipo === "estudante" && !matricula.trim()) {
      setError("Preencha a matricula.")
      return
    }

    if (tipo === "natacao" && !cpf.trim()) {
      setError("Preencha o CPF.")
      return
    }

    if (tipo === "estudante") {
      const exists = students.find((s) => s.matricula === matricula.trim())
      if (exists) {
        setError("Ja existe um aluno com essa matricula.")
        return
      }
    } else {
      const exists = students.find((s) => s.cpf === cpf.trim())
      if (exists) {
        setError("Ja existe um membro com esse CPF.")
        return
      }
    }

    addStudent({
      nome: nome.trim(),
      matricula: tipo === "estudante" ? matricula.trim() : "",
      cpf: tipo === "natacao" ? cpf.trim() : undefined,
      foto,
      tipo,
      vencimentoAtestado,
    })

    setNome("")
    setMatricula("")
    setCpf("")
    setFoto(undefined)
    setVencimentoAtestado("")
    setSuccess(true)

    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Registration Form */}
      <div className="mx-auto w-full max-w-lg">
        <Card className="border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="font-heading text-xl">Cadastrar Aluno</CardTitle>
                <CardDescription>Registre um novo aluno ou membro no sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tipo toggle */}
            <div className="mb-5 flex rounded-lg border border-border bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => setTipo("estudante")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  tipo === "estudante"
                    ? "bg-[hsl(152,55%,28%)] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Estudante
              </button>
              <button
                type="button"
                onClick={() => setTipo("natacao")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  tipo === "natacao"
                    ? "bg-[hsl(210,65%,48%)] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Clube de Natacao
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Photo upload */}
              <div className="flex flex-col items-center gap-1">
                <Label className="text-sm">Foto do Aluno</Label>
                <PhotoUpload value={foto} onChange={setFoto} size="lg" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Maria da Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              {tipo === "estudante" ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="matricula">Matricula</Label>
                  <Input
                    id="matricula"
                    placeholder="Ex: 2024004"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="Ex: 123.456.789-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="vencimento">Vencimento do Atestado Medico</Label>
                <Input
                  id="vencimento"
                  type="date"
                  value={vencimentoAtestado}
                  onChange={(e) => setVencimentoAtestado(e.target.value)}
                />
              </div>

              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  Cadastro realizado com sucesso!
                </div>
              )}

              <Button type="submit" size="lg" className="w-full text-base font-semibold">
                <UserPlus className="h-4 w-4" />
                Cadastrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-lg font-bold text-foreground">
            Cadastrados ({students.length})
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {students.map((student) => {
            const valido = isAtestadoValido(student.vencimentoAtestado)
            const isNatacao = student.tipo === "natacao"
            return (
              <div
                key={student.id}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-4 shadow-sm"
              >
                {/* Avatar */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ${
                  isNatacao
                    ? "bg-secondary/10 text-secondary"
                    : valido
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                }`}>
                  {student.foto ? (
                    <img src={student.foto} alt={student.nome} className="h-full w-full object-cover" />
                  ) : isNatacao ? (
                    <Waves className="h-5 w-5" />
                  ) : (
                    <GraduationCap className="h-5 w-5" />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{student.nome}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="font-mono">
                      {isNatacao ? student.cpf : student.matricula}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" />
                      {formatDate(student.vencimentoAtestado)}
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <div
                  className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${
                    valido
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {valido ? "Valido" : "Vencido"}
                </div>

                {/* Edit button */}
                <button
                  type="button"
                  onClick={() => setEditingStudent(student)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-secondary hover:bg-secondary hover:text-white"
                  aria-label={`Editar dados de ${student.nome}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onSave={handleSaveEdit}
          onClose={() => setEditingStudent(null)}
        />
      )}
    </div>
  )
}
