import { request } from './api'

export interface VendaDia {
  data: string
  total: number
  quantidadeConsultas: number
}

export interface VendaResumo {
  inicio: string
  fim: string
  totalPeriodo: number
  quantidadeConsultas: number
  dias: VendaDia[]
}

export const vendaService = {
  semanal: (data?: string) =>
    request<VendaResumo>(`/vendas/semanal${data ? `?data=${data}` : ''}`),

  mensal: (ano?: number, mes?: number) => {
    const params = new URLSearchParams()
    if (ano) params.set('ano', String(ano))
    if (mes) params.set('mes', String(mes))
    const query = params.toString()
    return request<VendaResumo>(`/vendas/mensal${query ? `?${query}` : ''}`)
  },
}
