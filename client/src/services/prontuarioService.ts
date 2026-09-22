import { request, buildQuery, mapPage, type Page, type PageParams } from './api'

export type StatusPaciente = 'Em Tratamento' | 'Alta'

type StatusApi = 'EM_TRATAMENTO' | 'ALTA'

interface ProntuarioApi {
  id: number
  clienteId: number
  name: string
  tel: string
  status: StatusApi
  lastConsultation: string | null
}

export interface Prontuario {
  id: number
  clienteId: number
  nome: string
  telefone: string
  status: StatusPaciente
  ultimaConsulta: string | null
}

const statusFromApi: Record<StatusApi, StatusPaciente> = {
  EM_TRATAMENTO: 'Em Tratamento',
  ALTA: 'Alta',
}

const statusToApi: Record<StatusPaciente, StatusApi> = {
  'Em Tratamento': 'EM_TRATAMENTO',
  'Alta': 'ALTA',
}

const fromApi = (p: ProntuarioApi): Prontuario => ({
  id: p.id,
  clienteId: p.clienteId,
  nome: p.name,
  telefone: p.tel,
  status: statusFromApi[p.status],
  ultimaConsulta: p.lastConsultation,
})

export const prontuarioService = {
  listar: async (params: PageParams = {}) =>
    mapPage(await request<Page<ProntuarioApi>>(`/prontuarios${buildQuery({ ...params })}`), fromApi),

  alterarStatus: async (id: number, status: StatusPaciente) =>
    fromApi(await request<ProntuarioApi>(`/prontuarios/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: statusToApi[status] }),
    })),

  remover: (id: number) => request<void>(`/prontuarios/${id}`, { method: 'DELETE' }),
}
