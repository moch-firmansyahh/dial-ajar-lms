package com.dialajar.lms;

import com.dialajar.lms.model.*;
import com.dialajar.lms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@SpringBootApplication
public class LmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(LmsApplication.class, args);
    }

    @Bean
    public CommandLineRunner dataLoader(
            UserRepository userRepository, 
            MataKuliahRepository mataKuliahRepository,
            ModulAjarRepository modulAjarRepository,
            VideoAjarRepository videoAjarRepository,
            TugasRepository tugasRepository,
            KuisRepository kuisRepository,
            SoalRepository soalRepository,
            ForumDiskusiRepository forumDiskusiRepository,
            KomentarForumDiskusiRepository KomentarForumDiskusiRepository,
            PengumpulanTugasRepository pengumpulanTugasRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                System.out.println("🌱 Database is empty. Running Data Seeder...");

                // Seed 5 Dosen
                Dosen[] dosens = new Dosen[5];
                for (int i = 1; i <= 5; i++) {
                    String nip = "10" + i;
                    dosens[i-1] = new Dosen(nip, "Dosen " + i + ", M.Kom", "dosen" + i + "@univ.edu", passwordEncoder.encode("dosen123"));
                    userRepository.save(dosens[i-1]);
                }

                // Seed 10 Mahasiswa
                Mahasiswa[] mahasiswas = new Mahasiswa[10];
                for (int i = 1; i <= 10; i++) {
                    String nim = "20" + i;
                    mahasiswas[i-1] = new Mahasiswa(nim, "Mahasiswa " + i, "mhs" + i + "@student.edu", passwordEncoder.encode("mhs123"), 4);
                    userRepository.save(mahasiswas[i-1]);
                }

                // Seed 5 Mata Kuliah
                String[] mkNames = {
                    "Pemrograman Berorientasi Objek",
                    "Struktur Data",
                    "Basis Data",
                    "Pengembangan Aplikasi Web",
                    "Kecerdasan Buatan"
                };
                String[] mkCodes = {"PBO-01", "STD-02", "BD-03", "PAW-04", "AI-05"};

                for (int m = 0; m < 5; m++) {
                    MataKuliah mk = new MataKuliah(mkNames[m], mkCodes[m], dosens[m]);
                    // Enroll all 10 students to every course
                    for (int s = 0; s < 10; s++) {
                        mk.getMahasiswas().add(mahasiswas[s]);
                    }
                    mataKuliahRepository.save(mk);

                }
                System.out.println("✅ Data Seeder berhasil dijalankan: 5 Dosen, 10 Mahasiswa, dan 5 Mata Kuliah.");
            } else {
                System.out.println("ℹ️ Database sudah memiliki data. Seeding dilewati.");
            }
        };
    }
}
