package com.dialajar.lms.controller;

import com.dialajar.lms.model.*;
import com.dialajar.lms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/tugas")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class TugasController {

    @Autowired
    private TugasRepository tugasRepository;

    @Autowired
    private PengumpulanTugasRepository pengumpulanTugasRepository;

    @Autowired
    private MataKuliahRepository mataKuliahRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MahasiswaRepository mahasiswaRepository;

    @Autowired
    private SoalRepository soalRepository;

    @Autowired
    private KuisRepository kuisRepository;

    @Autowired
    private NotifikasiRepository notifikasiRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getTugasByCourse(@PathVariable Long courseId, @RequestParam(required = false) Long userId) {
        List<Tugas> tugasList = tugasRepository.findByMataKuliahId(courseId);
        List<Kuis> kuisList = kuisRepository.findByMataKuliahId(courseId);
        
        List<Map<String, Object>> combinedList = new java.util.ArrayList<>();
        
        for(Tugas t : tugasList) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", t.getId());
            map.put("judul", t.getJudul());
            map.put("detailTugas", t.getDetailTugas());
            map.put("deadline", t.getDeadline());
            map.put("fileSoal", t.getFileSoal());
            map.put("tipe", "tugas");
            
            if (userId != null) {
                Optional<PengumpulanTugas> sub = pengumpulanTugasRepository.findByTugasIdAndMahasiswaId(t.getId(), userId);
                if (sub.isPresent()) {
                    map.put("status", "dikumpulkan");
                    map.put("nilai", sub.get().getNilai());
                    map.put("fileJawaban", sub.get().getFileJawaban());
                    map.put("dikumpulkan", sub.get().getDikumpulkan());
                } else {
                    map.put("status", "belum");
                }
            } else {
                map.put("status", "belum");
            }
            
            combinedList.add(map);
        }
        
        for(Kuis k : kuisList) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", k.getId()); // Use real ID
            map.put("judul", k.getJudul());
            map.put("detailTugas", k.getDeskripsi());
            map.put("deadline", k.getDeadline());
            map.put("durasiMenit", k.getDurasiMenit());
            map.put("tipe", "kuis");
            
            if (userId != null) {
                Optional<PengumpulanTugas> sub = pengumpulanTugasRepository.findByKuisIdAndMahasiswaId(k.getId(), userId);
                if (sub.isPresent()) {
                    map.put("status", sub.get().getStatus().equals("SUDAH_DINILAI") ? "dinilai" : "dikumpulkan");
                    map.put("nilai", sub.get().getNilai());
                    map.put("detailNilai", sub.get().getDetailNilai());
                    map.put("fileJawaban", sub.get().getFileJawaban());
                    map.put("dikumpulkan", sub.get().getDikumpulkan());
                } else {
                    map.put("status", "belum");
                }
            } else {
                map.put("status", "belum");
            }
            
            // Tambahkan info soal untuk kuis
            List<Soal> soalList = soalRepository.findByKuisId(k.getId());
            map.put("totalSoal", soalList.size());
            
            boolean hasPg = false;
            boolean hasEssay = false;
            for (Soal s : soalList) {
                if ("PILIHAN_GANDA".equals(s.getTipe())) {
                    hasPg = true;
                } else {
                    hasEssay = true;
                }
            }
            
            String jenisSoal = "Pilihan Ganda";
            if (hasPg && hasEssay) {
                jenisSoal = "PG & Esai";
            } else if (!hasPg && hasEssay) {
                jenisSoal = "Esai";
            }
            map.put("jenisSoal", jenisSoal);
            
            combinedList.add(map);
        }
        
        return ResponseEntity.ok(combinedList);
    }

    @PostMapping
    public ResponseEntity<?> createTugas(
            @RequestParam("courseId") Long courseId,
            @RequestParam("judul") String judul,
            @RequestParam("detailTugas") String detailTugas,
            @RequestParam("deadline") String deadlineStr,
            @RequestParam(value = "file", required = false) MultipartFile file) {
            
        Optional<MataKuliah> mk = mataKuliahRepository.findById(courseId);
        if (mk.isEmpty()) return ResponseEntity.badRequest().body("Mata kuliah tidak ditemukan");

        String fileUrl = null;
        if (file != null && !file.isEmpty()) {
            try {
                Path uploadPath = Paths.get(uploadDir, "tugas");
                Files.createDirectories(uploadPath);

                String originalFilename = file.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String uniqueFilename = UUID.randomUUID().toString() + extension;

                Path filePath = uploadPath.resolve(uniqueFilename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                fileUrl = "/api/tugas/files/" + uniqueFilename;
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Gagal menyimpan file: " + e.getMessage());
            }
        }

        Tugas tugas = new Tugas(
                judul,
                detailTugas,
                LocalDateTime.parse(deadlineStr),
                fileUrl,
                mk.get()
        );
        tugasRepository.save(tugas);

        // Create Notifications for all enrolled Mahasiswa
        String message = "Tugas Baru: " + judul + " - " + mk.get().getNama();
        for (Mahasiswa mhs : mk.get().getMahasiswas()) {
            Notifikasi notif = new Notifikasi(mhs.getId(), message, "TUGAS_BARU");
            notifikasiRepository.save(notif);
        }

        return ResponseEntity.ok(tugas);
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        return loadResource(Paths.get(uploadDir, "tugas").resolve(filename).normalize());
    }

    @GetMapping("/files/jawaban/{filename}")
    public ResponseEntity<Resource> serveJawabanFile(@PathVariable String filename) {
        return loadResource(Paths.get(uploadDir, "jawaban").resolve(filename).normalize());
    }

    private ResponseEntity<Resource> loadResource(Path filePath) {
        try {
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitTugas(
            @RequestParam("tugasId") Long tugasId,
            @RequestParam("mahasiswaId") Long mahasiswaId,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        Optional<Tugas> tugasOpt = tugasRepository.findById(tugasId);
        Optional<Mahasiswa> mhsOpt = mahasiswaRepository.findById(mahasiswaId);

        if (tugasOpt.isEmpty() || mhsOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Tugas atau Mahasiswa tidak ditemukan");
        }

        String fileUrl = null;
        if (file != null && !file.isEmpty()) {
            try {
                Path uploadPath = Paths.get(uploadDir, "jawaban");
                Files.createDirectories(uploadPath);

                String originalFilename = file.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String uniqueFilename = UUID.randomUUID().toString() + extension;

                Path filePath = uploadPath.resolve(uniqueFilename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                fileUrl = "/api/tugas/files/jawaban/" + uniqueFilename;
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Gagal menyimpan file jawaban: " + e.getMessage());
            }
        }

        // Check if already exists
        Optional<PengumpulanTugas> existing = pengumpulanTugasRepository.findByTugasIdAndMahasiswaId(tugasId, mahasiswaId);
        PengumpulanTugas pengumpulan;
        if (existing.isPresent()) {
            pengumpulan = existing.get();
        } else {
            pengumpulan = new PengumpulanTugas(tugasOpt.get(), mhsOpt.get());
        }
        
        if (fileUrl != null) {
            pengumpulan.setFileJawaban(fileUrl);
        }
        pengumpulan.setStatus("SUDAH_KUMPUL");
        pengumpulan.setDikumpulkan(LocalDateTime.now());
        
        pengumpulanTugasRepository.save(pengumpulan);
        return ResponseEntity.ok(pengumpulan);
    }

    @PostMapping("/submitKuis")
    public ResponseEntity<?> submitKuis(
            @RequestParam("tugasId") Long tugasId,
            @RequestParam("mahasiswaId") Long mahasiswaId,
            @RequestParam("jawaban") String jawabanJson,
            @RequestParam("nilaiPg") Double nilaiPg) {

        try {
            Optional<Kuis> kuisOpt = kuisRepository.findById(tugasId);
            Optional<Mahasiswa> mhsOpt = mahasiswaRepository.findById(mahasiswaId);

            if (kuisOpt.isEmpty() || mhsOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Kuis atau Mahasiswa tidak ditemukan");
            }

            String fileUrl = null;
            try {
                Path uploadPath = Paths.get(uploadDir, "jawaban");
                Files.createDirectories(uploadPath);

                String uniqueFilename = UUID.randomUUID().toString() + ".json";
                Path filePath = uploadPath.resolve(uniqueFilename);
                Files.writeString(filePath, jawabanJson);

                fileUrl = "/api/tugas/files/jawaban/" + uniqueFilename;
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Gagal menyimpan file jawaban kuis: " + e.getMessage());
            }

            Optional<PengumpulanTugas> existing = pengumpulanTugasRepository.findByKuisIdAndMahasiswaId(tugasId, mahasiswaId);
            PengumpulanTugas pengumpulan;
            if (existing.isPresent()) {
                pengumpulan = existing.get();
            } else {
                pengumpulan = new PengumpulanTugas(kuisOpt.get(), mhsOpt.get());
            }
            
            pengumpulan.setFileJawaban(fileUrl);
            pengumpulan.setNilai(nilaiPg);
            pengumpulan.setStatus("SUDAH_KUMPUL");
            pengumpulan.setDikumpulkan(LocalDateTime.now());
            
            pengumpulanTugasRepository.save(pengumpulan);
            return ResponseEntity.ok(pengumpulan);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Internal Error: " + e.getMessage() + " (" + e.getClass().getName() + ")");
        }
    }

    @GetMapping("/submissions/{tugasId}")
    public ResponseEntity<?> getSubmissions(@PathVariable Long tugasId) {
        List<PengumpulanTugas> submissions = pengumpulanTugasRepository.findByTugasId(tugasId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (PengumpulanTugas sub : submissions) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", sub.getId());
            
            Map<String, Object> tugasMap = new HashMap<>();
            tugasMap.put("id", sub.getTugas() != null ? sub.getTugas().getId() : null);
            map.put("tugas", tugasMap);
            
            Map<String, Object> mhsMap = new HashMap<>();
            mhsMap.put("nim", sub.getMahasiswa().getNim());
            mhsMap.put("nama", sub.getMahasiswa().getNama());
            map.put("mahasiswa", mhsMap);
            
            map.put("fileJawaban", sub.getFileJawaban());
            map.put("status", sub.getStatus());
            map.put("nilai", sub.getNilai());
            map.put("detailNilai", sub.getDetailNilai());
            map.put("dikumpulkan", sub.getDikumpulkan());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/grade")
    public ResponseEntity<?> gradeTugas(@RequestBody Map<String, String> request) {
        Long submissionId = Long.parseLong(request.get("submissionId"));
        Double nilai = Double.parseDouble(request.get("nilai"));

        Optional<PengumpulanTugas> submissionOpt = pengumpulanTugasRepository.findById(submissionId);
        if (submissionOpt.isEmpty()) return ResponseEntity.badRequest().body("Submission tidak ditemukan");

        PengumpulanTugas submission = submissionOpt.get();
        submission.setNilai(nilai);
        if (request.containsKey("detailNilai")) {
            submission.setDetailNilai(request.get("detailNilai"));
        }
        submission.setStatus("SUDAH_DINILAI");
        pengumpulanTugasRepository.save(submission);

        return ResponseEntity.ok(submission);
    }
}
