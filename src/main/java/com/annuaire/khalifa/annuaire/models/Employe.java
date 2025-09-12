package com.annuaire.khalifa.annuaire.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "employes")
public class Employe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // PK auto-incrémentée

    @Column(unique = true, nullable = true)
    private Integer ip;

    @Column(nullable = false)
    private String password;

    private String telephone;

    @Column(nullable = false)
    private String role;

    @Column(name = "external_id")
    private Integer employeId; // ID venant de la DB externe

    // ⚡ Relation avec Historique
    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Historique> historiques;

    public Employe() {}

    public Employe(Integer ip, String password, String telephone, String role, Integer employeId) {
        this.ip = ip;
        this.password = password;
        this.telephone = telephone;
        this.role = role;
        this.employeId = employeId;
    }
}
