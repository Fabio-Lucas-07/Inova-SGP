package br.com.inova.sgp.dtos;

import java.time.LocalDate;

import br.com.inova.sgp.models.Evolucao;

public record EvolucaoResponseDTO(
    Long id,
    Long prontuarioId,
    LocalDate date,
    Integer sessionNumber,
    String description
) {
    public static EvolucaoResponseDTO fromEntity(Evolucao e) {
        return new EvolucaoResponseDTO(e.getId(), e.getProntuario().getId(), e.getDate(), e.getSessionNumber(), e.getDescription());
    }
}
