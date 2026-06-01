package com.mycompany.tubes_pbo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    // URL koneksi ke database lms_pbo
    private static final String URL = "jdbc:mysql://localhost:3306/lms_pbo";
    private static final String USER = "root";
    private static final String PASSWORD = ""; // Default XAMPP adalah kosong

    public static Connection getConnection() {
        Connection connection = null;
        try {
            // Mendaftarkan Driver MySQL
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            // Membuat koneksi ke database lms_pbo
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Berhasil terhubung ke database lms_pbo!");
        } catch (ClassNotFoundException e) {
            System.out.println("Driver MySQL tidak ditemukan!");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("Gagal terhubung ke database lms_pbo!");
            e.printStackTrace();
        }
        return connection;
    }
}
