import { useEffect, useState } from 'react'
import { User, MapPin, Phone, Mail, Search, Check, ChevronsUpDown, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Pagination from '@/components/Pagination'
import { useDebounce } from '@/hooks/useDebounce'
import { clienteService, type Cliente } from '@/services'

const ITENS_POR_PAGINA = 6

interface ClienteSelectProps {
  id: string
  value: Cliente | null
  onChange: (cliente: Cliente) => void
}

const ClienteSelect = ({ id, value, onChange }: ClienteSelectProps) => {
  const [aberto, setAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const buscaDebounced = useDebounce(busca)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalClientes, setTotalClientes] = useState(0)
  const [carregando, setCarregando] = useState(false)

  const selecionado = value

  useEffect(() => {
    if (!aberto) return
    let cancelado = false
    setCarregando(true)

    // A API só devolve clientes ativos por padrão: inativos não podem receber agendamentos
    clienteService.listar({ search: buscaDebounced, page: pagina, limit: ITENS_POR_PAGINA })
      .then((resultado) => {
        if (cancelado) return
        setClientes(resultado.content)
        setTotalPaginas(resultado.totalPages)
        setTotalClientes(resultado.totalCount)
      })
      .catch(() => {
        if (!cancelado) alert("Não foi possível carregar os clientes.")
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => { cancelado = true }
  }, [aberto, buscaDebounced, pagina])

  const abrir = (open: boolean) => {
    setAberto(open)
    if (open) {
      setBusca('')
      setPagina(1)
    }
  }

  const alterarBusca = (valor: string) => {
    setBusca(valor)
    setPagina(1)
  }

  const selecionar = (cliente: Cliente) => {
    onChange(cliente)
    setAberto(false)
  }

  return (
    <>
      {selecionado ? (
        <button
          type="button"
          id={id}
          onClick={() => abrir(true)}
          className="w-full text-left bg-white border border-[#D5B99A] border-l-4 border-l-[#5B2814] rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#FAF5EE] h-12 w-12 rounded-full flex items-center justify-center text-[#5B2814] shrink-0">
              <User size={24} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[16px] font-bold text-[#261810] truncate">{selecionado.nome}</span>
              <span className="text-[13px] text-[#7A4B3A] flex items-center gap-1 truncate">
                <MapPin size={13} /> {selecionado.cidade}
              </span>
            </div>
            <span className="text-[12px] font-medium text-[#A67B66] group-hover:text-[#5B2814] flex items-center gap-1 shrink-0">
              Trocar <ChevronsUpDown size={14} />
            </span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 pt-3 border-t border-[#F1E1CA] text-[13px] text-[#4A3224]">
            <span className="flex items-center gap-1.5"><Phone size={14} className="text-[#7A4B3A]" /> {selecionado.telefone}</span>
            {selecionado.email && (
              <span className="flex items-center gap-1.5 truncate"><Mail size={14} className="text-[#7A4B3A]" /> {selecionado.email}</span>
            )}
          </div>
        </button>
      ) : (
        <button
          type="button"
          id={id}
          onClick={() => abrir(true)}
          className="w-full flex items-center justify-between gap-2 h-12 px-3 bg-white border border-dashed border-[#D5B99A] rounded-lg text-[14px] text-[#A67B66] hover:border-[#5B2814] hover:text-[#5B2814] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2"><UserPlus size={18} /> Selecionar cliente</span>
          <ChevronsUpDown size={16} />
        </button>
      )}

      <Dialog open={aberto} onOpenChange={abrir}>
        <DialogContent className="sm:max-w-[900px] w-full h-[80vh] flex flex-col gap-0 p-0 overflow-hidden bg-[#FDFBF7] border-[#D5B99A]">
          <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-[#F1E1CA] to-[#DFC4A4] border-b border-[#D5B99A]/30 gap-1">
            <DialogTitle className="text-[22px] font-bold text-[#261810] flex items-center gap-2">
              <User className="text-[#5B2814]" size={24} />
              Selecione o cliente
            </DialogTitle>
            <DialogDescription className="text-[#4A3224]">
              {totalClientes} {totalClientes === 1 ? 'cliente ativo' : 'clientes ativos'}. Clique em um cartão para selecionar.
            </DialogDescription>
            <div className="relative mt-3 max-w-[420px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A4B3A] h-5 w-5" />
              <Input
                autoFocus
                value={busca}
                onChange={(e) => alterarBusca(e.target.value)}
                placeholder="Buscar por nome, telefone ou cidade..."
                className="w-full pl-10 bg-white border-[#D5B99A] text-[#261810] placeholder:text-[#A67B66] focus:ring-[#5B2814] rounded-lg"
              />
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {clientes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientes.map((cliente) => {
                  const ativo = cliente.id === value?.id
                  return (
                    <button
                      type="button"
                      key={cliente.id}
                      onClick={() => selecionar(cliente)}
                      className={`relative text-left bg-white rounded-xl p-4 border-t-4 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${
                        ativo ? 'border-t-[#5B2814] ring-2 ring-[#5B2814]' : 'border-t-[#DFC4A4]'
                      }`}
                    >
                      {ativo && (
                        <span className="absolute top-3 right-3 bg-[#5B2814] text-[#F1E1CA] rounded-full p-1">
                          <Check size={14} />
                        </span>
                      )}
                      <div className="flex items-center gap-3 pb-3 border-b border-[#F1E1CA]">
                        <div className="bg-[#FAF5EE] h-12 w-12 rounded-full flex items-center justify-center text-[#5B2814] shrink-0">
                          <User size={24} />
                        </div>
                        <div className="flex flex-col min-w-0 pr-6">
                          <span className="text-[16px] font-bold text-[#261810] truncate">{cliente.nome}</span>
                          <span className="text-[13px] text-[#A67B66] flex items-center gap-1">
                            <MapPin size={13} /> {cliente.cidade}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-3 text-[13px] text-[#4A3224]">
                        <span className="flex items-center gap-2"><Phone size={14} className="text-[#7A4B3A]" /> {cliente.telefone}</span>
                        {cliente.email && (
                          <span className="flex items-center gap-2 truncate"><Mail size={14} className="text-[#7A4B3A]" /> {cliente.email}</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : carregando ? (
              <p className="text-center text-[#A67B66] mt-10">Carregando clientes...</p>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-10 border border-dashed border-[#D5B99A] rounded-xl bg-white">
                <User size={48} className="text-[#D5B99A] mb-3" />
                <p className="text-[18px] font-medium text-[#4A3224]">Nenhum cliente encontrado.</p>
                <p className="text-[14px] text-[#A67B66] mt-1">
                  {busca ? 'Tente outro termo de busca.' : 'Cadastre clientes na página Clientes.'}
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[#F1E1CA] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FDFBF7]">
            <div className="flex-1 w-full">
              <Pagination page={pagina} totalPages={totalPaginas} totalCount={totalClientes} onPageChange={setPagina} compact />
            </div>
            <Button type="button" variant="ghost" onClick={() => setAberto(false)} className="text-[#7A4B3A] hover:bg-[#FAF5EE] cursor-pointer">
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ClienteSelect
