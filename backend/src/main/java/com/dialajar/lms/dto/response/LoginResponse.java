package com.dialajar.lms.dto.response;

public class LoginResponse {
    private Long id;
    private String token;
    private String role;
    private String nama;
    private String nomorInduk;

    public LoginResponse(Long id, String token, String role, String nama, String nomorInduk) {
        this.id = id;
        this.token = token;
        this.role = role;
        this.nama = nama;
        this.nomorInduk = nomorInduk;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public String getNomorInduk() {
        return nomorInduk;
    }

    public void setNomorInduk(String nomorInduk) {
        this.nomorInduk = nomorInduk;
    }
}
