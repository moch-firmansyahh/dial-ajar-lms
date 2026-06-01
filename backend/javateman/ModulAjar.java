/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.tubes_pbo;

/**
 *
 * @author MSI KATANA
 */
public class ModulAjar implements Downloadable{
    private String judul;
    private String tipe;
 
    public ModulAjar(String judul, String tipe) {
        this.judul = judul;
        this.tipe = tipe;
    }
 
    @Override
    public void unduhFile() {
        System.out.println("Mengunduh modul ajar: " + judul + " (Tipe: " + tipe + ")");
    }
 
    public String getJudul() { return judul; }
    public void setJudul(String judul) { this.judul = judul; }
 
    public String getTipe() { return tipe; }
    public void setTipe(String tipe) { this.tipe = tipe; }
}
