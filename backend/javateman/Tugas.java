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

public class Tugas implements Downloadable {
    private String judul;
    private String detailTugas;
    private LocalDateTime deadlineTugas;
    private String fileJawaban;
 
    public Tugas(String judul, String detailTugas, LocalDateTime deadlineTugas) {
        this.judul = judul;
        this.detailTugas = detailTugas;
        this.deadlineTugas = deadlineTugas;
        this.fileJawaban = null;
    }
 
    public boolean simpanJawaban(String file) {
        if (file != null && !file.trim().isEmpty()) {
            this.fileJawaban = file;
            System.out.println("Jawaban disimpan: " + file);
            return true;
        }
        System.out.println("File jawaban tidak valid.");
        return false;
    }
 
    public boolean cekDeadline() {
        boolean masaBerlaku = LocalDateTime.now().isBefore(deadlineTugas);
        if (masaBerlaku) {
            System.out.println("Tugas masih dalam batas waktu.");
        } else {
            System.out.println("Deadline tugas sudah lewat!");
        }
        return masaBerlaku;
    }
 
    @Override
    public void unduhFile() {
        System.out.println("Mengunduh tugas: " + judul);
    }
 
    public String getJudul() { return judul; }
    public void setJudul(String judul) { this.judul = judul; }
 
    public String getDetailTugas() { return detailTugas; }
    public void setDetailTugas(String detailTugas) { this.detailTugas = detailTugas; }
 
    public LocalDateTime getDeadlineTugas() { return deadlineTugas; }
    public void setDeadlineTugas(LocalDateTime deadlineTugas) { this.deadlineTugas = deadlineTugas; }
 
    public String getFileJawaban() { return fileJawaban; }
    public void setFileJawaban(String fileJawaban) { this.fileJawaban = fileJawaban; }
}
