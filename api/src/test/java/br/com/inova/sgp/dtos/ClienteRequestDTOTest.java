package br.com.inova.sgp.dtos;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.Set;

import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class ClienteRequestDTOTest {

    private final Validator validator;

    ClienteRequestDTOTest() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            this.validator = factory.getValidator();
        }
    }

    @Test
    void aceitaQualquerCpfDesdeQueNaoEsteJaVazio() {
        ClienteRequestDTO dto = new ClienteRequestDTO(
            "Maria Joaquina", "maria@email.com", "111.111.111-11",
            "(11) 91234-5678", LocalDate.of(1990, 1, 1), "São Paulo, SP");

        Set<ConstraintViolation<ClienteRequestDTO>> violacoes = validator.validate(dto);

        assertTrue(violacoes.stream().noneMatch(v -> v.getPropertyPath().toString().equals("cpf")));
    }

    @Test
    void naoAceitaCpfEmBranco() {
        ClienteRequestDTO dto = new ClienteRequestDTO(
            "Maria Joaquina", "maria@email.com", "  ",
            "(11) 91234-5678", LocalDate.of(1990, 1, 1), "São Paulo, SP");

        Set<ConstraintViolation<ClienteRequestDTO>> violacoes = validator.validate(dto);

        assertTrue(violacoes.stream().anyMatch(v -> v.getPropertyPath().toString().equals("cpf")));
    }

    @Test
    void naoAceitaDataDeNascimentoNoFuturo() {
        ClienteRequestDTO dto = new ClienteRequestDTO(
            "Maria Joaquina", "maria@email.com", "529.982.247-25",
            "(11) 91234-5678", LocalDate.now().plusDays(1), "São Paulo, SP");

        Set<ConstraintViolation<ClienteRequestDTO>> violacoes = validator.validate(dto);

        assertTrue(violacoes.stream().anyMatch(v -> v.getPropertyPath().toString().equals("birthday")));
    }

    @Test
    void aceitaDadosValidos() {
        ClienteRequestDTO dto = new ClienteRequestDTO(
            "Maria Joaquina", "maria@email.com", "529.982.247-25",
            "(11) 91234-5678", LocalDate.of(1990, 1, 1), "São Paulo, SP");

        Set<ConstraintViolation<ClienteRequestDTO>> violacoes = validator.validate(dto);

        assertEquals(0, violacoes.size());
    }
}
