package com.mycompany.tubes_pbo;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AuthService {
    
    /**
     * Metode untuk melakukan login menggunakan NIM/NIP atau Email dan Password.
     * @param identifier Bisa berupa NIM, NIP, atau Email
     * @param password Password akun
     * @return User (Mahasiswa/Dosen) jika berhasil, null jika gagal
     */
    public static User login(String identifier, String password) {
        String query = "SELECT * FROM users WHERE (nomor_induk = ? OR email = ?) AND password = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
             
            stmt.setString(1, identifier);
            stmt.setString(2, identifier);
            stmt.setString(3, password);
            
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                String nomorInduk = rs.getString("nomor_induk");
                String nama = rs.getString("nama");
                String email = rs.getString("email");
                String pass = rs.getString("password");
                String role = rs.getString("role");
                
                System.out.println("Login berhasil sebagai " + role.toUpperCase() + ": " + nama);
                
                if ("mahasiswa".equalsIgnoreCase(role)) {
                    int semester = 1; // Default
                    // Ambil detail tambahan dari tabel mahasiswa
                    String mhsQuery = "SELECT semester FROM mahasiswa WHERE nim = ?";
                    try (PreparedStatement stmtMhs = conn.prepareStatement(mhsQuery)) {
                        stmtMhs.setString(1, nomorInduk);
                        ResultSet rsMhs = stmtMhs.executeQuery();
                        if (rsMhs.next()) {
                            semester = rsMhs.getInt("semester");
                        }
                    }
                    return new Mahasiswa(nomorInduk, nama, email, pass, semester);
                    
                } else if ("dosen".equalsIgnoreCase(role)) {
                    return new Dosen(nomorInduk, nama, email, pass);
                }
            } else {
                System.out.println("Login gagal! NIM/Email atau password salah.");
            }
            
        } catch (SQLException e) {
            System.out.println("Terjadi kesalahan pada database saat login:");
            e.printStackTrace();
        }
        
        return null;
    }
}
