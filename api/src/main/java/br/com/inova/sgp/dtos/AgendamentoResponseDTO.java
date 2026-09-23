package br.com.inova.sgp.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import br.com.inova.sgp.models.Agendamento;

public record AgendamentoResponseDTO(
    Long id,
    Long clienteId,
    String name,
    LocalDateTime startTime,
    LocalDateTime endTime,
    String description,
    String type,
    BigDecimal valor
) {
    public static AgendamentoResponseDTO fromEntity(Agendamento a) {
        Long clienteId = a.getCliente() != null ? a.getCliente().getId() : null;
        return new AgendamentoResponseDTO(a.getId(), clienteId, a.getName(), a.getStartTime(), a.getEndTime(), a.getDescription(), a.getType(), a.getValor());
    }
}
