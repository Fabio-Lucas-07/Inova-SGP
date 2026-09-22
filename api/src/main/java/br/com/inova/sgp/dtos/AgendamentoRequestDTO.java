package br.com.inova.sgp.dtos;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AgendamentoRequestDTO(
    Long clienteId,
    @NotBlank String name,
    @NotNull LocalDateTime startTime,
    @NotNull LocalDateTime endTime,
    String description,
    String type
) {}
