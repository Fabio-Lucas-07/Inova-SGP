import React, { useState } from 'react'
import { Button } from '@/components/ui/button' 
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Plus, User, Phone, Mail, Edit3, Trash2, MapPin, Calendar as CalendarIcon, UserPlus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"

const clientesMock = [
  { id: 1, nome: 'João da Silva', email: 'joao.silva@email.com', telefone: '(11) 98765-4321', dataNasc: '15/04/1985', cidade: 'São Paulo, SP' },
  { id: 2, nome: 'Maria Oliveira', email: 'maria.oliveira@email.com', telefone: '(11) 91234-5678', dataNasc: '22/08/1990', cidade: 'Campinas, SP' },
  { id: 3, nome: 'Carlos Eduardo Souza', email: 'carlos.souza@email.com', telefone: '(11) 99999-1111', dataNasc: '05/11/1978', cidade: 'Belo Horizonte, MG' },
  { id: 4, nome: 'Ana Beatriz Alves', email: 'ana.beatriz@email.com', telefone: '(11) 98888-2222', dataNasc: '30/01/1995', cidade: 'Rio de Janeiro, RJ' },
]

const estadoInicialNovoCliente = {
  nome: '',
  email: '',
  telefone: '',
  dataNasc: '',
  cidade: ''
}

const Clientes = () => {
  const [clientes, setClientes] = useState(clientesMock)
  const [busca, setBusca] = useState('')
  
  const [modalEditarAberto, setModalEditarAberto] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)

  const [modalNovoAberto, setModalNovoAberto] = useState(false)
  const [novoCliente, setNovoCliente] = useState(estadoInicialNovoCliente)

  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false)
  const [clienteParaRemover, setClienteParaRemover] = useState(null)

  const confirmarExclusao = (cliente) => {
    setClienteParaRemover(cliente)
    setModalExclusaoAberto(true)
  }

  const removerCliente = () => {
    if (clienteParaRemover) {
      const novaLista = clientes.filter((cliente) => cliente.id !== clienteParaRemover.id)
      setClientes(novaLista)
      setModalExclusaoAberto(false)
      setClienteParaRemover(null)
    }
  }

  const abrirModalEditar = (cliente) => {
    setClienteEditando({ ...cliente }) 
    setModalEditarAberto(true)
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setClienteEditando(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const salvarEdicao = () => {
    setClientes(clientes.map(c => c.id === clienteEditando.id ? clienteEditando : c))
    setModalEditarAberto(false)
    setClienteEditando(null)
  }

  const abrirModalNovo = () => {
    setNovoCliente(estadoInicialNovoCliente)
    setModalNovoAberto(true)
  }

  const handleNovoInputChange = (e) => {
    const { name, value } = e.target
    setNovoCliente(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const salvarNovoCliente = () => {
    if (!novoCliente.nome.trim()) {
      alert("O nome do cliente é obrigatório.")
      return
    }

    const novoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1
    
    const clienteParaAdicionar = {
      ...novoCliente,
      id: novoId
    }

    setClientes([...clientes, clienteParaAdicionar])
    setModalNovoAberto(false)
    setNovoCliente(estadoInicialNovoCliente)
  }

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase())
  )

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
              onChange={(e) => setBusca(e.target.value)}
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
          
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <Card 
                  key={cliente.id} 
                  className='bg-white border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden group border-t-4 border-t-[#5B2814]'
                >
                  <CardContent className="p-6 flex flex-col h-full justify-between gap-5">
                    
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
                        <span className="text-[14px] font-medium truncate">Nasc: {cliente.dataNasc}</span>
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
                        className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md cursor-pointer"
                        onClick={() => confirmarExclusao(cliente)}
                      >
                        <Trash2 size={18} />
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
                  <label className="text-[14px] font-medium text-[#4A3224]">Telefone</label>
                  <Input 
                    name="telefone"
                    value={clienteEditando.telefone} 
                    onChange={handleEditInputChange}
                    className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-[14px] font-medium text-[#4A3224]">Data Nasc.</label>
                  <Input 
                    name="dataNasc"
                    value={clienteEditando.dataNasc} 
                    onChange={handleEditInputChange}
                    className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
                  />
                </div>
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
                <label className="text-[14px] font-medium text-[#4A3224]">Telefone</label>
                <Input 
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={novoCliente.telefone} 
                  onChange={handleNovoInputChange}
                  className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[14px] font-medium text-[#4A3224]">Data Nasc.</label>
                <Input 
                  name="dataNasc"
                  placeholder="DD/MM/AAAA"
                  value={novoCliente.dataNasc} 
                  onChange={handleNovoInputChange}
                  className="bg-white border-[#D5B99A] focus:ring-[#5B2814]"
                />
              </div>
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

      <Dialog open={modalExclusaoAberto} onOpenChange={setModalExclusaoAberto}>
        <DialogContent className="max-w-md bg-[#FDFBF7] text-[#261810]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold text-red-600">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-[#4A3224] mt-2">
              Tem certeza que deseja remover o cliente <span className="font-bold">{clienteParaRemover?.nome}</span>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="outline" 
              className="border-[#D5B99A] text-[#7A4B3A] hover:bg-[#FAF5EE] cursor-pointer"
              onClick={() => setModalExclusaoAberto(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm"
              onClick={removerCliente}
            >
              Remover Cliente
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Clientes