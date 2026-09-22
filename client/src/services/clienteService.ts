import moment from 'moment'
import { request, buildQuery, mapPage, type Page, type PageParams } from './api'

interface ClienteApi {
  id: number
  name: string
  email: string | null
  tel: string
  birthday: string
  city: string
  isActive: boolean
}

export interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  dataNasc: string
  cidade: string
  isActive: boolean
}

export type StatusCliente = 'active' | 'inactive' | 'all'

export type ClienteForm = Omit<Cliente, 'id' | 'isActive'>

const fromApi = (c: ClienteApi): Cliente => ({
  id: c.id,
  nome: c.name,
  email: c.email ?? '',
  telefone: c.tel,
  dataNasc: moment(c.birthday, 'YYYY-MM-DD').format('DD/MM/YYYY'),
  cidade: c.city,
  isActive: c.isActive,
})

const toApi = (c: ClienteForm) => ({
  name: c.nome,
  email: c.email || null,
  tel: c.telefone,
  birthday: moment(c.dataNasc, 'DD/MM/YYYY').format('YYYY-MM-DD'),
  city: c.cidade,
})

export const clienteService = {
  listar: async ({ status = 'active', ...params }: PageParams & { status?: StatusCliente } = {}) =>
    mapPage(await request<Page<ClienteApi>>(`/clientes${buildQuery({ status, ...params })}`), fromApi),

  criar: async (cliente: ClienteForm) =>
    fromApi(await request<ClienteApi>('/clientes', { method: 'POST', body: JSON.stringify(toApi(cliente)) })),

  atualizar: async (id: number, cliente: ClienteForm) =>
    fromApi(await request<ClienteApi>(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(toApi(cliente)) })),

  alterarStatus: async (id: number, isActive: boolean) =>
    fromApi(await request<ClienteApi>(`/clientes/${id}/status`, { method: 'PUT', body: JSON.stringify({ isActive }) })),
}
