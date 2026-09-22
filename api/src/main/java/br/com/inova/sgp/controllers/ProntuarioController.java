package br.com.inova.sgp.controllers;

import java.net.URI;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.com.inova.sgp.dtos.PageResponseDTO;
import br.com.inova.sgp.dtos.ProntuarioRequestDTO;
import br.com.inova.sgp.dtos.ProntuarioResponseDTO;
import br.com.inova.sgp.dtos.ProntuarioStatusRequestDTO;
import br.com.inova.sgp.models.Prontuario;
import br.com.inova.sgp.services.ProntuarioService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/prontuarios")
public class ProntuarioController {

    private final ProntuarioService service;

    public ProntuarioController(ProntuarioService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponseDTO<ProntuarioResponseDTO> searchAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "false") boolean includeInactive,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit) {
        return PageResponseDTO.from(
            service.searchAll(search, includeInactive, PageResponseDTO.pageable(page, limit, Sort.by("cliente.name"))),
            this::toResponse);
    }

    @GetMapping("/{id}")
    public ProntuarioResponseDTO searchById(@PathVariable Long id) {
        return toResponse(service.searchById(id));
    }

    @PostMapping
    public ResponseEntity<ProntuarioResponseDTO> insert(@Valid @RequestBody ProntuarioRequestDTO dto) {
        Prontuario saved = service.insertProntuario(dto.clienteId(), dto.status());
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(saved.getId()).toUri();
        return ResponseEntity.created(location).body(toResponse(saved));
    }

    @PutMapping("/{id}/status")
    public ProntuarioResponseDTO updateStatus(@PathVariable Long id, @Valid @RequestBody ProntuarioStatusRequestDTO dto) {
        return toResponse(service.updateStatus(id, dto.status()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteProntuario(id);
        return ResponseEntity.noContent().build();
    }

    private ProntuarioResponseDTO toResponse(Prontuario p) {
        return ProntuarioResponseDTO.fromEntity(p, service.lastConsultation(p.getId()));
    }
}
