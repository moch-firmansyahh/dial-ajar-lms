/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.tubes_pbo;

/**
 *
 * @author MSI KATANA
 */
public class KomentarForumDiskusi {
    private String idKomentar;
    private String isiKomentar;
    private User penulis;
 
    public KomentarForumDiskusi(String idKomentar, String isiKomentar, User penulis) {
        this.idKomentar = idKomentar;
        this.isiKomentar = isiKomentar;
        this.penulis = penulis;
    }
 
    public boolean editKomentar(String komentarBaru) {
        if (komentarBaru != null && !komentarBaru.trim().isEmpty()) {
            this.isiKomentar = komentarBaru;
            System.out.println("Komentar berhasil diperbarui.");
            return true;
        }
        System.out.println("Komentar tidak boleh kosong.");
        return false;
    }
 
    public boolean hapusKomentar() {
        System.out.println("Komentar '" + idKomentar + "' telah dihapus.");
        return true;
    }
 
    public String getDetailKomentar() {
        return "[" + idKomentar + "] " + penulis.getNama() + ": " + isiKomentar;
    }
 
    public static KomentarForumDiskusi buatKomentar(String id, String isi,String penulisDummy, User penulis) {
        return new KomentarForumDiskusi(id, isi, penulis);
    }
 
    public String getIdKomentar() { return idKomentar; }
    public void setIdKomentar(String idKomentar) { this.idKomentar = idKomentar; }
 
    public String getIsiKomentar() { return isiKomentar; }
    public void setIsiKomentar(String isiKomentar) { this.isiKomentar = isiKomentar; }
 
    public User getPenulis() { return penulis; }
    public void setPenulis(User penulis) { this.penulis = penulis; }
}
