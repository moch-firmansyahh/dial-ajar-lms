/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.tubes_pbo;

/**
 *
 * @author MSI KATANA
 */
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Kuis {
    private String judul;
    private LocalDateTime deadlineKuis;
    private List<Soal> soal;
    private double skor;
 
    public Kuis(String judul, LocalDateTime deadlineKuis) {
        this.judul = judul;
        this.deadlineKuis = deadlineKuis;
        this.soal = new ArrayList<>();
        this.skor = 0.0;
    }
 
    public void mengerjakanKuis() {
        if (LocalDateTime.now().isAfter(deadlineKuis)) {
            System.out.println("Deadline kuis sudah lewat!");
        } else {
            System.out.println("Mengerjakan kuis: " + judul);
            for (Soal s : soal) {
                System.out.println(s.menampilkanSoal());
            }
        }
    }
 
    public void melihatNilai() {
        System.out.println("Nilai kuis '" + judul + "': " + skor);
    }
 
    public void tambahSoal(Soal s) {
        soal.add(s);
    }
 
    public String getJudul() { return judul; }
    public void setJudul(String judul) { this.judul = judul; }
 
    public LocalDateTime getDeadlineKuis() { return deadlineKuis; }
    public void setDeadlineKuis(LocalDateTime deadlineKuis) { this.deadlineKuis = deadlineKuis; }
 
    public List<Soal> getSoal() { return soal; }
    public void setSoal(List<Soal> soal) { this.soal = soal; }
 
    public double getSkor() { return skor; }
    public void setSkor(double skor) { this.skor = skor; }
}
