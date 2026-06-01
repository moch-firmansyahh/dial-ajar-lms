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
            KomentarForumRepository komentarForumRepository,
            NilaiRepository nilaiRepository,
            PengumpulanTugasRepository pengumpulanTugasRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Wipe old data to ensure clean Mega Seeder execution
            nilaiRepository.deleteAll();
            komentarForumRepository.deleteAll();
            forumDiskusiRepository.deleteAll();
            soalRepository.deleteAll();
            kuisRepository.deleteAll();
            pengumpulanTugasRepository.deleteAll();
            tugasRepository.deleteAll();
            videoAjarRepository.deleteAll();
            modulAjarRepository.deleteAll();
            mataKuliahRepository.deleteAll();
            userRepository.deleteAll();

            // Seed 5 Dosen
            Dosen[] dosens = new Dosen[5];
            for (int i = 1; i <= 5; i++) {
                String nip = "10" + i;
                dosens[i-1] = new Dosen(nip, "Dosen " + i + ", M.Kom", "dosen" + i + "@univ.edu", passwordEncoder.encode("dosen123"));
                userRepository.save(dosens[i-1]);
            }

            // Seed 5 Mahasiswa
            Mahasiswa[] mahasiswas = new Mahasiswa[5];
            for (int i = 1; i <= 5; i++) {
                String nim = "20" + i;
                mahasiswas[i-1] = new Mahasiswa(nim, "Mahasiswa " + i, "mhs" + i + "@student.edu", passwordEncoder.encode("mhs123"), 4);
                userRepository.save(mahasiswas[i-1]);
            }

            // Seed 5 Mata Kuliah
            if (mataKuliahRepository.count() == 0) {
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
                    // Enroll all 5 students to every course so they see everything
                    for (int s = 0; s < 5; s++) {
                        mk.getMahasiswas().add(mahasiswas[s]);
                    }
                    mataKuliahRepository.save(mk);

                    // Seed 5 ModulAjar
                    for (int j = 1; j <= 5; j++) {
                        ModulAjar modul = new ModulAjar("Modul " + j + " " + mk.getNama(), "PDF", "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", mk);
                        modulAjarRepository.save(modul);
                    }

                    // Seed 5 VideoAjar
                    for (int j = 1; j <= 5; j++) {
                        VideoAjar video = new VideoAjar("Video Pertemuan " + j, "https://www.youtube.com/embed/bJzb-RuUcMU", mk);
                        videoAjarRepository.save(video);
                    }

                    // Seed 5 Tugas
                    for (int j = 1; j <= 5; j++) {
                        Tugas tugas = new Tugas("Tugas " + j + " - " + mk.getNama(), "Selesaikan tugas " + j + " dengan baik.", LocalDateTime.now().plusDays(j * 2), null, mk);
                        tugasRepository.save(tugas);
                    }

                    // Seed 5 Kuis
                    for (int j = 1; j <= 5; j++) {
                        Kuis kuis = new Kuis("Kuis " + j + " - " + mk.getNama(), "Kuis untuk evaluasi pertemuan " + j, LocalDateTime.now().plusDays(j * 3), 60, mk);
                        kuisRepository.save(kuis);
                        
                        // Add 5 Soal per Kuis
                        for (int k = 1; k <= 5; k++) {
                            Soal soal = new Soal();
                            soal.setPertanyaan("Pertanyaan " + k + " untuk kuis " + j + "?");
                            soal.setPilihanA("A");
                            soal.setPilihanB("B");
                            soal.setPilihanC("C");
                            soal.setPilihanD("D");
                            soal.setKunciJawaban("A");
                            soal.setKuis(kuis);
                            soalRepository.save(soal);
                        }
                    }

                    // Seed 5 Forum
                    for (int j = 1; j <= 5; j++) {
                        ForumDiskusi forum = new ForumDiskusi();
                        forum.setJudul("Diskusi Topik " + j + " - " + mk.getNama());
                        forum.setIsiForum("Mari kita diskusikan topik " + j + ". Apa pendapat kalian?");
                        forum.setPembuat(dosens[m]);
                        forum.setMataKuliah(mk);
                        forumDiskusiRepository.save(forum);

                        // Seed 2 Komentar per Forum
                        KomentarForum k1 = new KomentarForum();
                        k1.setIsi("Saya setuju pak!");
                        k1.setPenulis(mahasiswas[0]);
                        k1.setForumDiskusi(forum);
                        komentarForumRepository.save(k1);
                        
                        KomentarForum k2 = new KomentarForum();
                        k2.setIsi("Menurut saya ada pendekatan lain.");
                        k2.setPenulis(mahasiswas[1]);
                        k2.setForumDiskusi(forum);
                        komentarForumRepository.save(k2);
                    }

                    // Seed Nilai for each Mahasiswa in this MK
                    for (int s = 0; s < 5; s++) {
                        Nilai nilai = new Nilai();
                        nilai.setMahasiswa(mahasiswas[s]);
                        nilai.setMataKuliah(mk);
                        nilai.setNilaiTugas(80.0 + s * 2);
                        nilai.setNilaiKuis(85.0 + s);
                        nilai.setNilaiAkhir(82.5 + s);
                        nilaiRepository.save(nilai);
                    }
                }
                System.out.println("✅ Data Seeder (Mega) berhasil dijalankan: 5 MK, masing-masing 5 Modul, 5 Video, 5 Tugas, 5 Kuis, 5 Forum, & 5 Nilai per Mhs.");
            }
        };
    }
}
