package com.annuaire.khalifa.annuaire.repository;

import com.annuaire.khalifa.annuaire.models.Employe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeRepository extends JpaRepository<Employe, Integer> {

    Optional<Employe> findByIp(int ip);
    boolean existsByIp(int ip);



    Optional<Employe> findByEmployeId(int employeId);
    boolean existsByEmployeId(int employeId);

    Optional<Employe> findByTelephone(String telephone);
    boolean existsByTelephone(String telephone);

    Optional<Employe> findById(int id);
    boolean existsById(int id);
}
