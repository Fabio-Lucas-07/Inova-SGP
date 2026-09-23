package br.com.inova.sgp.services;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import br.com.inova.sgp.dtos.VendaDiaDTO;
import br.com.inova.sgp.dtos.VendaResumoDTO;
import br.com.inova.sgp.models.Agendamento;
import br.com.inova.sgp.repositories.AgendamentoRepository;

@Service
public class VendaService {

    private final AgendamentoRepository repository;

    public VendaService(AgendamentoRepository repository) {
        this.repository = repository;
    }

    public VendaResumoDTO resumoSemanal(LocalDate referencia) {
        LocalDate inicio = referencia.with(DayOfWeek.MONDAY);
        LocalDate fim = inicio.plusDays(6);
        return resumoPeriodo(inicio, fim);
    }

    public VendaResumoDTO resumoMensal(int ano, int mes) {
        YearMonth mesReferencia = YearMonth.of(ano, mes);
        return resumoPeriodo(mesReferencia.atDay(1), mesReferencia.atEndOfMonth());
    }

    private VendaResumoDTO resumoPeriodo(LocalDate inicio, LocalDate fim) {
        List<Agendamento> agendamentos = repository.findByStartTimeBetweenOrderByStartTimeAsc(
            inicio.atStartOfDay(), fim.plusDays(1).atStartOfDay());

        Map<LocalDate, List<Agendamento>> porDia = agendamentos.stream()
            .collect(Collectors.groupingBy(a -> a.getStartTime().toLocalDate(), TreeMap::new, Collectors.toList()));

        List<VendaDiaDTO> dias = inicio.datesUntil(fim.plusDays(1))
            .map(dia -> {
                List<Agendamento> doDia = porDia.getOrDefault(dia, List.of());
                BigDecimal total = doDia.stream().map(Agendamento::getValor).reduce(BigDecimal.ZERO, BigDecimal::add);
                return new VendaDiaDTO(dia, total, doDia.size());
            })
            .toList();

        BigDecimal totalPeriodo = dias.stream().map(VendaDiaDTO::total).reduce(BigDecimal.ZERO, BigDecimal::add);
        long quantidadeConsultas = dias.stream().mapToLong(VendaDiaDTO::quantidadeConsultas).sum();

        return new VendaResumoDTO(inicio, fim, totalPeriodo, quantidadeConsultas, dias);
    }
}
