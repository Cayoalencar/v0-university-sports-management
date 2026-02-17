"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X, Save } from "lucide-react"
import type { Student } from "@/lib/types"

interface EditStudentModalProps {
  student: Student
  onSave: (id: string, data: { nome: string; matricula: string; cpf?: string; vencimentoAtestado: string }) => void
  onClose: () => void
}

export function EditStudentModal({ student, onSave, onClose }: EditStudentModalProps) {
  const [nome, setNome] = useState(student.nome)
  const [matricula, setMatricula] = useState(student.matricula)
  const [cpf, setCpf] = useState(student.cpf || "")
  const [vencimentoAtestado, setVencimentoAtestado] = useState(student.vencimentoAtestado)
  const [error, setError] = useState("")

  const isNatacao = student.tipo === "natacao"

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!nome.trim() || !vencimentoAtestado) {
      setError("Preencha todos os campos.")
      return
    }

    if (isNatacao && !cpf.trim()) {
      setError("Preencha o CPF.")
      return
    }

    if (!isNatacao && !matricula.trim()) {
      setError("Preencha a matricula.")
      return
    }

    onSave(student.id, {
      nome: nome.trim(),
      matricula: matricula.trim(),
      cpf: cpf.trim() || undefined,
      vencimentoAtestado,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <Card className="relative z-10 mx-4 w-full max-w-md border-border/60 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-lg">Editar Aluno</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Fechar modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-nome">Nome Completo</Label>
              <Input
                id="edit-nome"
                placeholder="Ex: Maria da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            {isNatacao ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-cpf">CPF</Label>
                <Input
                  id="edit-cpf"
                  placeholder="Ex: 123.456.789-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-matricula">Matricula</Label>
                <Input
                  id="edit-matricula"
                  placeholder="Ex: 2024004"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-vencimento">Vencimento do Atestado Medico</Label>
              <Input
                id="edit-vencimento"
                type="date"
                value={vencimentoAtestado}
                onChange={(e) => setVencimentoAtestado(e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
