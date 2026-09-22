package br.com.inova.sgp.services;

import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.inova.sgp.models.Evolucao;
import br.com.inova.sgp.models.Prontuario;
import br.com.inova.sgp.repositories.EvolucaoRepository;
import br.com.inova.sgp.repositories.ProntuarioRepository;

@Service
public class EvolucaoService {

    private final EvolucaoRepository repository;
    private final ProntuarioRepository prontuarioRepository;

    public EvolucaoService(EvolucaoRepository repository, ProntuarioRepository prontuarioRepository) {
        this.repository = repository;
        this.prontuarioRepository = prontuarioRepository;
    }

    //Get
    public Page<Evolucao> searchByProntuario(Long prontuarioId, Pageable pageable){
        return repository.findByProntuarioId(prontuarioId, pageable);
    }

    //Post
    @Transactional
    public Evolucao insertEvolucao(Long prontuarioId, LocalDate date, String description){
        Prontuario prontuario = prontuarioRepository.findById(prontuarioId)
            .orElseThrow(() -> new RuntimeException("Prontuário não encontrado com o ID:" + prontuarioId));
        int session = repository.countByProntuarioId(prontuarioId) + 1;
        return repository.save(new Evolucao(null, prontuario, date != null ? date : LocalDate.now(), session, description));
    }

    //Delete
    public void deleteEvolucao(Long id){
        if(!repository.existsById(id)){
            throw new RuntimeException("Não foi possível deletar a evolução, Id: " + id + " não encontrado");
        }
        repository.deleteById(id);
    }
}
