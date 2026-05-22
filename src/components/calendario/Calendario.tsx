import React, { useState } from 'react'
import moment from 'moment'
import 'moment/locale/pt-br'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './Calendario.css'
import { Button } from '../ui/button'
import { FileText, Plus, Edit3, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

moment.locale('pt-br')

const withDragAndDropFunc =
  typeof withDragAndDrop === 'function'
    ? withDragAndDrop
    : (withDragAndDrop as any).default

const DragAndDropCalendar = withDragAndDropFunc(Calendar)
const localizer = momentLocalizer(moment)

const mensagensCalendario = {
  allDay: 'Dia Inteiro',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há agendamentos neste período.',
}

const Calendario = ({ events, setEvents }) => {
  const [nome, setNome] = useState('')
  const [dia, setDia] = useState('')
  const [horario, setHorario] = useState('')
  const [descricao, setDescricao] = useState('')

  const [dialog, OpenDialog] = useState(false)
  const [dialogMB, OpenDialogMB] = useState(false)

  const [dialogDetalhes, setDialogDetalhes] = useState(false)
  const [eventoSelecionado, setEventoSelecionado] = useState(null)

  const [dataAtual, setDataAtual] = useState(moment().toDate())
  const [visualizacaoAtual, setVisualizacaoAtual] = useState(Views.MONTH)

  const [isEditing, setIsEditing] = useState(false)
  const [editDia, setEditDia] = useState('')
  const [editHorario, setEditHorario] = useState('')
  const [editDescricao, setEditDescricao] = useState('')

  const customEventPropGetter = (event) => {
    return {
      style: {
        backgroundColor: '#5B2814',
        color: '#F1E1CA',
        borderRadius: '6px',
        border: 'none',
        display: 'block'
      }
    }
  }

  const agendar = (e) => {
    e.preventDefault();

    if (!nome || !dia || !horario) {
      alert("Preencha o nome, dia e horário!");
      return;
    }

    const dataInicio = moment(`${dia} ${horario}`, 'YYYY-MM-DD HH:mm').toDate();
    const dataFim = moment(dataInicio).add(1, 'hours').toDate();

    setEvents((eventosAnteriores) => {
      const proximoId = eventosAnteriores.length > 0
        ? Math.max(...eventosAnteriores.map(e => e.id)) + 1
        : 1;

      const novoEvento = {
        id: proximoId,
        title: nome,
        start: dataInicio,
        end: dataFim,
        desc: descricao,
        color: 'marrom',
        tipo: 'Novo Agendamento'
      };

      return [...eventosAnteriores, novoEvento];
    });

    setNome('');
    setDia('');
    setHorario('');
    setDescricao('');
    OpenDialog(false);
    OpenDialogMB(false);
  }

  const aoMoverEvento = ({ event, start, end }) => {
    const eventosAtualizados = events.map((ev) =>
      ev.id === event.id ? { ...ev, start, end } : ev
    )
    setEvents(eventosAtualizados)
  }

  const aoRedimensionarEvento = ({ event, start, end }) => {
    const eventosAtualizados = events.map((ev) =>
      ev.id === event.id ? { ...ev, start, end } : ev
    )
    setEvents(eventosAtualizados)
  }

  const aoClicarNoEvento = (evento) => {
    setEventoSelecionado(evento)
    setEditDia(moment(evento.start).format('YYYY-MM-DD'))
    setEditHorario(moment(evento.start).format('HH:mm'))
    setEditDescricao(evento.desc || '')
    setIsEditing(false)
    setDialogDetalhes(true)
  }

  const excluirAgendamento = () => {
    if (eventoSelecionado) {
      setEvents(events.filter(ev => ev.id !== eventoSelecionado.id))
      setDialogDetalhes(false)
    }
  }

  const salvarEdicao = () => {
    if (eventoSelecionado) {
      const dataInicio = moment(`${editDia} ${editHorario}`, 'YYYY-MM-DD HH:mm').toDate()
      const duracao = moment(eventoSelecionado.end).diff(moment(eventoSelecionado.start))
      const dataFim = moment(dataInicio).add(duracao, 'milliseconds').toDate()

      const eventosAtualizados = events.map((ev) =>
        ev.id === eventoSelecionado.id ? { ...ev, start: dataInicio, end: dataFim, desc: editDescricao } : ev
      )
      
      setEvents(eventosAtualizados)
      setEventoSelecionado({ ...eventoSelecionado, start: dataInicio, end: dataFim, desc: editDescricao })
      setIsEditing(false)
    }
  }

  return (
    <div className="w-full">
      <div className='calendar hidden md:flex flex-col h-[calc(100vh-100px)]'>
        <div className='grid grid-cols-2 pb-8 h-20 shrink-0'>
          <h1>Agenda de hoje</h1>
          <div className='flex justify-end '>
            <Dialog open={dialog} onOpenChange={OpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA] border-none shadow-md hover:shadow-lg transition-all rounded-md h-10 text-[16px] flex items-center gap-2 cursor-pointer">
                  <Plus size={20} /> Novo Agendamento
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px] bg-[#FDFBF7] border-[#D5B99A]">
                <form onSubmit={agendar}>
                  <DialogHeader>
                    <DialogTitle className="text-[22px] font-bold text-[#261810] flex items-center gap-2">
                      <Plus className="text-[#5B2814]" size={24} />
                      Novo Agendamento
                    </DialogTitle>
                    <DialogDescription className='text-[#A67B66]'>
                      Preencha as informações para adicionar um novo agendamento.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome" className="text-[14px] font-medium text-[#4A3224]">Nome</Label>
                      <Input id="nome" onChange={(e) => setNome(e.target.value)} value={nome} placeholder="Ex: Joao da Silva" className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="dia" className="text-[14px] font-medium text-[#4A3224]">Dia</Label>
                        <Input id="dia" type="date" onChange={(e) => setDia(e.target.value)} value={dia} className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="horario" className="text-[14px] font-medium text-[#4A3224]">Horário de Início</Label>
                        <Input id="horario" type="time" onChange={(e) => setHorario(e.target.value)} value={horario} className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black" />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="descricao" className="text-[14px] font-medium text-[#4A3224]">Descrição</Label>
                      <Input id="descricao" onChange={(e) => setDescricao(e.target.value)} value={descricao} placeholder="Detalhes adicionais..." className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black" />
                    </div>
                  </div>

                  <DialogFooter className="mt-2">
                    <DialogClose asChild>
                      <Button type="button" variant="ghost" className="text-[#7A4B3A] hover:bg-[#FAF5EE] cursor-pointer">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button type="submit" className="bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA] cursor-pointer">
                      Agendar
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex-1 min-h-0 h-full">
          <DragAndDropCalendar
            localizer={localizer}
            events={events}
            date={dataAtual}
            view={visualizacaoAtual}
            onNavigate={(novaData) => setDataAtual(novaData)}
            onView={(novaView) => setVisualizacaoAtual(novaView)}
            resizable={true}
            messages={mensagensCalendario}
            onEventDrop={aoMoverEvento}
            onEventResize={aoRedimensionarEvento}
            selectable={true}
            onSelectEvent={aoClicarNoEvento}
            eventPropGetter={customEventPropGetter}
          />
        </div>
      </div>

      <div className='md:hidden flex flex-col h-[calc(100vh-100px)]'>
        <Dialog open={dialogMB} onOpenChange={OpenDialogMB}>
          <DialogTrigger asChild>
            <Button className='fixed bottom-8 right-8 z-50 bg-[#5B2814] rounded-full h-14 w-14 p-4 text-[20px] text-[#F1E1CA] hover:bg-[#4A2010] cursor-pointer shadow-lg transition-all'>
              <Plus />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] bg-[#FDFBF7] border-[#D5B99A]">
            <form onSubmit={agendar}>
              <DialogHeader>
                <DialogTitle className="text-[22px] font-bold text-[#261810] flex items-center gap-2">
                  <Plus className="text-[#5B2814]" size={24} />
                  Novo Agendamento
                </DialogTitle>
                <DialogDescription className='text-[#A67B66]'>
                  Preencha as informações para adicionar um novo agendamento.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nomeMB" className="text-[14px] font-medium text-[#4A3224]">Nome</Label>
                  <Input id="nomeMB" onChange={(e) => setNome(e.target.value)} value={nome} placeholder="Ex: Joao da Silva" className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="diaMB" className="text-[14px] font-medium text-[#4A3224]">Dia</Label>
                    <Input id="diaMB" type="date" onChange={(e) => setDia(e.target.value)} value={dia} className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="horarioMB" className="text-[14px] font-medium text-[#4A3224]">Horário de Início</Label>
                    <Input id="horarioMB" type="time" onChange={(e) => setHorario(e.target.value)} value={horario} className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descricaoMB" className="text-[14px] font-medium text-[#4A3224]">Descrição</Label>
                  <Input id="descricaoMB" onChange={(e) => setDescricao(e.target.value)} value={descricao} placeholder="Detalhes adicionais..." className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black" />
                </div>
              </div>

              <DialogFooter className="mt-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" className="text-[#7A4B3A] hover:bg-[#FAF5EE] cursor-pointer">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" className="bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA] cursor-pointer">
                  Agendar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <div className="flex-1 min-h-0 h-full mt-4">
          <DragAndDropCalendar
            localizer={localizer}
            events={events}
            date={dataAtual}
            view={visualizacaoAtual}
            onNavigate={(novaData) => setDataAtual(novaData)}
            onView={(novaView) => setVisualizacaoAtual(novaView)}
            resizable={true}
            messages={mensagensCalendario}
            onEventDrop={aoMoverEvento}
            onEventResize={aoRedimensionarEvento}
            onSelectEvent={aoClicarNoEvento}
            eventPropGetter={customEventPropGetter}
          />
        </div>
      </div>

      <Dialog open={dialogDetalhes} onOpenChange={setDialogDetalhes}>
        <DialogContent className="sm:max-w-[425px] bg-[#FDFBF7] border-[#D5B99A]">
          <DialogHeader>
            <DialogTitle className="text-[22px] font-bold text-[#261810] flex items-center gap-2">
              <FileText className="text-[#5B2814]" size={24} />
              Detalhes da Consulta
            </DialogTitle>
          </DialogHeader>
          
          {eventoSelecionado && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-1 border-b border-[#F1E1CA] pb-3">
                <span className="text-[14px] font-medium text-[#A67B66]">Paciente/Nome</span>
                <p className="text-[18px] font-bold text-[#261810]">{eventoSelecionado.title}</p>
              </div>
              
              {isEditing ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="editDia" className="text-[14px] font-medium text-[#4A3224]">Novo Dia</Label>
                      <Input id="editDia" type="date" value={editDia} onChange={(e) => setEditDia(e.target.value)} className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editHorario" className="text-[14px] font-medium text-[#4A3224]">Novo Horário</Label>
                      <Input id="editHorario" type="time" value={editHorario} onChange={(e) => setEditHorario(e.target.value)} className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editDescricao" className="text-[14px] font-medium text-[#4A3224]">Nova Descrição</Label>
                    <Input id="editDescricao" value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} className="bg-white border-[#D5B99A] focus:ring-[#5B2814] text-black" />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1">
                      <span className="text-[14px] font-medium text-[#A67B66]">Data</span>
                      <p className="text-[16px] font-medium text-[#4A3224]">
                        {moment(eventoSelecionado.start).format('DD/MM/YYYY')}
                      </p>
                    </div>

                    <div className="grid gap-1">
                      <span className="text-[14px] font-medium text-[#A67B66]">Horário</span>
                      <p className="text-[16px] font-medium text-[#4A3224]">
                        {moment(eventoSelecionado.start).format('HH:mm')} às {moment(eventoSelecionado.end).format('HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-1 mt-2">
                    <span className="text-[14px] font-medium text-[#A67B66]">Descrição</span>
                    <p className="p-3 mt-1 bg-white border border-[#D5B99A] text-[#4A3224] rounded-md min-h-[80px] shadow-sm text-[15px]">
                      {eventoSelecionado.desc ? eventoSelecionado.desc : 'Nenhuma descrição fornecida.'}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter className="mt-2 flex sm:justify-between items-center w-full gap-2">
            {isEditing ? (
              <div className="flex justify-end gap-2 w-full">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="text-[#7A4B3A] hover:bg-[#FAF5EE] cursor-pointer">
                  Cancelar
                </Button>
                <Button onClick={salvarEdicao} className="bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA] cursor-pointer">
                  Salvar Alterações
                </Button>
              </div>
            ) : (
              <div className="flex flex-col-reverse sm:flex-row justify-between w-full gap-3">
                <Button type="button" variant="ghost" onClick={excluirAgendamento} className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer w-full sm:w-auto">
                  <Trash2 size={16} className="mr-2" /> Excluir
                </Button>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(true)} className="border-[#D5B99A] text-[#5B2814] hover:bg-[#FAF5EE] cursor-pointer w-full sm:w-auto">
                    <Edit3 size={16} className="mr-2" /> Editar Consulta
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" className="bg-[#5B2814] hover:bg-[#4A2010] text-[#F1E1CA] cursor-pointer w-full sm:w-auto">
                      Fechar
                    </Button>
                  </DialogClose>
                </div>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Calendario