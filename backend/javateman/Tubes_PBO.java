/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.tubes_pbo;

/**
 *
 * @author MSI KATANA
 */
import java.util.Scanner;

public class Tubes_PBO {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("======================================");
        System.out.println("     Selamat Datang di Sistem LMS     ");
        System.out.println("======================================");
        System.out.println("Silakan Login");
        
        System.out.print("Masukkan NIM/Email : ");
        String identifier = scanner.nextLine();
        
        System.out.print("Masukkan Password  : ");
        String password = scanner.nextLine();
        
        System.out.println("\nMemproses login...");
        // Memanggil aktivitas login yang menyambung ke database
        User loggedInUser = AuthService.login(identifier, password);
        
        if (loggedInUser != null) {
            System.out.println("\nBerhasil masuk ke sistem!");
            // Menampilkan dashboard sesuai peran (Mahasiswa atau Dosen)
            loggedInUser.tampilkanDashboard();
        } else {
            System.out.println("\nSistem ditutup karena login gagal.");
        }
        
        scanner.close();
    }
}
