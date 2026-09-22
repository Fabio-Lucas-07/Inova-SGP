package br.com.inova.sgp.dtos;

import jakarta.validation.constraints.NotNull;

public record ClienteStatusRequestDTO(
    @NotNull Boolean isActive
) {}
