package com.dialajar.lms.controller;

import com.dialajar.lms.model.*;
import com.dialajar.lms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    private KuisRepository kuisRepository;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getTugasByCourse(@PathVariable Long courseId) {
        List<Tugas> tugasList = tugasRepository.findByMataKuliahId(courseId);
        List<Kuis> kuisList = kuisRepository.findByMataKuliahId(courseId);
        
        List<Map<String, Object>> combinedList = new java.util.ArrayList<>();
        
        for(Tugas t : tugasList) {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", t.getId());
            map.put("judul", t.getJudul());
            map.put("detailTugas", t.getDetailTugas());
            map.put("deadline", t.getDeadline());
            map.put("fileSoal", t.getFileSoal());
            map.put("tipe", "tugas");
            combinedList.add(map);
        }
        
        for(Kuis k : kuisList) {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", k.getId() + 1000); // Prevent ID collision
            map.put("judul", k.getJudul());
            map.put("detailTugas", k.getDeskripsi());
            map.put("deadline", k.getDeadline());
            map.put("durasiMenit", k.getDurasiMenit());
            map.put("tipe", "kuis");
            combinedList.add(map);
        }
        
        return ResponseEntity.ok(combinedList);
    }

    @PostMapping
    public ResponseEntity<?> createTugas(@RequestBody Map<String, String> request) {
        Long courseId = Long.parseLong(request.get("courseId"));
        Optional<MataKuliah> mk = mataKuliahRepository.findById(courseId);
        if (mk.isEmpty()) return ResponseEntity.badRequest().body("Mata kuliah tidak ditemukan");

        Tugas tugas = new Tugas(
                request.get("judul"),
                request.get("detailTugas"),
                LocalDateTime.parse(request.get("deadline")),
                request.get("fileSoal"),
                mk.get()
        );
        tugasRepository.save(tugas);
        return ResponseEntity.ok(tugas);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitTugas(@RequestBody Map<String, String> request) {
        Long tugasId = Long.parseLong(request.get("tugasId"));
        Long mahasiswaId = Long.parseLong(request.get("mahasiswaId"));

        Optional<Tugas> tugasOpt = tugasRepository.findById(tugasId);
        Optional<User> mhsOpt = userRepository.findById(mahasiswaId);

        if (tugasOpt.isEmpty() || mhsOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Tugas atau Mahasiswa tidak ditemukan");
        }

        PengumpulanTugas pengumpulan = new PengumpulanTugas(tugasOpt.get(), (Mahasiswa) mhsOpt.get());
        pengumpulan.setFileJawaban(request.get("fileJawaban"));
        pengumpulan.setStatus("SUDAH_KUMPUL");
        pengumpulan.setDikumpulkan(LocalDateTime.now());
        
        pengumpulanTugasRepository.save(pengumpulan);
        return ResponseEntity.ok(pengumpulan);
    }

    @GetMapping("/submissions/{tugasId}")
    public ResponseEntity<?> getSubmissions(@PathVariable Long tugasId) {
        List<PengumpulanTugas> submissions = pengumpulanTugasRepository.findByTugasId(tugasId);
        return ResponseEntity.ok(submissions);
    }

    @PostMapping("/grade")
    public ResponseEntity<?> gradeTugas(@RequestBody Map<String, String> request) {
        Long submissionId = Long.parseLong(request.get("submissionId"));
        Double nilai = Double.parseDouble(request.get("nilai"));

        Optional<PengumpulanTugas> submissionOpt = pengumpulanTugasRepository.findById(submissionId);
        if (submissionOpt.isEmpty()) return ResponseEntity.badRequest().body("Submission tidak ditemukan");

        PengumpulanTugas submission = submissionOpt.get();
        submission.setNilai(nilai);
        submission.setStatus("SUDAH_DINILAI");
        pengumpulanTugasRepository.save(submission);

        return ResponseEntity.ok(submission);
    }
}
