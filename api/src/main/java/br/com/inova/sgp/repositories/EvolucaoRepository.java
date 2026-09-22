package br.com.inova.sgp.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.inova.sgp.models.Evolucao;

@Repository
public interface EvolucaoRepository extends JpaRepository<Evolucao, Long> {

    Page<Evolucao> findByProntuarioId(Long prontuarioId, Pageable pageable);

    int countByProntuarioId(Long prontuarioId);

    Optional<Evolucao> findFirstByProntuarioIdOrderByDateDescIdDesc(Long prontuarioId);
}
