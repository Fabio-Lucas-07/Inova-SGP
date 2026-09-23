import { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Wallet, ClipboardList, TrendingUp, Trophy, Table2 } from 'lucide-react'
import { vendaService, type VendaResumo, type VendaDia } from '@/services'

type Periodo = 'semanal' | 'mensal'

const abas: { valor: Periodo, rotulo: string }[] = [
  { valor: 'semanal', rotulo: 'Semanal' },
  { valor: 'mensal', rotulo: 'Mensal' },
]

const CHART_HEIGHT = 200
const COR_BARRA = '#5B2814'
const COR_BARRA_HOVER = '#8A5A3D'


const DIAS_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const DIAS_COMPLETO = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const diaSemanaAbrev = (data: string) => DIAS_ABREV[moment(data).day()]
const diaSemanaCompleto = (data: string) => DIAS_COMPLETO[moment(data).day()]
const mesAno = (referencia: moment.Moment) => `${MESES[referencia.month()]} de ${referencia.year()}`

const formatarMoeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatarMoedaEixo = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const calcularTetoEixo = (valor: number) => {
  if (valor <= 0) return 100
  const magnitude = Math.pow(10, Math.floor(Math.log10(valor)))
  const passo = valor / magnitude
  const passoArredondado = passo <= 1 ? 1 : passo <= 2 ? 2 : passo <= 5 ? 5 : 10
  return passoArredondado * magnitude
}

const diaEhHoje = (data: string) => moment(data).isSame(moment(), 'day')

const GraficoVendas = ({ dias, periodo }: { dias: VendaDia[], periodo: Periodo }) => {
  const [indiceForcado, setIndiceForcado] = useState<number | null>(null)

  const temValores = dias.some((d) => d.total > 0)
  const maiorValor = Math.max(0, ...dias.map((d) => d.total))
  const tetoEixo = calcularTetoEixo(maiorValor)
  const indicePico = temValores ? dias.reduce((melhorIdx, d, i) => (d.total > dias[melhorIdx].total ? i : melhorIdx), 0) : -1

  const larguraSlot = periodo === 'semanal' ? 56 : 26
  const mostrarRotulo = (i: number) => {
    if (periodo === 'semanal') return true
    if (i === 0 || i === dias.length - 1) return true
    if (diaEhHoje(dias[i].data)) return true
    return i % 5 === 0
  }

  if (!temValores) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Wallet size={40} className="text-[#D5B99A] mb-3" />
        <p className="text-[15px] font-medium text-[#4A3224]">Nenhum valor registrado neste período.</p>
        <p className="text-[13px] text-[#A67B66] mt-1">Cadastre o valor das consultas na agenda para ver o gráfico aqui.</p>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="flex flex-col justify-between shrink-0 w-14 text-right" style={{ height: CHART_HEIGHT }}>
        <span className="text-[11px] font-medium text-[#A67B66] leading-none">{formatarMoedaEixo(tetoEixo)}</span>
        <span className="text-[11px] font-medium text-[#A67B66] leading-none">{formatarMoedaEixo(tetoEixo / 2)}</span>
        <span className="text-[11px] font-medium text-[#A67B66] leading-none">R$ 0</span>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div style={{ minWidth: dias.length * larguraSlot }}>
          <div className="relative" style={{ height: CHART_HEIGHT }}>
            <div className="absolute inset-x-0 top-0 border-t border-[#F1E1CA]" />
            <div className="absolute inset-x-0 top-1/2 border-t border-[#F1E1CA]" />
            <div className="absolute inset-x-0 bottom-0 border-t border-[#D5B99A]" />

            <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${dias.length}, ${larguraSlot}px)` }}>
              {dias.map((dia, i) => {
                const alturaPct = tetoEixo > 0 ? Math.max((dia.total / tetoEixo) * 100, dia.total > 0 ? 2 : 0) : 0
                const emFoco = indiceForcado === i
                const ehPico = i === indicePico
                const hoje = diaEhHoje(dia.data)

                return (
                  <button
                    key={dia.data}
                    type="button"
                    onMouseEnter={() => setIndiceForcado(i)}
                    onMouseLeave={() => setIndiceForcado(null)}
                    onFocus={() => setIndiceForcado(i)}
                    onBlur={() => setIndiceForcado(null)}
                    aria-label={`${diaSemanaCompleto(dia.data)}, ${moment(dia.data).format('DD')} de ${MESES[moment(dia.data).month()]}: ${formatarMoeda(dia.total)}, ${dia.quantidadeConsultas} ${dia.quantidadeConsultas === 1 ? 'consulta' : 'consultas'}`}
                    className="relative flex flex-col items-center justify-end h-full outline-none cursor-pointer bg-transparent border-none p-0"
                  >
                    {hoje && <div className="absolute inset-0 bg-[#F1E1CA]/60 rounded-md" />}

                    <div
                      className="relative w-5 rounded-t-[4px] transition-colors"
                      style={{
                        height: `${alturaPct}%`,
                        backgroundColor: emFoco ? COR_BARRA_HOVER : COR_BARRA,
                      }}
                    >
                      {ehPico && !emFoco && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-bold text-[#5B2814] whitespace-nowrap">
                          {formatarMoeda(dia.total)}
                        </span>
                      )}

                      {emFoco && (
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 bg-[#261810] text-[#F1E1CA] text-[12px] rounded-md px-3 py-2 shadow-lg whitespace-nowrap pointer-events-none">
                          <p className="font-bold text-[13px]">{formatarMoeda(dia.total)}</p>
                          <p className="text-[#D5B99A]">
                            {diaSemanaAbrev(dia.data)}, {moment(dia.data).format('DD/MM')} · {dia.quantidadeConsultas} {dia.quantidadeConsultas === 1 ? 'consulta' : 'consultas'}
                          </p>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid mt-2" style={{ gridTemplateColumns: `repeat(${dias.length}, ${larguraSlot}px)` }}>
            {dias.map((dia, i) => (
              <div key={dia.data} className="flex flex-col items-center gap-0.5">
                {mostrarRotulo(i) ? (
                  <>
                    {periodo === 'semanal' && (
                      <span className={`text-[11px] font-semibold ${diaEhHoje(dia.data) ? 'text-[#261810]' : 'text-[#7A4B3A]'}`}>{diaSemanaAbrev(dia.data)}</span>
                    )}
                    <span className={`text-[11px] ${diaEhHoje(dia.data) ? 'font-bold text-[#261810]' : 'text-[#A67B66]'}`}>
                      {moment(dia.data).format('DD')}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] text-transparent select-none">·</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const Vendas = () => {
  const [periodo, setPeriodo] = useState<Periodo>('semanal')
  const [referencia, setReferencia] = useState(moment())
  const [resumo, setResumo] = useState<VendaResumo | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [mostrarTabela, setMostrarTabela] = useState(false)

  useEffect(() => {
    let cancelado = false
    setCarregando(true)

    const busca = periodo === 'semanal'
      ? vendaService.semanal(referencia.format('YYYY-MM-DD'))
      : vendaService.mensal(referencia.year(), referencia.month() + 1)

    busca
      .then((dados) => { if (!cancelado) setResumo(dados) })
      .catch(() => { if (!cancelado) alert('Não foi possível carregar os dados de vendas.') })
      .finally(() => { if (!cancelado) setCarregando(false) })

    return () => { cancelado = true }
  }, [periodo, referencia])

  const alterarPeriodo = (valor: Periodo) => {
    setPeriodo(valor)
    setReferencia(moment())
  }

  const navegar = (direcao: 1 | -1) => {
    setReferencia((atual) => moment(atual).add(direcao, periodo === 'semanal' ? 'weeks' : 'months'))
  }

  const irParaHoje = () => setReferencia(moment())

  const rotuloPeriodo = periodo === 'semanal'
    ? `${moment(referencia).startOf('isoWeek').format('DD/MM/YYYY')} — ${moment(referencia).endOf('isoWeek').format('DD/MM/YYYY')}`
    : mesAno(referencia).replace(/^\w/, (c) => c.toUpperCase())

  const dias = resumo?.dias ?? []

  const diaPico = useMemo(() => {
    if (dias.length === 0) return null
    return dias.reduce((melhor, d) => (d.total > (melhor?.total ?? -1) ? d : melhor), null as VendaDia | null)
  }, [dias])

  const ticketMedio = resumo && resumo.quantidadeConsultas > 0
    ? resumo.totalPeriodo / resumo.quantidadeConsultas
    : 0

  const estaNoPeriodoAtual = periodo === 'semanal'
    ? moment().isBetween(moment(referencia).startOf('isoWeek'), moment(referencia).endOf('isoWeek'), 'day', '[]')
    : moment().isSame(referencia, 'month')

  return (
    <div className='w-full min-h-screen flex flex-col bg-[#FDFBF7]'>

      <div className='bg-gradient-to-r from-[#F1E1CA] to-[#DFC4A4] h-auto w-full p-6 shadow-sm border-b border-[#D5B99A]/30'>
        <h1 className='text-[28px] font-bold text-[#261810] tracking-tight'>Controle de Vendas</h1>
        <p className='text-[16px] text-[#4A3224] mt-1 font-medium'>
          Acompanhe os valores das consultas realizadas por semana e por mês.
        </p>
      </div>

      <div className='p-8 flex-1'>
        <div className='max-w-[1000px] mx-auto flex flex-col gap-6'>

          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex gap-2'>
              {abas.map((aba) => (
                <Button
                  key={aba.valor}
                  variant={periodo === aba.valor ? 'default' : 'outline'}
                  onClick={() => alterarPeriodo(aba.valor)}
                  className={periodo === aba.valor
                    ? 'bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA] cursor-pointer'
                    : 'border-[#D5B99A] text-[#7A4B3A] hover:bg-[#FAF5EE] cursor-pointer'}
                >
                  {aba.rotulo}
                </Button>
              ))}
            </div>

            <div className='flex items-center gap-2'>
              <Button variant="outline" size="icon" onClick={() => navegar(-1)} className='border-[#D5B99A] text-[#5B2814] hover:bg-[#FAF5EE] cursor-pointer'>
                <ChevronLeft size={18} />
              </Button>
              <button
                onClick={irParaHoje}
                disabled={estaNoPeriodoAtual}
                className={`text-[15px] font-semibold min-w-[220px] text-center rounded-md py-1.5 transition-colors ${estaNoPeriodoAtual ? 'text-[#261810] cursor-default' : 'text-[#5B2814] hover:bg-[#FAF5EE] cursor-pointer'
                  }`}
                title={estaNoPeriodoAtual ? undefined : 'Voltar para hoje'}
              >
                {rotuloPeriodo}
              </button>
              <Button variant="outline" size="icon" onClick={() => navegar(1)} className='border-[#D5B99A] text-[#5B2814] hover:bg-[#FAF5EE] cursor-pointer'>
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Card className='bg-white border-none shadow-md rounded-xl border-t-4 border-t-[#5B2814]'>
              <CardContent className='flex items-center gap-3 p-5'>
                <div className='bg-[#FAF5EE] p-3 rounded-lg text-[#5B2814] shrink-0'>
                  <Wallet size={20} />
                </div>
                <div className='flex flex-col min-w-0'>
                  <span className='text-[12px] font-medium text-[#A67B66]'>Total no período</span>
                  <span className='text-[20px] font-bold text-[#261810] truncate'>{formatarMoeda(resumo?.totalPeriodo ?? 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white border-none shadow-md rounded-xl border-t-4 border-t-[#5B2814]'>
              <CardContent className='flex items-center gap-3 p-5'>
                <div className='bg-[#FAF5EE] p-3 rounded-lg text-[#5B2814] shrink-0'>
                  <ClipboardList size={20} />
                </div>
                <div className='flex flex-col min-w-0'>
                  <span className='text-[12px] font-medium text-[#A67B66]'>Consultas realizadas</span>
                  <span className='text-[20px] font-bold text-[#261810] truncate'>{resumo?.quantidadeConsultas ?? 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white border-none shadow-md rounded-xl border-t-4 border-t-[#5B2814]'>
              <CardContent className='flex items-center gap-3 p-5'>
                <div className='bg-[#FAF5EE] p-3 rounded-lg text-[#5B2814] shrink-0'>
                  <TrendingUp size={20} />
                </div>
                <div className='flex flex-col min-w-0'>
                  <span className='text-[12px] font-medium text-[#A67B66]'>Ticket médio</span>
                  <span className='text-[20px] font-bold text-[#261810] truncate'>{formatarMoeda(ticketMedio)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white border-none shadow-md rounded-xl border-t-4 border-t-[#5B2814]'>
              <CardContent className='flex items-center gap-3 p-5'>
                <div className='bg-[#FAF5EE] p-3 rounded-lg text-[#5B2814] shrink-0'>
                  <Trophy size={20} />
                </div>
                <div className='flex flex-col min-w-0'>
                  <span className='text-[12px] font-medium text-[#A67B66]'>Melhor dia</span>
                  <span className='text-[20px] font-bold text-[#261810] truncate'>
                    {diaPico && diaPico.total > 0 ? formatarMoeda(diaPico.total) : '—'}
                  </span>
                  {diaPico && diaPico.total > 0 && (
                    <span className='text-[11px] text-[#A67B66]'>{diaSemanaCompleto(diaPico.data)}, {moment(diaPico.data).format('DD/MM')}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className='p-0 bg-white border-none shadow-md rounded-xl overflow-hidden'>
  <CardHeader className='bg-[#261810] p-4 flex flex-row items-center justify-between space-y-0'>
    <h2 className='text-[16px] font-semibold text-[#F1E1CA]'>
      Valores por dia
    </h2>
    <button
      onClick={() => setMostrarTabela((v) => !v)}
      className='flex items-center gap-1.5 text-[13px] font-medium text-[#D5B99A] hover:text-[#F1E1CA] transition-colors cursor-pointer'
    >
      <Table2 size={14} />
      {mostrarTabela ? 'Ver gráfico' : 'Ver como tabela'}
    </button>
  </CardHeader>
            <CardContent className='p-5'>
              {carregando ? (
                <p className='text-[14px] text-[#A67B66] text-center py-16'>Carregando...</p>
              ) : mostrarTabela ? (
                dias.length > 0 ? (
                  <table className='w-full text-[14px]'>
                    <thead>
                      <tr className='border-b border-[#F1E1CA] text-left text-[#A67B66] text-[12px] uppercase tracking-wide'>
                        <th className='py-2 font-medium'>Data</th>
                        <th className='py-2 font-medium text-right'>Valor</th>
                        <th className='py-2 font-medium text-right'>Consultas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dias.map((dia) => (
                        <tr key={dia.data} className={`border-b border-[#F1E1CA]/60 ${diaEhHoje(dia.data) ? 'bg-[#FAF5EE]' : ''}`}>
                          <td className='py-2 text-[#4A3224] font-medium'>
                            {diaSemanaCompleto(dia.data)}, {moment(dia.data).format('DD/MM')}
                          </td>
                          <td className='py-2 text-right font-semibold text-[#261810] tabular-nums'>
                            {formatarMoeda(dia.total)}
                          </td>
                          <td className='py-2 text-right text-[#7A4B3A] tabular-nums'>
                            {dia.quantidadeConsultas}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className='text-[14px] text-[#A67B66] text-center py-16'>Nenhum valor registrado neste período.</p>
                )
              ) : (
                <GraficoVendas dias={dias} periodo={periodo} />
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default Vendas
