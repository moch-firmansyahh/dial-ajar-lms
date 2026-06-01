/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.tubes_pbo;

/**
 *
 * @author MSI KATANA
 */
public class Dosen extends User{
    private String nip;
 
    public Dosen(String nip, String nama, String email, String password) {
        super(nip, nama, email, password);
        this.nip = nip;
    }
 
    public MataKuliah membuatMataKuliah(String nama) {
        MataKuliah mk = new MataKuliah(nama);
        System.out.println("Mata kuliah '" + nama + "' berhasil dibuat oleh " + getNama());
        return mk;
    }
 
    public void menambahModulAjar(MataKuliah mk, ModulAjar m) {
        mk.menyimpanModul(m);
    }
 
    public void menambahViddoPembelajaran(MataKuliah mk, VidioAjar v) {
        mk.menyimpanVidio(v);
    }
 
    public void menambahTugas(MataKuliah mk, Tugas t) {
        mk.menyimpanTugas(t);
    }
 
    public void menambahForumDiskusi(MataKuliah mk, ForumDiskusi f) {
        mk.menyimpanForumDiskusi(f);
    }
 
    public void memberNilai(MataKuliah mk, double n) {
        System.out.println("Nilai diberikan untuk mata kuliah: " + mk.getNamaMatKul()+ " Dengan nilai yang diberikan : " + n);
    }
 
    @Override
    public void tampilkanDashboard() {
        System.out.println("=== Dashboard Dosen ===");
        System.out.println("NIP  : " + nip);
        System.out.println("Nama : " + getNama());
        System.out.println("Email: " + getEmail());
    }
 
    public String getNip() { return nip; }
    public void setNip(String nip) { this.nip = nip; }
}
