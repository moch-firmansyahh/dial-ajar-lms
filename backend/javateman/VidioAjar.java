/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.tubes_pbo;

/**
 *
 * @author MSI KATANA
 */
public class VidioAjar implements Downloadable{
    private String judul;
    private String linkVidio;
 
    public VidioAjar(String judul, String linkVidio) {
        this.judul = judul;
        this.linkVidio = linkVidio;
    }
 
    public void putarVidio() {
        System.out.println("Memutar video: " + judul);
        System.out.println("URL: " + linkVidio);
    }
 
    @Override
    public void unduhFile() {
        System.out.println("Mengunduh video: " + judul);
    }
 
    public String getJudul() { return judul; }
    public void setJudul(String judul) { this.judul = judul; }
 
    public String getLinkVidio() { return linkVidio; }
    public void setLinkVidio(String linkVidio) { this.linkVidio = linkVidio; }
}
