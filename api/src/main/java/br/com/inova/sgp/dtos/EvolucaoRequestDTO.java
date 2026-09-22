package br.com.inova.sgp.dtos;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;

public record EvolucaoRequestDTO(
    LocalDate date,
    @NotBlank String description
) {}
