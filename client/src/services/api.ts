const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export interface Page<T> {
  content: T[]
  page: number
  limit: number
  totalCount: number
  totalPages: number
}

export interface PageParams {
  page?: number
  limit?: number
  search?: string
}

export const mapPage = <A, B>(page: Page<A>, mapper: (item: A) => B): Page<B> => ({
  ...page,
  content: page.content.map(mapper),
})

export const buildQuery = (params: Record<string, string | number | boolean | undefined>) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value))
  })
  const text = query.toString()
  return text ? `?${text}` : ''
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao acessar ${path}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
