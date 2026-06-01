/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.tubes_pbo;

/**
 *
 * @author MSI KATANA
 */
public abstract class User {
    private String nomorInduk;
    private String nama;
    private String email;
    private String password;
 
    public User(String nomorInduk, String nama, String email, String password) {
        this.nomorInduk = nomorInduk;
        this.nama = nama;
        this.email = email;
        this.password = password;
    }
 
    public void logout() {
        System.out.println("User " + nama + " telah logout.");
    }
 
    public boolean login(String nomorInduk, String password) {
        if (this.nomorInduk.equals(nomorInduk) && this.password.equals(password)) {
            System.out.println("Login berhasil untuk: " + nama);
            return true;
        }
        System.out.println("Login gagal.");
        return false;
    }
 
    public String getNama() {
        return nama;
    }
 
    public abstract void tampilkanDashboard();
 
    public String getNomorInduk() { return nomorInduk; }
    public void setNomorInduk(String nomorInduk) { this.nomorInduk = nomorInduk; }
 
    public void setNama(String nama) { this.nama = nama; }
 
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
 
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
