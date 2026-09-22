package br.com.inova.sgp.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.com.inova.sgp.dtos.AgendamentoRequestDTO;
import br.com.inova.sgp.dtos.AgendamentoResponseDTO;
import br.com.inova.sgp.models.Agendamento;
import br.com.inova.sgp.services.AgendamentoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    private final AgendamentoService service;

    public AgendamentoController(AgendamentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<AgendamentoResponseDTO> searchAll() {
        return service.searchAll().stream().map(AgendamentoResponseDTO::fromEntity).toList();
    }

    @GetMapping("/{id}")
    public AgendamentoResponseDTO searchById(@PathVariable Long id) {
        return AgendamentoResponseDTO.fromEntity(service.searchById(id));
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> insert(@Valid @RequestBody AgendamentoRequestDTO dto) {
        Agendamento saved = service.insertAgendamento(dto.clienteId(), toEntity(dto));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(saved.getId()).toUri();
        return ResponseEntity.created(location).body(AgendamentoResponseDTO.fromEntity(saved));
    }

    @PutMapping("/{id}")
    public AgendamentoResponseDTO update(@PathVariable Long id, @Valid @RequestBody AgendamentoRequestDTO dto) {
        return AgendamentoResponseDTO.fromEntity(service.updateAgendamento(id, dto.clienteId(), toEntity(dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteAgendamento(id);
        return ResponseEntity.noContent().build();
    }

    private Agendamento toEntity(AgendamentoRequestDTO dto) {
        return new Agendamento(null, null, dto.name(), dto.startTime(), dto.endTime(), dto.description(), dto.type());
    }
}
