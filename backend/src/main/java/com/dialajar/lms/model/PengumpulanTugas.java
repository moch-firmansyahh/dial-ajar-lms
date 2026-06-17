package com.dialajar.lms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pengumpulan_tugas")
public class PengumpulanTugas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tugas_id", nullable = true)
    @JsonIgnore
    private Tugas tugas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kuis_id", nullable = true)
    @JsonIgnore
    private Kuis kuis;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mahasiswa_id", nullable = false)
    @JsonIgnore
    private Mahasiswa mahasiswa;

    @Column(name = "file_jawaban", length = 500)
    private String fileJawaban;

    private Double nilai;

    @Column(name = "detail_nilai", columnDefinition = "TEXT")
    private String detailNilai;

    @Column(length = 20)
    private String status = "BELUM_KUMPUL"; // BELUM_KUMPUL, SUDAH_KUMPUL, SUDAH_DINILAI

    private LocalDateTime dikumpulkan;

    public PengumpulanTugas() {}

    public PengumpulanTugas(Tugas tugas, Mahasiswa mahasiswa) {
        this.tugas = tugas;
        this.mahasiswa = mahasiswa;
    }
    
    public PengumpulanTugas(Kuis kuis, Mahasiswa mahasiswa) {
        this.kuis = kuis;
        this.mahasiswa = mahasiswa;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Tugas getTugas() { return tugas; }
    public void setTugas(Tugas tugas) { this.tugas = tugas; }
    public Kuis getKuis() { return kuis; }
    public void setKuis(Kuis kuis) { this.kuis = kuis; }
    public Mahasiswa getMahasiswa() { return mahasiswa; }
    public void setMahasiswa(Mahasiswa mahasiswa) { this.mahasiswa = mahasiswa; }
    public String getFileJawaban() { return fileJawaban; }
    public void setFileJawaban(String fileJawaban) { this.fileJawaban = fileJawaban; }
    public Double getNilai() { return nilai; }
    public void setNilai(Double nilai) { this.nilai = nilai; }
    public String getDetailNilai() { return detailNilai; }
    public void setDetailNilai(String detailNilai) { this.detailNilai = detailNilai; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getDikumpulkan() { return dikumpulkan; }
    public void setDikumpulkan(LocalDateTime dikumpulkan) { this.dikumpulkan = dikumpulkan; }
}
