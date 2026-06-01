/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.tubes_pbo;

/**
 *
 * @author MSI KATANA
 */
import java.util.ArrayList;
import java.util.List;

public class Mahasiswa extends User {
    private String nim;
    private int semester;
    private List<MataKuliah> daftarMataKuliah;
 
    // Constructor
    public Mahasiswa(String nim, String nama, String email, String password, int semester) {
        super(nim, nama, email, password);
        this.nim = nim;
        this.semester = semester;
        this.daftarMataKuliah = new ArrayList<>();
    }
 
    // Methods
    public boolean gabungKelas(MataKuliah mk, String kode) {
        if (mk != null) {
            daftarMataKuliah.add(mk);
            System.out.println(getNama() + " berhasil bergabung ke kelas: " + mk.getNamaMatKul());
            return true;
        }
        return false;
    }
 
    public ModulAjar bacaModul(MataKuliah mk, String idModul) {
        for (ModulAjar modul : mk.getDaftarModul()) {
            if (modul.getJudul().equals(idModul)) {
                System.out.println("Membaca modul: " + modul.getJudul());
                return modul;
            }
        }
        System.out.println("Modul tidak ditemukan.");
        return null;
    }
 
    public Tugas kerjakanTugas(MataKuliah mk, String idTugas) {
        for (Tugas tugas : mk.getDaftarTugas()) {
            if (tugas.getJudul().equals(idTugas)) {
                System.out.println("Mengerjakan tugas: " + tugas.getJudul());
                return tugas;
            }
        }
        System.out.println("Tugas tidak ditemukan.");
        return null;
    }
 
    public boolean kumpulkanTugas(MataKuliah mk, Tugas t) {
        if (t != null && t.cekDeadline()) {
            System.out.println(getNama() + " berhasil mengumpulkan tugas: " + t.getJudul());
            return true;
        }
        System.out.println("Gagal mengumpulkan tugas.");
        return false;
    }
 
    public void tontonVidio(MataKuliah mk, String idVidio) {
        for (VidioAjar vidio : mk.getDaftarVidio()) {
            if (vidio.getJudul().equals(idVidio)) {
                vidio.putarVidio();
                return;
            }
        }
        System.out.println("Video tidak ditemukan.");
    }
 
    public boolean kerjakanKuis(MataKuliah mk, String idKuis) {
        for (Kuis kuis : mk.getDaftarKuis()) {
            if (kuis.getJudul().equals(idKuis)) {
                kuis.mengerjakanKuis();
                return true;
            }
        }
        System.out.println("Kuis tidak ditemukan.");
        return false;
    }
 
    public void melihatNilai(MataKuliah mk) {
        System.out.println(getNama() + " melihat nilai untuk: " + mk.getNamaMatKul());
    }
 
    @Override
    public void tampilkanDashboard() {
        System.out.println("=== Dashboard Mahasiswa ===");
        System.out.println("NIM     : " + nim);
        System.out.println("Nama    : " + getNama());
        System.out.println("Email   : " + getEmail());
        System.out.println("Semester: " + semester);
        System.out.println("Mata Kuliah Diambil: " + daftarMataKuliah.size());
    }
 
    // Getters & Setters
    public String getNim() { return nim; }
    public void setNim(String nim) { this.nim = nim; }
 
    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }
 
    public List<MataKuliah> getDaftarMataKuliah() { return daftarMataKuliah; }
}
