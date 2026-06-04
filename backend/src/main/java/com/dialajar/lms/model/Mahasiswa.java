package com.dialajar.lms.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.DiscriminatorValue;

@Entity
@Table(name = "mahasiswa")
@DiscriminatorValue("MAHASISWA")
public class Mahasiswa extends User {

    @Column(nullable = false, unique = true, length = 20)
    private String nim;

    @Column(nullable = false)
    private Integer semester = 1;

    public Mahasiswa() {
        super();
        this.setRole("MAHASISWA");
    }

    public Mahasiswa(String nim, String nama, String email, String password, Integer semester) {
        super(nim, nama, email, password, "MAHASISWA");
        this.nim = nim;
        this.semester = semester;
    }

    // Getters and Setters

    public String getNim() {
        return nim;
    }
    public void setNim(String nim) {
        this.nim = nim;
    }

    public Integer getSemester() {
        return semester;
    }
    public void setSemester(Integer semester) {
        this.semester = semester;
    }
}
