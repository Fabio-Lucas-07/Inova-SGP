package br.com.inova.sgp.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.inova.sgp.models.Prontuario;

@Repository
public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {

    Optional<Prontuario> findByClienteId(Long clienteId);

    Page<Prontuario> findByClienteNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Prontuario> findByClienteIsActiveAndClienteNameContainingIgnoreCase(Boolean isActive, String name, Pageable pageable);
}
