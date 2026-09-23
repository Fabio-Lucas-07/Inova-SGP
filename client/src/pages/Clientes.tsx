import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Plus, User, Phone, Mail, Edit3, UserX, UserCheck, MapPin, Calendar as CalendarIcon, UserPlus, IdCard } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { clienteService, type Cliente, type StatusCliente } from '@/services'
import Pagination from '@/components/Pagination'
import { useDebounce } from '@/hooks/useDebounce'
import { maskCpf, maskTelefone, isCpfValido, isTelefoneValido } from '@/lib/masks'

const ITENS_POR_PAGINA = 6

const abas: { valor: StatusCliente, rotulo: string }[] = [
  { valor: 'active', rotulo: 'Ativos' },
  { valor: 'inactive', rotulo: 'Inativos' },
  { valor: 'all', rotulo: 'Todos' },
]

const estadoInicialNovoCliente = {
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  dataNasc: '',
  cidade: ''
}

const camposComMascara: Record<string, (valor: string) => string> = {
  cpf: maskCpf,
  telefone: maskTelefone,
}

const validarDadosCliente = (cliente) => {
  if (!isCpfValido(cliente.cpf)) return "CPF inválido. Verifique os números digitados."
  if (!isTelefoneValido(cliente.telefone)) return "Telefone inválido. Informe o DDD + número (10 ou 11 dígitos)."
  if (!cliente.dataNasc) return "Informe a data de nascimento."
  if (moment(cliente.dataNasc).isAfter(moment(), 'day')) return "A data de nascimento não pode estar no futuro."
  return null
}

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busca, setBusca] = useState('')
  const buscaDebounced = useDebounce(busca)
  const [statusFiltro, setStatusFiltro] = useState<StatusCliente>('active')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalClientes, setTotalClientes] = useState(0)
  const [recarregar, setRecarregar] = useState(0)
  
  const [modalEditarAberto, setModalEditarAberto] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)

  const [modalNovoAberto, setModalNovoAberto] = useState(false)
  const [novoCliente, setNovoCliente] = useState(estadoInicialNovoCliente)

  const [modalStatusAberto, setModalStatusAberto] = useState(false)
  const [clienteParaAlterar, setClienteParaAlterar] = useState<Cliente | null>(null)

  useEffect(() => {
    let cancelado = false

    clienteService.listar({ status: statusFiltro, search: buscaDebounced, page: pagina, limit: ITENS_POR_PAGINA })
      .then((resultado) => {
        if (cancelado) return
        if (resultado.content.length === 0 && pagina > 1) {
          setPagina(Math.max(resultado.totalPages, 1))
          return
        }
        setClientes(resultado.content)
        setTotalPaginas(resultado.totalPages)
        setTotalClientes(resultado.totalCount)
      })
      .catch(() => {
        if (!cancelado) alert("Não foi possível carregar os clientes.")
      })

    return () => { cancelado = true }
  }, [statusFiltro, buscaDebounced, pagina, recarregar])

  const alterarBusca = (valor) => {
    setBusca(valor)
    setPagina(1)
  }

  const alterarStatusFiltro = (valor: StatusCliente) => {
    setStatusFiltro(valor)
    setPagina(1)
  }

  const confirmarAlteracaoStatus = (cliente) => {
    setClienteParaAlterar(cliente)
    setModalStatusAberto(true)
  }

  const alterarStatusCliente = async () => {
    if (clienteParaAlterar) {
      try {
        await clienteService.alterarStatus(clienteParaAlterar.id, !clienteParaAlterar.isActive)
        setModalStatusAberto(false)
        setClienteParaAlterar(null)
        setRecarregar((n) => n + 1)
      } catch {
        alert("Não foi possível alterar o status do cliente.")
      }
    }
  }

  const abrirModalEditar = (cliente) => {
    setClienteEditando({ ...cliente }) 
    setModalEditarAberto(true)
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    const valorFormatado = camposComMascara[name] ? camposComMascara[name](value) : value
    setClienteEditando(prev => ({
      ...prev,
      [name]: valorFormatado
    }))
  }

  const salvarEdicao = async () => {
    const erro = validarDadosCliente(clienteEditando)
    if (erro) {
      alert(erro)
      return
    }

    try {
      const atualizado = await clienteService.atualizar(clienteEditando.id, clienteEditando)
      setClientes(clientes.map(c => c.id === atualizado.id ? atualizado : c))
      setModalEditarAberto(false)
      setClienteEditando(null)
    } catch {
      alert("Não foi possível salvar as alterações. Verifique os dados informados.")
    }
  }

  const abrirModalNovo = () => {
    setNovoCliente(estadoInicialNovoCliente)
    setModalNovoAberto(true)
  }

  const handleNovoInputChange = (e) => {
    const { name, value } = e.target
    const valorFormatado = camposComMascara[name] ? camposComMascara[name](value) : value
    setNovoCliente(prev => ({
      ...prev,
      [name]: valorFormatado
    }))
  }

  const salvarNovoCliente = async () => {
    if (!novoCliente.nome.trim()) {
      alert("O nome do cliente é obrigatório.")
      return
    }

    const erro = validarDadosCliente(novoCliente)
    if (erro) {
      alert(erro)
      return
    }

    try {
      await clienteService.criar(novoCliente)
      setModalNovoAberto(false)
      setNovoCliente(estadoInicialNovoCliente)
      setRecarregar((n) => n + 1)
    } catch {
      alert("Não foi possível cadastrar o cliente. Verifique os dados informados.")
    }
  }

  return (
    <div className='w-full min-h-screen flex flex-col bg-[#FDFBF7]'>
      
      <div className='bg-gradient-to-r from-[#F1E1CA] to-[#DFC4A4] h-auto w-full p-6 shadow-sm border-b border-[#D5B99A]/30 flex flex-col md:flex-row justify-between md:items-center gap-4'>
        <div>
          <h1 className='text-[28px] font-bold text-[#261810] tracking-tight'>Clientes</h1>
          <p className='text-[16px] text-[#4A3224] mt-1 font-medium'>
            Gerencie o cadastro e as informações de contato dos seus pacientes.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A4B3A] h-5 w-5" />
            <Input 
              type="text" 
              placeholder="Buscar cliente..." 
              value={busca}
              onChange={(e) => alterarBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border-[#D5B99A] text-[#261810] placeholder:text-[#A67B66] focus:border-[#5B2814] focus:ring-[#5B2814] rounded-lg shadow-sm"
            />
          </div>
          
          <Button 
            onClick={abrirModalNovo}
            className="bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA] border-none shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={20} />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className='p-8 flex-1'>
        <div className='max-w-[1200px] mx-auto'>

          <div className='flex gap-2 mb-6'>
            {abas.map((aba) => (
              <Button
                key={aba.valor}
                variant={statusFiltro === aba.valor ? 'default' : 'outline'}
                onClick={() => alterarStatusFiltro(aba.valor)}
                className={statusFiltro === aba.valor
                  ? 'bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA] cursor-pointer'
                  : 'border-[#D5B99A] text-[#7A4B3A] hover:bg-[#FAF5EE] cursor-pointer'}
              >
                {aba.rotulo}
              </Button>
            ))}
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <Card 
                  key={cliente.id} 
                  className={`bg-white border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden group border-t-4 ${cliente.isActive ? 'border-t-[#5B2814]' : 'border-t-gray-400 opacity-75'}`}
                >
                  <CardContent className="p-6 flex flex-col  justify-between gap-5">
                    
                    <div className="flex items-center gap-4 border-b border-[#F1E1CA] pb-4">
                      <div className="bg-[#FAF5EE] h-14 w-14 rounded-full flex items-center justify-center text-[#5B2814] shadow-inner shrink-0">
                        <User size={28} />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <h2 className="text-[18px] font-bold text-[#261810] truncate">
                          {cliente.nome}
                        </h2>
                        <span className="text-[13px] font-medium text-[#A67B66] flex items-center gap-1 mt-1">
                          <MapPin size={14} /> {cliente.cidade}
                        </span>
                        {!cliente.isActive && (
                          <span className="mt-1 w-fit text-[11px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-500 rounded px-2 py-0.5">Inativo</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-[#4A3224]">
                        <div className="bg-[#FAF5EE] p-2 rounded-md text-[#7A4B3A]">
                          <Phone size={16} />
                        </div>
                        <span className="text-[14px] font-medium">{cliente.telefone}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[#4A3224]">
                        <div className="bg-[#FAF5EE] p-2 rounded-md text-[#7A4B3A]">
                          <Mail size={16} />
                        </div>
                        <span className="text-[14px] font-medium truncate">{cliente.email}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[#4A3224]">
                        <div className="bg-[#FAF5EE] p-2 rounded-md text-[#7A4B3A]">
                          <CalendarIcon size={16} />
                        </div>
                        <span className="text-[14px] font-medium truncate">Nasc: {cliente.dataNasc ? moment(cliente.dataNasc).format('DD/MM/YYYY') : '—'}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[#4A3224]">
                        <div className="bg-[#FAF5EE] p-2 rounded-md text-[#7A4B3A]">
                          <IdCard size={16} />
                        </div>
                        <span className="text-[14px] font-medium truncate">CPF: {cliente.cpf || '—'}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-[#F1E1CA] opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-[#7A4B3A] hover:bg-[#FAF5EE] hover:text-[#5B2814] rounded-md cursor-pointer"
                        onClick={() => abrirModalEditar(cliente)} 
                      >
                        <Edit3 size={18} />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title={cliente.isActive ? 'Inativar cliente' : 'Reativar cliente'}
                        className={cliente.isActive
                          ? 'h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md cursor-pointer'
                          : 'h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700 rounded-md cursor-pointer'}
                        onClick={() => confirmarAlteracaoStatus(cliente)}
                      >
                        {cliente.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-16 bg-white rounded-xl shadow-sm border border-[#F1E1CA] border-dashed">
                <User size={48} className="text-[#D5B99A] mb-4" />
                <p className="text-[18px] font-medium text-[#4A3224]">Nenhum cliente encontrado.</p>
                <p className="text-[14px] text-[#A67B66] mt-1">Verifique a ortografia ou cadastre um novo cliente.</p>
              </div>
            )}
          </div>

          <div className='mt-8'>
            <Pagination page={pagina} totalPages={totalPaginas} totalCount={totalClientes} onPageChange={setPagina} />
          </div>

        </div>
      </div>

      <Dialog open={modalEditarAberto} onOpenChange={setModalEditarAberto}>
        <DialogContent className="sm:max-w-[425px] bg-[#FDFBF7] border-[#D5B99A]">
          <DialogHeader>
            <DialogTitle className="text-[22px] font-bold text-[#261810] flex items-center gap-2">
              <Edit3 className="text-[#5B2814]" size={24} />
              Editar Cliente
            </DialogTitle>
          </DialogHeader>
          
          {clienteEditando && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-[14px] font-medium text-[#4A3224]">Nome Completo</label>
                <Input 
                  name="nome"
                  value={clienteEditando.nome} 
                  onChange={handleEditInputChange}
                  className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[14px] font-medium text-[#4A3224]">Email</label>
                <Input 
                  name="email"
                  type="email"
                  value={clienteEditando.email} 
                  onChange={handleEditInputChange}
                  className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[14px] font-medium text-[#4A3224]">CPF</label>
                  <Input
                    name="cpf"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    value={clienteEditando.cpf}
                    onChange={handleEditInputChange}
                    className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[14px] font-medium text-[#4A3224]">Telefone</label>
                  <Input
                    name="telefone"
                    inputMode="numeric"
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    value={clienteEditando.telefone}
                    onChange={handleEditInputChange}
                    className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-[14px] font-medium text-[#4A3224]">Data Nasc.</label>
                <Input
                  name="dataNasc"
                  type="date"
                  max={moment().format('YYYY-MM-DD')}
                  value={clienteEditando.dataNasc}
                  onChange={handleEditInputChange}
                  className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[14px] font-medium text-[#4A3224]">Cidade/UF</label>
                <Input
                  name="cidade"
                  value={clienteEditando.cidade}
                  onChange={handleEditInputChange}
                  className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setModalEditarAberto(false)}
              className="text-[#7A4B3A] hover:bg-[#FAF5EE]"
            >
              Cancelar
            </Button>
            <Button 
              onClick={salvarEdicao}
              className="bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA]"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalNovoAberto} onOpenChange={setModalNovoAberto}>
        <DialogContent className="sm:max-w-[425px] bg-[#FDFBF7] border-[#D5B99A]">
          <DialogHeader>
            <DialogTitle className="text-[22px] font-bold text-[#261810] flex items-center gap-2">
              <UserPlus className="text-[#5B2814]" size={24} />
              Novo Cliente
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-[14px] font-medium text-[#4A3224]">Nome Completo *</label>
              <Input 
                name="nome"
                placeholder="Ex: Maria Joaquina"
                value={novoCliente.nome} 
                onChange={handleNovoInputChange}
                className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-[14px] font-medium text-[#4A3224]">Email</label>
              <Input 
                name="email"
                type="email"
                placeholder="exemplo@email.com"
                value={novoCliente.email} 
                onChange={handleNovoInputChange}
                className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-[14px] font-medium text-[#4A3224]">CPF *</label>
                <Input
                  name="cpf"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  value={novoCliente.cpf}
                  onChange={handleNovoInputChange}
                  className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[14px] font-medium text-[#4A3224]">Telefone *</label>
                <Input
                  name="telefone"
                  inputMode="numeric"
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  value={novoCliente.telefone}
                  onChange={handleNovoInputChange}
                  className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-[14px] font-medium text-[#4A3224]">Data Nasc. *</label>
              <Input
                name="dataNasc"
                type="date"
                max={moment().format('YYYY-MM-DD')}
                value={novoCliente.dataNasc}
                onChange={handleNovoInputChange}
                className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-[14px] font-medium text-[#4A3224]">Cidade/UF</label>
              <Input
                name="cidade"
                placeholder="Ex: São Paulo, SP"
                value={novoCliente.cidade}
                onChange={handleNovoInputChange}
                className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setModalNovoAberto(false)}
              className="text-[#7A4B3A] hover:bg-[#FAF5EE]"
            >
              Cancelar
            </Button>
            <Button 
              onClick={salvarNovoCliente}
              className="bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA]"
            >
              Adicionar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalStatusAberto} onOpenChange={setModalStatusAberto}>
        <DialogContent className="max-w-md bg-[#FDFBF7] text-[#261810]">
          <DialogHeader>
            <DialogTitle className={`text-[20px] font-bold ${clienteParaAlterar?.isActive ? 'text-red-600' : 'text-green-700'}`}>
              {clienteParaAlterar?.isActive ? 'Inativar Cliente' : 'Reativar Cliente'}
            </DialogTitle>
            <DialogDescription className="text-[#4A3224] mt-2">
              {clienteParaAlterar?.isActive
                ? <>Deseja inativar o cliente <span className="font-bold">{clienteParaAlterar?.nome}</span>? Os dados e o prontuário serão mantidos, mas ele deixará de aparecer nas listas e nos agendamentos.</>
                : <>Deseja reativar o cliente <span className="font-bold">{clienteParaAlterar?.nome}</span>?</>}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="outline" 
              className="border-[#D5B99A] text-[#7A4B3A] hover:bg-[#FAF5EE] cursor-pointer"
              onClick={() => setModalStatusAberto(false)}
            >
              Cancelar
            </Button>
            <Button 
              className={`${clienteParaAlterar?.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white cursor-pointer shadow-sm`}
              onClick={alterarStatusCliente}
            >
              {clienteParaAlterar?.isActive ? 'Inativar' : 'Reativar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Clientes