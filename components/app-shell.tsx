"use client"

import { useState } from "react"
import { StudentsProvider } from "@/lib/students-context"
import { LoginScreen } from "@/components/login-screen"
import { StudentCardScreen } from "@/components/student-card-screen"
import { RegisterStudentScreen } from "@/components/register-student-screen"
import { Button } from "@/components/ui/button"
import { CreditCard, UserPlus, LogOut } from "lucide-react"
import Image from "next/image"
import type { StudentTipo } from "@/lib/types"

type Screen = "carteirinha" | "cadastro"

export function AppShell() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [role, setRole] = useState<"admin" | "student">("student")
  const [studentIdentifier, setStudentIdentifier] = useState<string | null>(null)
  const [studentTipo, setStudentTipo] = useState<StudentTipo>("estudante")
  const [currentScreen, setCurrentScreen] = useState<Screen>("carteirinha")

  function handleLogin(userRole: "admin" | "student", identifier?: string, tipo?: StudentTipo) {
    setRole(userRole)
    if (userRole === "student" && identifier) {
      setStudentIdentifier(identifier)
      setStudentTipo(tipo || "estudante")
    }
    setLoggedIn(true)
    setCurrentScreen("carteirinha")
  }

  function handleLogout() {
    setLoggedIn(false)
    setRole("student")
    setStudentIdentifier(null)
    setStudentTipo("estudante")
    setCurrentScreen("carteirinha")
  }

  if (!loggedIn) {
    return (
      <StudentsProvider>
        <LoginScreen onLogin={handleLogin} />
      </StudentsProvider>
    )
  }

  return (
    <StudentsProvider>
      <div className="flex min-h-screen flex-col">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="Logo Centro Olimpico UnB"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="hidden font-heading text-lg font-bold text-foreground sm:block">
                Centro Olimpico UnB
              </span>
            </div>

            {/* Nav Tabs */}
            <nav className="flex items-center gap-1">
              <Button
                variant={currentScreen === "carteirinha" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentScreen("carteirinha")}
                className="gap-2"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Carteirinha</span>
              </Button>
              {role === "admin" && (
                <Button
                  variant={currentScreen === "cadastro" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentScreen("cadastro")}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Cadastro</span>
                </Button>
              )}
            </nav>

            {/* User info + logout */}
            <div className="flex items-center gap-3">
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-xs font-medium text-foreground">
                  {role === "admin" ? "Administrador" : "Aluno"}
                </span>
                {role === "student" && studentIdentifier && (
                  <span className="text-[10px] text-muted-foreground">
                    {studentTipo === "natacao" ? "CPF" : "Mat."} {studentIdentifier}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sair do sistema">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8">
          {currentScreen === "carteirinha" && (
              <StudentCardScreen role={role} studentIdentifier={studentIdentifier} studentTipo={studentTipo} />
            )}
          {currentScreen === "cadastro" && role === "admin" && <RegisterStudentScreen />}
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card py-4">
          <p className="text-center text-xs text-muted-foreground">
            Centro Olimpico UnB - Sistema de Gerenciamento de Areas Esportivas
          </p>
        </footer>
      </div>
    </StudentsProvider>
  )
}
