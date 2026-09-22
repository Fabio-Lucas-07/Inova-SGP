package br.com.inova.sgp.dtos;

import java.time.LocalDate;

import br.com.inova.sgp.models.Prontuario;
import br.com.inova.sgp.models.StatusProntuario;

public record ProntuarioResponseDTO(
    Long id,
    Long clienteId,
    String name,
    String tel,
    StatusProntuario status,
    LocalDate lastConsultation
) {
    public static ProntuarioResponseDTO fromEntity(Prontuario p, LocalDate lastConsultation) {
        return new ProntuarioResponseDTO(p.getId(), p.getCliente().getId(), p.getCliente().getName(),
            p.getCliente().getTel(), p.getStatus(), lastConsultation);
    }
}
