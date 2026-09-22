package br.com.inova.sgp.services;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.inova.sgp.models.Agendamento;
import br.com.inova.sgp.models.Cliente;
import br.com.inova.sgp.repositories.AgendamentoRepository;
import br.com.inova.sgp.repositories.ClienteRepository;

@Service
public class AgendamentoService {

    private final AgendamentoRepository repository;
    private final ClienteRepository clienteRepository;

    public AgendamentoService(AgendamentoRepository repository, ClienteRepository clienteRepository) {
        this.repository = repository;
        this.clienteRepository = clienteRepository;
    }

    //Get
    public List<Agendamento> searchAll(){
        return repository.findAllByOrderByStartTimeAsc();
    }

    public Agendamento searchById(Long id){
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Agendamento não encontrado com o ID:" + id));
    }

    //Post
    public Agendamento insertAgendamento(Long clienteId, Agendamento agendamento){
        agendamento.setCliente(findCliente(clienteId));
        validateInterval(agendamento);
        return repository.save(agendamento);
    }

    //Put
    public Agendamento updateAgendamento(Long id, Long clienteId, Agendamento agendamentoUpdate){
        if(!repository.existsById(id)){
            throw new RuntimeException("Não foi possível atualizar agendamento, Id: " + id + " não encontrado");
        }
        agendamentoUpdate.setId(id);
        agendamentoUpdate.setCliente(findCliente(clienteId));
        validateInterval(agendamentoUpdate);
        return repository.save(agendamentoUpdate);
    }

    //Delete
    public void deleteAgendamento(Long id){
        if(!repository.existsById(id)){
            throw new RuntimeException("Não foi possível deletar o agendamento, Id: " + id + " não encontrado");
        }
        repository.deleteById(id);
    }

    private Cliente findCliente(Long clienteId){
        if(clienteId == null){
            return null;
        }
        Cliente cliente = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID:" + clienteId));
        if(!cliente.getIsActive()){
            throw new RuntimeException("Não é possível agendar para o cliente inativo, Id: " + clienteId);
        }
        return cliente;
    }

    private void validateInterval(Agendamento agendamento){
        if(!agendamento.getEndTime().isAfter(agendamento.getStartTime())){
            throw new RuntimeException("O horário de término deve ser posterior ao de início");
        }
    }
}
