import moment from 'moment'
import { request } from './api'

interface AgendamentoApi {
  id: number
  clienteId: number | null
  name: string
  startTime: string
  endTime: string
  description: string | null
  type: string | null
  valor: number
}

// Formato consumido pelo react-big-calendar
export interface Agendamento {
  id: number
  clienteId: number | null
  title: string
  start: Date
  end: Date
  desc: string
  tipo: string
  valor: number
}

export type AgendamentoForm = Omit<Agendamento, 'id' | 'clienteId'> & { clienteId?: number | null }

const DATE_TIME = 'YYYY-MM-DDTHH:mm:ss'

const fromApi = (a: AgendamentoApi): Agendamento => ({
  id: a.id,
  clienteId: a.clienteId,
  title: a.name,
  start: moment(a.startTime).toDate(),
  end: moment(a.endTime).toDate(),
  desc: a.description ?? '',
  tipo: a.type ?? '',
  valor: a.valor ?? 0,
})

const toApi = (a: AgendamentoForm) => ({
  clienteId: a.clienteId ?? null,
  name: a.title,
  startTime: moment(a.start).format(DATE_TIME),
  endTime: moment(a.end).format(DATE_TIME),
  description: a.desc,
  type: a.tipo,
  valor: a.valor ?? 0,
})

export const agendamentoService = {
  listar: async () => (await request<AgendamentoApi[]>('/agendamentos')).map(fromApi),

  criar: async (agendamento: AgendamentoForm) =>
    fromApi(await request<AgendamentoApi>('/agendamentos', { method: 'POST', body: JSON.stringify(toApi(agendamento)) })),

  atualizar: async (id: number, agendamento: AgendamentoForm) =>
    fromApi(await request<AgendamentoApi>(`/agendamentos/${id}`, { method: 'PUT', body: JSON.stringify(toApi(agendamento)) })),

  remover: (id: number) => request<void>(`/agendamentos/${id}`, { method: 'DELETE' }),
}
