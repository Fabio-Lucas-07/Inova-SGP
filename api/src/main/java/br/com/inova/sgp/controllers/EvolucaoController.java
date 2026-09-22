package br.com.inova.sgp.controllers;

import java.net.URI;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.com.inova.sgp.dtos.EvolucaoRequestDTO;
import br.com.inova.sgp.dtos.EvolucaoResponseDTO;
import br.com.inova.sgp.dtos.PageResponseDTO;
import br.com.inova.sgp.models.Evolucao;
import br.com.inova.sgp.services.EvolucaoService;
import jakarta.validation.Valid;

@RestController
public class EvolucaoController {

    private final EvolucaoService service;

    public EvolucaoController(EvolucaoService service) {
        this.service = service;
    }

    @GetMapping("/prontuarios/{prontuarioId}/evolucoes")
    public PageResponseDTO<EvolucaoResponseDTO> searchByProntuario(
            @PathVariable Long prontuarioId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int limit) {
        return PageResponseDTO.from(
            service.searchByProntuario(prontuarioId, PageResponseDTO.pageable(page, limit, Sort.by("date").descending().and(Sort.by("id").descending()))),
            EvolucaoResponseDTO::fromEntity);
    }

    @PostMapping("/prontuarios/{prontuarioId}/evolucoes")
    public ResponseEntity<EvolucaoResponseDTO> insert(@PathVariable Long prontuarioId, @Valid @RequestBody EvolucaoRequestDTO dto) {
        Evolucao saved = service.insertEvolucao(prontuarioId, dto.date(), dto.description());
        URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
            .path("/evolucoes/{id}").buildAndExpand(saved.getId()).toUri();
        return ResponseEntity.created(location).body(EvolucaoResponseDTO.fromEntity(saved));
    }

    @DeleteMapping("/evolucoes/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteEvolucao(id);
        return ResponseEntity.noContent().build();
    }
}
