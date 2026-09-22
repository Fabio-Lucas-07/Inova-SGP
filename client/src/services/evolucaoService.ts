import { request, buildQuery, mapPage, type Page, type PageParams } from './api'

interface EvolucaoApi {
  id: number
  prontuarioId: number
  date: string
  sessionNumber: number
  description: string
}

export interface Evolucao {
  id: number
  pacienteId: number
  data: string
  sessao: string
  descricao: string
}

const fromApi = (e: EvolucaoApi): Evolucao => ({
  id: e.id,
  pacienteId: e.prontuarioId,
  data: e.date,
  sessao: `Sessão ${String(e.sessionNumber).padStart(2, '0')}`,
  descricao: e.description,
})

export const evolucaoService = {
  listar: async (prontuarioId: number, params: PageParams = {}) =>
    mapPage(await request<Page<EvolucaoApi>>(`/prontuarios/${prontuarioId}/evolucoes${buildQuery({ ...params })}`), fromApi),

  criar: async (prontuarioId: number, descricao: string) =>
    fromApi(await request<EvolucaoApi>(`/prontuarios/${prontuarioId}/evolucoes`, {
      method: 'POST',
      body: JSON.stringify({ description: descricao }),
    })),

  remover: (id: number) => request<void>(`/evolucoes/${id}`, { method: 'DELETE' }),
}
