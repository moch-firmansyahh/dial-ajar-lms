package com.dialajar.lms.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "dosen")
public class Dosen extends User {

    @Column(nullable = false, unique = true, length = 20)
    private String nip;

    public Dosen() {
        super();
        this.setRole("DOSEN");
    }

    public Dosen(String nip, String nama, String email, String password) {
        super(nip, nama, email, password, "DOSEN");
        this.nip = nip;
    }

    // Getters and Setters

    public String getNip() {
        return nip;
    }
    public void setNip(String nip) {
        this.nip = nip;
    }
}
