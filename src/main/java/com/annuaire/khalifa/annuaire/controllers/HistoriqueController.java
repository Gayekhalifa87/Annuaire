package com.annuaire.khalifa.annuaire.controllers;

import com.annuaire.khalifa.annuaire.models.Historique;
import com.annuaire.khalifa.annuaire.services.HistoriqueService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/historiques")
public class HistoriqueController {
    private final HistoriqueService historiqueService;

    public HistoriqueController(HistoriqueService historiqueService) {
        this.historiqueService = historiqueService;
    }

    @GetMapping
    public List<Historique> getAllHistorique() {
        return historiqueService.getAllHistorique();
    }

    @GetMapping("/employe/{id}")
    public List<Historique> getHistoriqueByEmployeId(@PathVariable("id") int employeId) {
        return historiqueService.getHistoriqueByEmployeId(employeId);
    }
}