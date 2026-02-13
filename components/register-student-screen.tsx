"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useStudents } from "@/lib/students-context"
import { UserPlus, CheckCircle2, Users, GraduationCap, CalendarClock, Trash2 } from "lucide-react"

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
  const { students, addStudent } = useStudents()
  const [nome, setNome] = useState("")
  const [matricula, setMatricula] = useState("")
  const [vencimentoAtestado, setVencimentoAtestado] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!nome.trim() || !matricula.trim() || !vencimentoAtestado) {
      setError("Preencha todos os campos.")
      return
    }

    const exists = students.find((s) => s.matricula === matricula.trim())
    if (exists) {
      setError("Ja existe um aluno com essa matricula.")
      return
    }

    addStudent({
      nome: nome.trim(),
      matricula: matricula.trim(),
      vencimentoAtestado,
    })

    setNome("")
    setMatricula("")
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
                <CardDescription>Registre um novo aluno no sistema esportivo</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Maria da Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="matricula">Matricula</Label>
                <Input
                  id="matricula"
                  placeholder="Ex: 2024004"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                />
              </div>

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
                  Aluno cadastrado com sucesso!
                </div>
              )}

              <Button type="submit" size="lg" className="w-full text-base font-semibold">
                <UserPlus className="h-4 w-4" />
                Cadastrar Aluno
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
            Alunos Cadastrados ({students.length})
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {students.map((student) => {
            const valido = isAtestadoValido(student.vencimentoAtestado)
            return (
              <Card key={student.id} className="border-border/60">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${valido ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{student.nome}</p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-mono">{student.matricula}</span>
                      <span className="flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" />
                        {formatDate(student.vencimentoAtestado)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      valido
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {valido ? "Valido" : "Vencido"}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
