package com.dialajar.lms.config;

import com.dialajar.lms.model.Dosen;
import com.dialajar.lms.model.Mahasiswa;
import com.dialajar.lms.repository.DosenRepository;
import com.dialajar.lms.repository.MahasiswaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final DosenRepository dosenRepository;
    private final MahasiswaRepository mahasiswaRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(DosenRepository dosenRepository, MahasiswaRepository mahasiswaRepository, PasswordEncoder passwordEncoder) {
        this.dosenRepository = dosenRepository;
        this.mahasiswaRepository = mahasiswaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        logger.info("Mengecek data awal (seeder) database...");
        seedDosen();
        seedMahasiswa();
        logger.info("Proses seeding selesai.");
    }

    private void seedDosen() {
        if (dosenRepository.count() == 0) {
            logger.info("Tabel Dosen kosong. Menyiapkan data demo dosen...");
            List<Dosen> dosens = new ArrayList<>();
            String encryptedPassword = passwordEncoder.encode("dosen123");

            for (int i = 1; i <= 5; i++) {
                Dosen dosen = new Dosen();
                dosen.setNomorInduk("10" + i);
                dosen.setNip("10" + i);
                dosen.setNama("Dosen Demo " + i);
                dosen.setEmail("dosen" + i + "@dialajar.com");
                dosen.setPassword(encryptedPassword);
                dosen.setRole("DOSEN");
                dosens.add(dosen);
            }
            dosenRepository.saveAll(dosens);
            logger.info("Berhasil menyimpan 5 akun dosen demo.");
        }
    }

    private void seedMahasiswa() {
        if (mahasiswaRepository.count() == 0) {
            logger.info("Tabel Mahasiswa kosong. Menyiapkan data demo mahasiswa...");
            List<Mahasiswa> mahasiswas = new ArrayList<>();
            String encryptedPassword = passwordEncoder.encode("mhs123");

            for (int i = 1; i <= 10; i++) {
                Mahasiswa mhs = new Mahasiswa();
                String suffix = (i == 10) ? "10" : "0" + i;
                mhs.setNomorInduk("2" + suffix);
                mhs.setNim("2" + suffix);
                mhs.setNama("Mahasiswa Demo " + i);
                mhs.setEmail("mhs" + i + "@student.dialajar.com");
                mhs.setPassword(encryptedPassword);
                mhs.setRole("MAHASISWA");
                mhs.setSemester(4);
                mahasiswas.add(mhs);
            }
            mahasiswaRepository.saveAll(mahasiswas);
            logger.info("Berhasil menyimpan 10 akun mahasiswa demo.");
        }
    }
}
