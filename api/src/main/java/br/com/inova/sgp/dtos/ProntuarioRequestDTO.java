package br.com.inova.sgp.dtos;

import br.com.inova.sgp.models.StatusProntuario;
import jakarta.validation.constraints.NotNull;

public record ProntuarioRequestDTO(
    @NotNull Long clienteId,
    StatusProntuario status
) {}
