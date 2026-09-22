package br.com.inova.sgp.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.inova.sgp.models.Cliente;

@Repository 
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Page<Cliente> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Cliente> findByIsActiveAndNameContainingIgnoreCase(Boolean isActive, String name, Pageable pageable);
}
