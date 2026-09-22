import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, FileText, Calendar as CalendarIcon, User, Plus, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { prontuarioService, evolucaoService, type Prontuario, type Evolucao } from '@/services'
import Pagination from '@/components/Pagination'
import { useDebounce } from '@/hooks/useDebounce'

const ITENS_POR_PAGINA = 9
const EVOLUCOES_POR_PAGINA = 5

const Prontuarios = () => {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([])
  const [busca, setBusca] = useState('')
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [evolucoes, setEvolucoes] = useState<Evolucao[]>([])
  const [paginaEvolucoes, setPaginaEvolucoes] = useState(1)
  const [totalPaginasEvolucoes, setTotalPaginasEvolucoes] = useState(1)
  const [totalEvolucoes, setTotalEvolucoes] = useState(0)
  const [recarregarEvolucoes, setRecarregarEvolucoes] = useState(0)

  const buscaDebounced = useDebounce(busca)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalProntuarios, setTotalProntuarios] = useState(0)
  const [recarregar, setRecarregar] = useState(0)
  const [adicionandoEvolucao, setAdicionandoEvolucao] = useState(false)
  const [textoNovaEvolucao, setTextoNovaEvolucao] = useState('')
  
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false)
  const [pacienteParaRemover, setPacienteParaRemover] = useState(null)

  useEffect(() => {
    let cancelado = false

    prontuarioService.listar({ search: buscaDebounced, page: pagina, limit: ITENS_POR_PAGINA })
      .then((resultado) => {
        if (cancelado) return
        if (resultado.content.length === 0 && pagina > 1) {
          setPagina(Math.max(resultado.totalPages, 1))
          return
        }
        setProntuarios(resultado.content)
        setTotalPaginas(resultado.totalPages)
        setTotalProntuarios(resultado.totalCount)
      })
      .catch(() => {
        if (!cancelado) alert("Não foi possível carregar os prontuários.")
      })

    return () => { cancelado = true }
  }, [buscaDebounced, pagina, recarregar])

  useEffect(() => {
    if (!pacienteSelecionado || !modalAberto) return
    let cancelado = false

    evolucaoService.listar(pacienteSelecionado.id, { page: paginaEvolucoes, limit: EVOLUCOES_POR_PAGINA })
      .then((resultado) => {
        if (cancelado) return
        setEvolucoes(resultado.content)
        setTotalPaginasEvolucoes(resultado.totalPages)
        setTotalEvolucoes(resultado.totalCount)
      })
      .catch(() => {
        if (!cancelado) alert("Não foi possível carregar as evoluções do paciente.")
      })

    return () => { cancelado = true }
  }, [pacienteSelecionado, modalAberto, paginaEvolucoes, recarregarEvolucoes])

  const alterarBusca = (valor) => {
    setBusca(valor)
    setPagina(1)
  }

  const abrirProntuario = (paciente) => {
    setPacienteSelecionado(paciente)
    setEvolucoes([])
    setPaginaEvolucoes(1)
    setTotalPaginasEvolucoes(1)
    setTotalEvolucoes(0)
    setAdicionandoEvolucao(false) 
    setModalAberto(true)
  }

  const confirmarExclusao = (paciente) => {
    setPacienteParaRemover(paciente)
    setModalExclusaoAberto(true)
  }

  const removerProntuario = async () => {
    if (pacienteParaRemover) {
      try {
        await prontuarioService.remover(pacienteParaRemover.id)
        setModalExclusaoAberto(false)
        setPacienteParaRemover(null)
        setRecarregar((n) => n + 1)
      } catch {
        alert("Não foi possível remover o prontuário.")
      }
    }
  }

  const salvarNovaEvolucao = async () => {
    if (!textoNovaEvolucao.trim()) {
      alert("A descrição da evolução não pode estar vazia.")
      return
    }

    try {
      const novaEvolucao = await evolucaoService.criar(pacienteSelecionado.id, textoNovaEvolucao)
      setProntuarios(prev => prev.map(p => p.id === pacienteSelecionado.id ? { ...p, ultimaConsulta: novaEvolucao.data } : p))
      setTextoNovaEvolucao('')
      setAdicionandoEvolucao(false)
      setPaginaEvolucoes(1)
      setRecarregarEvolucoes((n) => n + 1)
    } catch {
      alert("Não foi possível salvar a evolução.")
    }
  }

  const alterarStatusPaciente = async (pacienteId, novoStatus) => {
    try {
      const atualizado = await prontuarioService.alterarStatus(pacienteId, novoStatus)
      setProntuarios(prev => prev.map(p => p.id === pacienteId ? atualizado : p))
    } catch {
      alert("Não foi possível alterar o status do paciente.")
    }
  }

  return (
    <div className='w-full min-h-screen flex flex-col bg-[#FDFBF7]'>
      
      <div className='bg-gradient-to-r from-[#F1E1CA] to-[#DFC4A4] h-auto w-full p-6 shadow-sm border-b border-[#D5B99A]/30 flex justify-between items-center max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-4'>
        <div>
          <h1 className='text-[28px] font-bold text-[#261810] tracking-tight'>Prontuários</h1>
          <p className='text-[16px] text-[#4A3224] mt-1 font-medium'>
            Acesse e gerencie o histórico clínico dos seus pacientes.
          </p>
        </div>
        
        <div className="relative w-full max-w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A4B3A] h-5 w-5" />
          <Input 
            type="text" 
            placeholder="Buscar paciente..." 
            value={busca}
            onChange={(e) => alterarBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border-[#D5B99A] text-[#261810] placeholder:text-[#A67B66] focus:border-[#5B2814] focus:ring-[#5B2814] rounded-lg shadow-sm"
          />
        </div>
      </div>

      <div className='p-8 flex-1'>
        <div className='max-w-[1200px] mx-auto'>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {prontuarios.length > 0 ? (
              prontuarios.map((paciente) => (
                <Card 
                  key={paciente.id} 
                  className='bg-white border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden group border-l-4 border-l-[#5B2814]'
                >
                  <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                    
                    <div className="flex gap-4 items-start">
                      <div className="bg-[#FAF5EE] p-3 rounded-full text-[#5B2814]">
                        <User size={24} />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[18px] font-bold text-[#261810] truncate group-hover:text-[#5B2814] transition-colors cursor-pointer" onClick={() => abrirProntuario(paciente)}>
                          {paciente.nome}
                        </span>
                        <span className="text-[14px] font-medium text-[#7A4B3A] mt-1">
                          {paciente.telefone}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-[#F1E1CA]">
                      <div className="flex items-center gap-2 text-[#A67B66]">
                        <CalendarIcon size={16} />
                        <span className="text-[13px]">
                          Última consulta: <span className="font-semibold text-[#4A3224]">{paciente.ultimaConsulta ? moment(paciente.ultimaConsulta).format('DD/MM/YYYY') : '—'}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <Select 
                          value={paciente.status} 
                          onValueChange={(value) => alterarStatusPaciente(paciente.id, value)}
                        >
                          <SelectTrigger 
                            className={`h-7 px-3 py-1 rounded-full text-[12px] font-bold border-none shadow-none focus:ring-0 focus:ring-offset-0 w-[130px] ${
                              paciente.status === 'Alta' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 
                              paciente.status === 'Em Tratamento' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 
                              'bg-[#F1E1CA] text-[#5B2814] hover:bg-[#e6d3ba]'
                            } transition-colors`}
                          >
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-[#D5B99A]">
                            <SelectItem value="Em Tratamento" className="focus:bg-blue-50 focus:text-blue-700 cursor-pointer">
                              Em Tratamento
                            </SelectItem>
                            <SelectItem value="Alta" className="focus:bg-green-50 focus:text-green-700 cursor-pointer">
                              Alta
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            className="text-[#5B2814] hover:bg-[#FAF5EE] p-2 h-auto rounded-md flex gap-2 items-center text-[13px] font-semibold cursor-pointer"
                            onClick={() => abrirProntuario(paciente)} 
                          >
                            <FileText size={16} />
                            Abrir
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="text-red-500 hover:bg-red-50 hover:text-red-700 p-2 h-auto rounded-md flex items-center cursor-pointer"
                            onClick={() => confirmarExclusao(paciente)} 
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-[#F1E1CA] border-dashed">
                <Search size={40} className="text-[#D5B99A] mb-4" />
                <p className="text-[18px] font-medium text-[#4A3224]">Nenhum paciente encontrado.</p>
                <p className="text-[14px] text-[#A67B66] mt-1">Tente pesquisar por outro nome.</p>
              </div>
            )}
          </div>

          <div className='mt-8'>
            <Pagination page={pagina} totalPages={totalPaginas} totalCount={totalProntuarios} onPageChange={setPagina} />
          </div>

        </div>
      </div>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col bg-[#FDFBF7] text-[#261810]">
          
          {pacienteSelecionado && (
            <>
              <DialogHeader className="border-b border-[#D5B99A] pb-4 shrink-0">
                <DialogTitle className="flex items-center gap-3 text-[22px]">
                  <div className="bg-[#FAF5EE] p-2 rounded-full text-[#5B2814]">
                    <User size={24} />
                  </div>
                  Prontuário: {pacienteSelecionado.nome}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-2 py-4 flex flex-col gap-4">
                
                {evolucoes.length > 0 ? (
                  evolucoes.map((evolucao) => (
                    <div key={evolucao.id} className="bg-white p-4 rounded-lg border-l-4 border-[#5B2814] shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold flex items-center gap-2 text-[#4A3224]">
                          <CalendarIcon size={16}/> {moment(evolucao.data).format('DD/MM/YYYY')}
                        </span>
                        <span className="text-[12px] bg-[#FAF5EE] text-[#5B2814] px-2 py-1 rounded font-semibold">
                          {evolucao.sessao}
                        </span>
                      </div>
                      <p className="text-[#4A3224] text-[15px] leading-relaxed whitespace-pre-wrap">
                        {evolucao.descricao}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center mt-10 text-[#A67B66]">
                    Nenhuma evolução cadastrada para este paciente ainda.
                  </div>
                )}
                
              </div>

              {totalEvolucoes > 0 && (
                <div className="shrink-0 pb-3">
                  <Pagination page={paginaEvolucoes} totalPages={totalPaginasEvolucoes} totalCount={totalEvolucoes} onPageChange={setPaginaEvolucoes} compact />
                </div>
              )}

              <div className="border-t border-[#D5B99A] pt-4 shrink-0 mt-auto">
                {adicionandoEvolucao ? (
                  <div className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow-inner border border-[#F1E1CA]">
                    <textarea 
                      className="w-full min-h-[100px] p-3 rounded-md bg-[#FAF5EE] border border-[#D5B99A] focus:outline-none focus:ring-2 focus:ring-[#5B2814] text-[#261810] resize-none"
                      placeholder="Descreva a evolução da sessão de hoje..."
                      value={textoNovaEvolucao}
                      onChange={(e) => setTextoNovaEvolucao(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button 
                        variant="ghost" 
                        className="text-[#7A4B3A] hover:bg-[#FAF5EE] cursor-pointer"
                        onClick={() => setAdicionandoEvolucao(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        className="bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA] cursor-pointer"
                        onClick={salvarNovaEvolucao}
                      >
                        Salvar Evolução
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA] py-6 text-[16px] cursor-pointer shadow-md"
                    onClick={() => setAdicionandoEvolucao(true)}
                  >
                    <Plus className="mr-2"/> Adicionar Nova Evolução
                  </Button>
                )}
              </div>
            </>
          )}

        </DialogContent>
      </Dialog>

      <Dialog open={modalExclusaoAberto} onOpenChange={setModalExclusaoAberto}>
        <DialogContent className="max-w-md bg-[#FDFBF7] text-[#261810]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold text-red-600">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-[#4A3224] mt-2">
              Tem certeza que deseja remover o prontuário de <span className="font-bold">{pacienteParaRemover?.nome}</span>? Esta ação não pode ser desfeita e todas as evoluções serão apagadas.
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
              onClick={removerProntuario}
            >
              Remover Prontuário
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Prontuarios