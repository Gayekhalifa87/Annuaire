package com.annuaire.khalifa.annuaire.services;

import com.annuaire.khalifa.annuaire.models.Employe;
import com.annuaire.khalifa.annuaire.models.Historique;
import com.annuaire.khalifa.annuaire.repository.HistoriqueRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HistoriqueService {

    private final HistoriqueRepository historiqueRepository;

    public HistoriqueService(HistoriqueRepository historiqueRepository) {
        this.historiqueRepository = historiqueRepository;
    }

    // Retourne tout l'historique
    public List<Historique> getAllHistorique() {
        return historiqueRepository.findAll();
    }

    // Retourne l'historique d'un employé spécifique
    public List<Historique> getHistoriqueByEmployeId(int employeId) {
        return historiqueRepository.findByEmployeId(employeId);
    }

    public void logAction(String action, Employe employe) {
        Historique h = new Historique();
        h.setAction(action);
        h.setEmploye(employe); // <-- ici on passe directement l'objet Employe
        h.setUtilisateur(employe.getRole()); // ou un autre champ pour identifier l'utilisateur
        h.setDateAction(LocalDate.now());
        historiqueRepository.save(h);
    }

}
