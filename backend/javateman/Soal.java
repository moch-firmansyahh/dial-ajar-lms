/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.tubes_pbo;

/**
 *
 * @author MSI KATANA
 */
public class Soal {
    private String idSoal;
    private String pertanyaan;
    private String[] pilihanJawaban;
    private String kunciJawaban;
    private double skor;
 
    public Soal(String idSoal, String pertanyaan, String[] pilihanJawaban,
                String kunciJawaban, double skor) {
        this.idSoal = idSoal;
        this.pertanyaan = pertanyaan;
        this.pilihanJawaban = pilihanJawaban;
        this.kunciJawaban = kunciJawaban;
        this.skor = skor;
    }
 
    public boolean cekJawaban(String pilihanUser) {
        if (this.kunciJawaban.equalsIgnoreCase(pilihanUser)) {
            System.out.println("Jawaban benar!");
            return true;
        }
        System.out.println("Jawaban salah. Kunci: " + kunciJawaban);
        return false;
    }
 
    public String menampilkanSoal() {
        StringBuilder sb = new StringBuilder();
        sb.append("Soal: ").append(pertanyaan).append("\n");
        char option = 'A';
        for (String pilihan : pilihanJawaban) {
            sb.append(option++).append(". ").append(pilihan).append("\n");
        }
        return sb.toString();
    }
 
    public void bobotSoal(double nilai) {
        this.skor = nilai;
        System.out.println("Bobot soal diperbarui menjadi: " + nilai);
    }
 
    public String getIdSoal() { return idSoal; }
    public void setIdSoal(String idSoal) { this.idSoal = idSoal; }
 
    public String getPertanyaan() { return pertanyaan; }
    public void setPertanyaan(String pertanyaan) { this.pertanyaan = pertanyaan; }
 
    public String[] getPilihanJawaban() { return pilihanJawaban; }
    public void setPilihanJawaban(String[] pilihanJawaban) { this.pilihanJawaban = pilihanJawaban; }
 
    public String getKunciJawaban() { return kunciJawaban; }
    public void setKunciJawaban(String kunciJawaban) { this.kunciJawaban = kunciJawaban; }
 
    public double getSkor() { return skor; }
    public void setSkor(double skor) { this.skor = skor; }
}
