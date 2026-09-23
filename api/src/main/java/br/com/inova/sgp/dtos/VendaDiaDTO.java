package br.com.inova.sgp.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

public record VendaDiaDTO(
    LocalDate data,
    BigDecimal total,
    long quantidadeConsultas
) {}
