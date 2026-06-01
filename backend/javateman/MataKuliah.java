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

public class MataKuliah {
    private String namaMatKul;
    private List<Tugas> daftarTugas;
    private List<ModulAjar> daftarModul;
    private List<VidioAjar> daftarVidio;
    private List<Kuis> daftarKuis;
    private List<ForumDiskusi> daftarForumDiskusi;
 
    public MataKuliah(String namaMatKul) {
        this.namaMatKul = namaMatKul;
        this.daftarTugas = new ArrayList<>();
        this.daftarModul = new ArrayList<>();
        this.daftarVidio = new ArrayList<>();
        this.daftarKuis = new ArrayList<>();
        this.daftarForumDiskusi = new ArrayList<>();
    }
 
    public boolean menyimpanTugas(Tugas t) {
        if (t != null) {
            daftarTugas.add(t);
            System.out.println("Tugas '" + t.getJudul() + "' berhasil ditambahkan ke " + namaMatKul);
            return true;
        }
        return false;
    }
 
    public boolean menyimpanModul(ModulAjar m) {
        if (m != null) {
            daftarModul.add(m);
            System.out.println("Modul '" + m.getJudul() + "' berhasil ditambahkan ke " + namaMatKul);
            return true;
        }
        return false;
    }
 
    public boolean menyimpanVidio(VidioAjar v) {
        if (v != null) {
            daftarVidio.add(v);
            System.out.println("Video '" + v.getJudul() + "' berhasil ditambahkan ke " + namaMatKul);
            return true;
        }
        return false;
    }
 
    public boolean menyimpanKuis(Kuis k) {
        if (k != null) {
            daftarKuis.add(k);
            System.out.println("Kuis '" + k.getJudul() + "' berhasil ditambahkan ke " + namaMatKul);
            return true;
        }
        return false;
    }
 
    public boolean menyimpanForumDiskusi(ForumDiskusi f) {
        if (f != null) {
            daftarForumDiskusi.add(f);
            System.out.println("Forum '" + f.getJudul() + "' berhasil ditambahkan ke " + namaMatKul);
            return true;
        }
        return false;
    }
 
    public String getNamaMatKul() { return namaMatKul; }
    public void setNamaMatKul(String namaMatKul) { this.namaMatKul = namaMatKul; }
 
    public List<Tugas> getDaftarTugas() { return daftarTugas; }
    public List<ModulAjar> getDaftarModul() { return daftarModul; }
    public List<VidioAjar> getDaftarVidio() { return daftarVidio; }
    public List<Kuis> getDaftarKuis() { return daftarKuis; }
    public List<ForumDiskusi> getDaftarForumDiskusi() { return daftarForumDiskusi; }
}
