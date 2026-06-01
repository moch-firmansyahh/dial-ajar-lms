package com.dialajar.lms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "soal")
public class Soal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kuis_id", nullable = false)
    @JsonIgnore
    private Kuis kuis;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String pertanyaan;

    @Column(name = "pilihan_a", length = 500)
    private String pilihanA;

    @Column(name = "pilihan_b", length = 500)
    private String pilihanB;

    @Column(name = "pilihan_c", length = 500)
    private String pilihanC;

    @Column(name = "pilihan_d", length = 500)
    private String pilihanD;

    @Column(name = "kunci_jawaban", nullable = false, length = 5)
    private String kunciJawaban;

    @Column(nullable = false)
    private Double skor = 10.0;

    @Column(length = 20)
    private String tipe = "PILIHAN_GANDA";

    public Soal() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Kuis getKuis() { return kuis; }
    public void setKuis(Kuis kuis) { this.kuis = kuis; }
    public String getPertanyaan() { return pertanyaan; }
    public void setPertanyaan(String pertanyaan) { this.pertanyaan = pertanyaan; }
    public String getPilihanA() { return pilihanA; }
    public void setPilihanA(String pilihanA) { this.pilihanA = pilihanA; }
    public String getPilihanB() { return pilihanB; }
    public void setPilihanB(String pilihanB) { this.pilihanB = pilihanB; }
    public String getPilihanC() { return pilihanC; }
    public void setPilihanC(String pilihanC) { this.pilihanC = pilihanC; }
    public String getPilihanD() { return pilihanD; }
    public void setPilihanD(String pilihanD) { this.pilihanD = pilihanD; }
    public String getKunciJawaban() { return kunciJawaban; }
    public void setKunciJawaban(String kunciJawaban) { this.kunciJawaban = kunciJawaban; }
    public Double getSkor() { return skor; }
    public void setSkor(Double skor) { this.skor = skor; }
    public String getTipe() { return tipe; }
    public void setTipe(String tipe) { this.tipe = tipe; }
}
