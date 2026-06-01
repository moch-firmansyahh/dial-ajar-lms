package com.dialajar.lms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "mata_kuliah")
public class MataKuliah {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nama;

    @Column(name = "kode_kelas", nullable = false, unique = true, length = 20)
    private String kodeKelas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dosen_id", nullable = false)
    @JsonIgnore
    private Dosen dosen;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "mata_kuliah_mahasiswa",
            joinColumns = @JoinColumn(name = "mata_kuliah_id"),
            inverseJoinColumns = @JoinColumn(name = "mahasiswa_id")
    )
    @JsonIgnore
    private Set<Mahasiswa> mahasiswas = new HashSet<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public MataKuliah() {}

    public MataKuliah(String nama, String kodeKelas, Dosen dosen) {
        this.nama = nama;
        this.kodeKelas = kodeKelas;
        this.dosen = dosen;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }
    
    public String getKodeKelas() { return kodeKelas; }
    public void setKodeKelas(String kodeKelas) { this.kodeKelas = kodeKelas; }
    
    public Dosen getDosen() { return dosen; }
    public void setDosen(Dosen dosen) { this.dosen = dosen; }
    
    public Set<Mahasiswa> getMahasiswas() { return mahasiswas; }
    public void setMahasiswas(Set<Mahasiswa> mahasiswas) { this.mahasiswas = mahasiswas; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
