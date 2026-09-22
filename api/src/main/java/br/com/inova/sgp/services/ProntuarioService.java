package br.com.inova.sgp.services;

import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.inova.sgp.models.Cliente;
import br.com.inova.sgp.models.Evolucao;
import br.com.inova.sgp.models.Prontuario;
import br.com.inova.sgp.models.StatusProntuario;
import br.com.inova.sgp.repositories.ClienteRepository;
import br.com.inova.sgp.repositories.EvolucaoRepository;
import br.com.inova.sgp.repositories.ProntuarioRepository;

@Service
public class ProntuarioService {

    private final ProntuarioRepository repository;
    private final ClienteRepository clienteRepository;
    private final EvolucaoRepository evolucaoRepository;

    public ProntuarioService(ProntuarioRepository repository, ClienteRepository clienteRepository,
            EvolucaoRepository evolucaoRepository) {
        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.evolucaoRepository = evolucaoRepository;
    }

    //Get
    public Page<Prontuario> searchAll(String search, boolean includeInactive, Pageable pageable){
        String term = search == null ? "" : search.trim();
        if(includeInactive){
            return repository.findByClienteNameContainingIgnoreCase(term, pageable);
        }
        return repository.findByClienteIsActiveAndClienteNameContainingIgnoreCase(true, term, pageable);
    }

    public Prontuario searchById(Long id){
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Prontuário não encontrado com o ID:" + id));
    }

    public LocalDate lastConsultation(Long prontuarioId){
        return evolucaoRepository.findFirstByProntuarioIdOrderByDateDescIdDesc(prontuarioId)
            .map(Evolucao::getDate)
            .orElse(null);
    }

    //Post
    public Prontuario insertProntuario(Long clienteId, StatusProntuario status){
        Cliente cliente = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID:" + clienteId));
        if(repository.findByClienteId(clienteId).isPresent()){
            throw new RuntimeException("O cliente Id: " + clienteId + " já possui prontuário");
        }
        return repository.save(new Prontuario(null, cliente, status != null ? status : StatusProntuario.EM_TRATAMENTO));
    }

    //Put
    public Prontuario updateStatus(Long id, StatusProntuario status){
        Prontuario prontuario = searchById(id);
        prontuario.setStatus(status);
        return repository.save(prontuario);
    }

    //Delete
    public void deleteProntuario(Long id){
        if(!repository.existsById(id)){
            throw new RuntimeException("Não foi possível deletar o prontuário, Id: " + id + " não encontrado");
        }
        repository.deleteById(id);
    }
}
