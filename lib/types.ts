export type StudentTipo = "estudante" | "natacao"

export interface Student {
  id: string
  nome: string
  matricula: string
  cpf?: string
  tipo: StudentTipo
  vencimentoAtestado: string // ISO date string
  createdAt: string
}
