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

public class ForumDiskusi {
    private String judul;
    private String isiForum;
    private List<KomentarForumDiskusi> daftarKomentar;
 
    public ForumDiskusi(String judul, String isiForum) {
        this.judul = judul;
        this.isiForum = isiForum;
        this.daftarKomentar = new ArrayList<>();
    }
 
    public void kirimPesan(String pesan) {
        System.out.println("Pesan terkirim di forum '" + judul + "': " + pesan);
    }
 
    public static ForumDiskusi buatForumDiskusi(String judul, String isi, String dummy) {
        return new ForumDiskusi(judul, isi);
    }
 
    public void tambahKomentar(KomentarForumDiskusi komentar) {
        daftarKomentar.add(komentar);
    }
 
    public String getJudul() { return judul; }
    public void setJudul(String judul) { this.judul = judul; }
 
    public String getIsiForum() { return isiForum; }
    public void setIsiForum(String isiForum) { this.isiForum = isiForum; }
 
    public List<KomentarForumDiskusi> getDaftarKomentar() { return daftarKomentar; }
}
