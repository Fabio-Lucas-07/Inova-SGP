package br.com.inova.sgp.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record VendaResumoDTO(
    LocalDate inicio,
    LocalDate fim,
    BigDecimal totalPeriodo,
    long quantidadeConsultas,
    List<VendaDiaDTO> dias
) {}
