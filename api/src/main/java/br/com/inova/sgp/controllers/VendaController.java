package br.com.inova.sgp.controllers;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.inova.sgp.dtos.VendaResumoDTO;
import br.com.inova.sgp.services.VendaService;

@RestController
@RequestMapping("/vendas")
public class VendaController {

    private final VendaService service;

    public VendaController(VendaService service) {
        this.service = service;
    }

    @GetMapping("/semanal")
    public VendaResumoDTO semanal(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return service.resumoSemanal(data != null ? data : LocalDate.now());
    }

    @GetMapping("/mensal")
    public VendaResumoDTO mensal(@RequestParam(required = false) Integer ano, @RequestParam(required = false) Integer mes) {
        LocalDate referencia = LocalDate.now();
        return service.resumoMensal(ano != null ? ano : referencia.getYear(), mes != null ? mes : referencia.getMonthValue());
    }
}
