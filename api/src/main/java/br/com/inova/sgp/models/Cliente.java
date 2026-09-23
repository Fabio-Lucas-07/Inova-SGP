package br.com.inova.sgp.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@AllArgsConstructor 
@NoArgsConstructor
@Getter 
@Setter 
@Table(name = "cliente")
public class Cliente {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = true)
    private String email;

    @Column(name = "cpf", unique = true)
    private String cpf;

    @Column(name = "tel", nullable = false)
    private String tel;

    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
