package br.com.inova.sgp.dtos;

import java.time.LocalDate;

import br.com.inova.sgp.models.Cliente;

public record ClienteResponseDTO(
    Long id,
    String name,
    String email,
    String tel,
    LocalDate birthday,
    String city,
    Boolean isActive
) {
    public static ClienteResponseDTO fromEntity(Cliente c) {
        return new ClienteResponseDTO(c.getId(), c.getName(), c.getEmail(), c.getTel(), c.getBirthday(), c.getCity(), c.getIsActive());
    }
}
