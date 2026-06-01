package com.dialajar.lms.dto.request;

public class LoginRequest {
    private String nomorInduk;
    private String password;
    private String role; // MAHASISWA or DOSEN

    public LoginRequest() {}

    public String getNomorInduk() {
        return nomorInduk;
    }

    public void setNomorInduk(String nomorInduk) {
        this.nomorInduk = nomorInduk;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
