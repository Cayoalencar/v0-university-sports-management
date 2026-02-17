"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Lock, User, GraduationCap, BookOpen, Waves, ArrowLeft } from "lucide-react"
import Image from "next/image"
import type { StudentTipo } from "@/lib/types"

interface LoginScreenProps {
  onLogin: (role: "admin" | "student", identifier?: string, studentTipo?: StudentTipo) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [identifier, setIdentifier] = useState("") // matricula ou cpf
  const [isAdmin, setIsAdmin] = useState(false)
  const [studentTipo, setStudentTipo] = useState<StudentTipo | null>(null)
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (isAdmin) {
      if (!email || !password) {
        setError("Preencha todos os campos.")
        return
      }
      if (email === "admin@universidade.edu.br" && password === "admin123") {
        onLogin("admin")
      } else {
        setError("Credenciais de administrador invalidas.")
      }
    } else {
      if (!identifier || !password) {
        setError("Preencha todos os campos.")
        return
      }
      if (password === "aluno123") {
        onLogin("student", identifier.trim(), studentTipo!)
      } else {
        setError("Senha invalida. Tente novamente.")
      }
    }
  }

  function handleBackToSelection() {
    setStudentTipo(null)
    setIdentifier("")
    setPassword("")
    setError("")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/5" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-secondary/5" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo Centro Olimpico UnB"
            width={72}
            height={72}
            className="h-18 w-18 object-contain"
            priority
          />
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Centro Olimpico UnB
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerenciamento de Areas Esportivas
            </p>
          </div>
        </div>

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-xl">Acesso ao Sistema</CardTitle>
            <CardDescription>
              Entre com suas credenciais institucionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role toggle tabs */}
            <div className="mb-5 flex rounded-lg border border-border bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => { setIsAdmin(false); setStudentTipo(null); setError("") }}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  !isAdmin
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Aluno
              </button>
              <button
                type="button"
                onClick={() => { setIsAdmin(true); setStudentTipo(null); setError("") }}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isAdmin
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Administrador
              </button>
            </div>

            {/* ADMIN form */}
            {isAdmin && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">E-mail Institucional</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@universidade.edu.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password-admin">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password-admin"
                      type="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" size="lg" className="w-full text-base font-semibold">
                  Entrar
                </Button>
              </form>
            )}

            {/* ALUNO: tipo selection (two big cards) */}
            {!isAdmin && !studentTipo && (
              <div className="flex flex-col gap-4">
                <p className="text-center text-sm text-muted-foreground">Selecione o tipo de acesso:</p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Estudante - Verde */}
                  <button
                    type="button"
                    onClick={() => { setStudentTipo("estudante"); setError("") }}
                    className="group flex flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-[hsl(152,55%,28%)] p-6 text-white shadow-md transition-all hover:scale-[1.03] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[hsl(152,55%,28%)] focus:ring-offset-2"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                      <BookOpen className="h-7 w-7" />
                    </div>
                    <span className="text-base font-bold">Estudante</span>
                  </button>

                  {/* Clube de Natacao - Azul */}
                  <button
                    type="button"
                    onClick={() => { setStudentTipo("natacao"); setError("") }}
                    className="group flex flex-col items-center gap-3 rounded-xl border-2 border-transparent bg-[hsl(210,65%,48%)] p-6 text-white shadow-md transition-all hover:scale-[1.03] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[hsl(210,65%,48%)] focus:ring-offset-2"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                      <Waves className="h-7 w-7" />
                    </div>
                    <span className="text-base font-bold">Clube de Natacao</span>
                  </button>
                </div>
              </div>
            )}

            {/* ALUNO: login form after selecting tipo */}
            {!isAdmin && studentTipo && (
              <div className="flex flex-col gap-5">
                {/* Back button + selected type indicator */}
                <button
                  type="button"
                  onClick={handleBackToSelection}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </button>

                <div className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                  studentTipo === "estudante"
                    ? "bg-[hsl(152,55%,28%)]/10 text-[hsl(152,55%,28%)]"
                    : "bg-[hsl(210,65%,48%)]/10 text-[hsl(210,65%,48%)]"
                }`}>
                  {studentTipo === "estudante" ? (
                    <BookOpen className="h-5 w-5" />
                  ) : (
                    <Waves className="h-5 w-5" />
                  )}
                  <span className="text-sm font-semibold">
                    {studentTipo === "estudante" ? "Estudante" : "Clube de Natacao"}
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="identifier">
                      {studentTipo === "estudante" ? "Matricula" : "CPF"}
                    </Label>
                    <div className="relative">
                      {studentTipo === "estudante" ? (
                        <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      ) : (
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      )}
                      <Input
                        id="identifier"
                        type="text"
                        placeholder={studentTipo === "estudante" ? "Ex: 2024001" : "Ex: 123.456.789-00"}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password-student">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password-student"
                        type="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
                  )}

                  <Button type="submit" size="lg" className="w-full text-base font-semibold">
                    Entrar
                  </Button>
                </form>
              </div>
            )}

            {/* Demo credentials */}
            <div className="mt-5 rounded-lg border border-border bg-muted/50 p-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                Credenciais de demonstracao:
              </p>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Admin:</span>{" "}
                  admin@universidade.edu.br / admin123
                </p>
                <p>
                  <span className="font-medium text-foreground">Estudante:</span>{" "}
                  matricula (ex: 2024001) / aluno123
                </p>
                <p>
                  <span className="font-medium text-foreground">Natacao:</span>{" "}
                  CPF (ex: 123.456.789-00) / aluno123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
