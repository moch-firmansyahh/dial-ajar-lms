package com.dialajar.lms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nilai")
public class Nilai {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mahasiswa_id", nullable = false)
    @JsonIgnore
    private Mahasiswa mahasiswa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mata_kuliah_id", nullable = false)
    @JsonIgnore
    private MataKuliah mataKuliah;

    @Column(name = "nilai_tugas")
    private Double nilaiTugas = 0.0;

    @Column(name = "nilai_kuis")
    private Double nilaiKuis = 0.0;

    @Column(name = "nilai_akhir")
    private Double nilaiAkhir = 0.0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Nilai() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Mahasiswa getMahasiswa() { return mahasiswa; }
    public void setMahasiswa(Mahasiswa mahasiswa) { this.mahasiswa = mahasiswa; }
    public MataKuliah getMataKuliah() { return mataKuliah; }
    public void setMataKuliah(MataKuliah mataKuliah) { this.mataKuliah = mataKuliah; }
    public Double getNilaiTugas() { return nilaiTugas; }
    public void setNilaiTugas(Double nilaiTugas) { this.nilaiTugas = nilaiTugas; }
    public Double getNilaiKuis() { return nilaiKuis; }
    public void setNilaiKuis(Double nilaiKuis) { this.nilaiKuis = nilaiKuis; }
    public Double getNilaiAkhir() { return nilaiAkhir; }
    public void setNilaiAkhir(Double nilaiAkhir) { this.nilaiAkhir = nilaiAkhir; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
