package com.dialajar.lms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tugas")
public class Tugas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String judul;

    @Column(name = "detail_tugas", columnDefinition = "TEXT")
    private String detailTugas;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Column(name = "file_soal", length = 500)
    private String fileSoal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mata_kuliah_id", nullable = false)
    @JsonIgnore
    private MataKuliah mataKuliah;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Tugas() {}

    public Tugas(String judul, String detailTugas, LocalDateTime deadline, String fileSoal, MataKuliah mataKuliah) {
        this.judul = judul;
        this.detailTugas = detailTugas;
        this.deadline = deadline;
        this.fileSoal = fileSoal;
        this.mataKuliah = mataKuliah;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getJudul() { return judul; }
    public void setJudul(String judul) { this.judul = judul; }
    public String getDetailTugas() { return detailTugas; }
    public void setDetailTugas(String detailTugas) { this.detailTugas = detailTugas; }
    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
    public String getFileSoal() { return fileSoal; }
    public void setFileSoal(String fileSoal) { this.fileSoal = fileSoal; }
    public MataKuliah getMataKuliah() { return mataKuliah; }
    public void setMataKuliah(MataKuliah mataKuliah) { this.mataKuliah = mataKuliah; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
