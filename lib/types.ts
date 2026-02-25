export type StudentTipo = "estudante" | "natacao"

export interface Student {
  id: string
  nome: string
  matricula: string
  cpf?: string
  foto?: string // base64 data URL
  tipo: StudentTipo
  vencimentoAtestado: string // ISO date string
  createdAt: string
}
