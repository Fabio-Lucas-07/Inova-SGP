package br.com.inova.sgp.dtos;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

public record ClienteRequestDTO(
    @NotBlank String name,
    @Email String email,
    @NotBlank String cpf,
    @NotBlank String tel,
    @NotNull @Past LocalDate birthday,
    @NotBlank String city
) {}
