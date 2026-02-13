"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Lock, User, GraduationCap } from "lucide-react"
import Image from "next/image"

interface LoginScreenProps {
  onLogin: (role: "admin" | "student", matricula?: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [matricula, setMatricula] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
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
      if (!matricula || !password) {
        setError("Preencha todos os campos.")
        return
      }
      if (password === "aluno123") {
        onLogin("student", matricula.trim())
      } else {
        setError("Senha invalida. Tente novamente.")
      }
    }
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
                onClick={() => { setIsAdmin(false); setError("") }}
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
                onClick={() => { setIsAdmin(true); setError("") }}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isAdmin
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Administrador
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {isAdmin ? (
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
              ) : (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="matricula">Matricula</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="matricula"
                      type="text"
                      placeholder="Ex: 2024001"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full text-base font-semibold">
                Entrar
              </Button>

              <div className="mt-2 rounded-lg border border-border bg-muted/50 p-3">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  Credenciais de demonstracao:
                </p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Admin:</span>{" "}
                    admin@universidade.edu.br / admin123
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Aluno:</span>{" "}
                    matricula cadastrada / aluno123
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
