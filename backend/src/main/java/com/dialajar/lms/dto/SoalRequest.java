package com.dialajar.lms.dto;

public class SoalRequest {
    private String pertanyaan;
    private String pilihanA;
    private String pilihanB;
    private String pilihanC;
    private String pilihanD;
    private String kunciJawaban;
    private Double skor;
    private String tipe;

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
