import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import { Plus } from 'lucide-react'
import Calendar from '../components/calendario/Calendario.tsx'
import { agendamentoService, type Agendamento } from '../services'

const Home = () => {
  const [events, setEvents] = useState<Agendamento[]>([])

  useEffect(() => {
    agendamentoService.listar()
      .then(setEvents)
      .catch(() => alert("Não foi possível carregar os agendamentos."))
  }, [])

  const getProximasConsultas = () => {
    const hoje = moment();

    return events
      .filter((evento) => moment(evento.start).isSameOrAfter(hoje))
      .sort((a, b) => moment(a.start).valueOf() - moment(b.start).valueOf())
      .slice(0, 4); 
  }

  const proximasConsultas = getProximasConsultas();

  return (
    <div className='w-full min-h-screen flex flex-col bg-[#FDFBF7]'>
      
      <div className='bg-gradient-to-r from-[#F1E1CA] to-[#DFC4A4] h-auto w-full p-6 shadow-sm border-b border-[#D5B99A]/30'>
        <h1 className='text-[28px] font-bold text-[#261810] tracking-tight'>Bem Vindo(a)!</h1>
        <p className='text-[16px] text-[#4A3224] mt-1 font-medium'>
          Organize seus prontuários e gerencie sua agenda com facilidade.
        </p>
      </div>

      <div className='p-8 text-[25px] flex-1'>
        <div className='flex flex-col gap-4'>
          
          <div className='grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8'>
            
            <div className='min-w-0 overflow-x-auto'>
              <Calendar events={events} setEvents={setEvents} />
            </div>
        
            <div className='flex justify-center xl:justify-end'>
              
              <Card className='h-[400px] w-full max-w-[300px] p-0 overflow-hidden flex flex-col bg-[#FAF5EE] border-none shadow-xl rounded-xl'>
                
                <CardHeader className='flex bg-[#261810] h-auto p-4 w-full justify-center items-center text-[#F1E1CA] shadow-md z-10'>
                  <h1 className='text-[18px] font-semibold tracking-wide'>Próximas Consultas</h1>
                </CardHeader>

                <CardContent className="p-4 flex flex-col gap-3 overflow-y-auto">
                  
                  {proximasConsultas.length > 0 ? (
                    proximasConsultas.map((consulta) => (

                      <div 
                        key={consulta.id} 
                        className="bg-white p-3 rounded-lg border-l-4 border-[#5B2814] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col group cursor-pointer"
                      >
                        <span className="text-[15px] font-bold text-[#261810] truncate group-hover:text-[#5B2814] transition-colors">
                          {consulta.title}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[13px] font-medium text-[#7A4B3A]">
                            {moment(consulta.start).format('DD/MM/YYYY')}
                          </span>
                          <span className="text-[13px] text-[#A67B66]">•</span>
                          <span className="text-[13px] font-semibold text-[#5B2814]">
                            {moment(consulta.start).format('HH:mm')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full mt-6">
                      <div className="flex flex-col items-center gap-2 text-[#7A4B3A]">
                        <p className="text-[15px] font-medium text-center">
                          Sua agenda está livre.
                        </p>
                        <p className="text-[13px] text-center opacity-80">
                          Nenhuma consulta para os próximos dias.
                        </p>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home