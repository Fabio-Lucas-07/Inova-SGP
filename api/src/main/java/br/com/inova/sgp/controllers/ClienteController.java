package br.com.inova.sgp.controllers;

import java.net.URI;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.com.inova.sgp.dtos.ClienteRequestDTO;
import br.com.inova.sgp.dtos.ClienteResponseDTO;
import br.com.inova.sgp.dtos.ClienteStatusRequestDTO;
import br.com.inova.sgp.dtos.PageResponseDTO;
import br.com.inova.sgp.models.Cliente;
import br.com.inova.sgp.services.ClienteService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponseDTO<ClienteResponseDTO> searchAll(
            @RequestParam(defaultValue = "active") String status,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit) {
        Boolean isActive = switch (status) {
            case "active" -> true;
            case "inactive" -> false;
            case "all" -> null;
            default -> throw new RuntimeException("Status inválido: " + status + " (use active, inactive ou all)");
        };
        return PageResponseDTO.from(
            service.searchAll(isActive, search, PageResponseDTO.pageable(page, limit, Sort.by("name"))),
            ClienteResponseDTO::fromEntity);
    }

    @GetMapping("/{id}")
    public ClienteResponseDTO searchById(@PathVariable Long id) {
        return ClienteResponseDTO.fromEntity(service.searchById(id));
    }

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> insert(@Valid @RequestBody ClienteRequestDTO dto) {
        Cliente saved = service.insertClient(toEntity(dto));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(saved.getId()).toUri();
        return ResponseEntity.created(location).body(ClienteResponseDTO.fromEntity(saved));
    }

    @PutMapping("/{id}")
    public ClienteResponseDTO update(@PathVariable Long id, @Valid @RequestBody ClienteRequestDTO dto) {
        return ClienteResponseDTO.fromEntity(service.updateClient(id, toEntity(dto)));
    }

    @PutMapping("/{id}/status")
    public ClienteResponseDTO updateStatus(@PathVariable Long id, @Valid @RequestBody ClienteStatusRequestDTO dto) {
        return ClienteResponseDTO.fromEntity(service.updateStatus(id, dto.isActive()));
    }

    private Cliente toEntity(ClienteRequestDTO dto) {
        return new Cliente(null, dto.name(), dto.email(), dto.tel(), dto.birthday(), dto.city(), true);
    }
}
