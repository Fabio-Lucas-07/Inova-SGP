package br.com.inova.sgp.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.inova.sgp.models.Cliente;
import br.com.inova.sgp.models.Prontuario;
import br.com.inova.sgp.models.StatusProntuario;
import br.com.inova.sgp.repositories.ClienteRepository;
import br.com.inova.sgp.repositories.ProntuarioRepository;

@Service 
public class ClienteService {

    private final ClienteRepository repository;
    private final ProntuarioRepository prontuarioRepository;

    public ClienteService(ClienteRepository repository, ProntuarioRepository prontuarioRepository){
        this.repository = repository;
        this.prontuarioRepository = prontuarioRepository;
    }

    //Get
    public Page<Cliente> searchAll(Boolean isActive, String search, Pageable pageable){
        String term = search == null ? "" : search.trim();
        if(isActive == null){
            return repository.findByNameContainingIgnoreCase(term, pageable);
        }
        return repository.findByIsActiveAndNameContainingIgnoreCase(isActive, term, pageable);
    }

    public Cliente searchById(Long id){
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID:" + id));
    }

    //Post
    @Transactional
    public Cliente insertClient(Cliente cliente){
        Cliente saved = repository.save(cliente);
        prontuarioRepository.save(new Prontuario(null, saved, StatusProntuario.EM_TRATAMENTO));
        return saved;
    }

    //Put
    public Cliente updateClient(Long id, Cliente clienteUpdte){
        if(!repository.existsById(id)){
            throw new RuntimeException("Não foi possível atualizar cliente, Id: " + id + "não encontrado");
        }
        clienteUpdte.setId(id);
        clienteUpdte.setIsActive(searchById(id).getIsActive());
        return repository.save(clienteUpdte);
    }

    //Put status
    public Cliente updateStatus(Long id, Boolean isActive){
        Cliente cliente = searchById(id);
        cliente.setIsActive(isActive);
        return repository.save(cliente);
    }
}