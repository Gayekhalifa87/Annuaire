package com.annuaire.khalifa.annuaire.repository;

import com.annuaire.khalifa.annuaire.models.Historique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

public interface HistoriqueRepository extends JpaRepository<Historique, Integer> {
    //Recuperer l historique d un utilisateur par son id
    List<Historique> findByEmployeId(int employeId);

    Optional<Historique> findById(int id);
    boolean existsById(int id);

}