import { request, buildQuery, mapPage, type Page, type PageParams } from './api'

interface ClienteApi {
  id: number
  name: string
  email: string | null
  cpf: string | null
  tel: string
  birthday: string
  city: string
  isActive: boolean
}

export interface Cliente {
  id: number
  nome: string
  email: string
  cpf: string
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
  cpf: c.cpf ?? '',
  telefone: c.tel,
  dataNasc: c.birthday,
  cidade: c.city,
  isActive: c.isActive,
})

const toApi = (c: ClienteForm) => ({
  name: c.nome,
  email: c.email || null,
  cpf: c.cpf,
  tel: c.telefone,
  birthday: c.dataNasc,
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
