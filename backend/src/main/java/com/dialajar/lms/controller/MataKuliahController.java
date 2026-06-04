package com.dialajar.lms.controller;

import com.dialajar.lms.model.MataKuliah;
import com.dialajar.lms.model.ModulAjar;
import com.dialajar.lms.model.Tugas;
import com.dialajar.lms.model.VideoAjar;
import com.dialajar.lms.repository.ForumDiskusiRepository;
import com.dialajar.lms.repository.MataKuliahRepository;
import com.dialajar.lms.repository.ModulAjarRepository;
import com.dialajar.lms.repository.TugasRepository;
import com.dialajar.lms.repository.VideoAjarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.dialajar.lms.dto.request.CourseCreateRequest;
import com.dialajar.lms.dto.request.CourseJoinRequest;
import com.dialajar.lms.model.Dosen;
import com.dialajar.lms.model.Mahasiswa;
import com.dialajar.lms.repository.UserRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class MataKuliahController {

    @Autowired
    private MataKuliahRepository mataKuliahRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModulAjarRepository modulAjarRepository;

    @Autowired
    private VideoAjarRepository videoAjarRepository;

    @Autowired
    private TugasRepository tugasRepository;

    @Autowired
    private ForumDiskusiRepository forumDiskusiRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCoursesByUser(
            @PathVariable Long userId,
            @RequestParam String role
    ) {
        List<MataKuliah> courses;

        if (role.equalsIgnoreCase("DOSEN")) {
            courses = mataKuliahRepository.findByDosenId(userId);
        } else {
            courses = mataKuliahRepository.findByMahasiswas_Id(userId);
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (MataKuliah mk : courses) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", mk.getId());
            map.put("nama", mk.getNama());
            map.put("kodeKelas", mk.getKodeKelas());
            map.put("dosen", mk.getDosen() != null ? mk.getDosen().getNama() : "Unknown");

            Long forumCount = forumDiskusiRepository.countByMataKuliahId(mk.getId());
            map.put("forumCount", forumCount);

            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<?> getCourseById(@PathVariable Long courseId) {
        return mataKuliahRepository.findById(courseId)
                .map(mk -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", mk.getId());
                    map.put("nama", mk.getNama());
                    map.put("kodeKelas", mk.getKodeKelas());
                    map.put("dosen", mk.getDosen() != null ? mk.getDosen().getNama() : "Unknown");

                    Long forumCount = forumDiskusiRepository.countByMataKuliahId(mk.getId());
                    map.put("forumCount", forumCount);

                    return ResponseEntity.ok((Object) map);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{courseId}/content")
    public ResponseEntity<?> getCourseContent(@PathVariable Long courseId) {
        List<ModulAjar> modules = modulAjarRepository.findByMataKuliahId(courseId);
        List<VideoAjar> videos = videoAjarRepository.findByMataKuliahId(courseId);
        List<Tugas> tugas = tugasRepository.findByMataKuliahId(courseId);

        Map<String, Object> content = new HashMap<>();
        content.put("modules", modules);
        content.put("videos", videos);
        content.put("tugas", tugas);

        return ResponseEntity.ok(content);
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CourseCreateRequest request) {
        try {
            Optional<com.dialajar.lms.model.User> dosenOpt = userRepository.findById(request.getDosenId());
            if (dosenOpt.isEmpty() || !(dosenOpt.get() instanceof Dosen)) {
                return ResponseEntity.badRequest().body("Dosen tidak ditemukan");
            }
            
            String generatedKode;
            do {
                generatedKode = generateKodeKelas(request.getNama());
            } while (mataKuliahRepository.existsByKodeKelas(generatedKode));

            MataKuliah mk = new MataKuliah(request.getNama(), generatedKode, (Dosen) dosenOpt.get());
            mataKuliahRepository.save(mk);
            return ResponseEntity.ok(Map.of(
                "message", "Mata Kuliah berhasil dibuat", 
                "id", mk.getId(),
                "kodeKelas", generatedKode
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    private String generateKodeKelas(String nama) {
        if (nama == null || nama.trim().isEmpty()) return "UNK-000";
        String[] words = nama.trim().split("\\s+");
        String prefix = "";
        
        if (words.length >= 3) {
            prefix = "" + words[0].charAt(0) + words[1].charAt(0) + words[2].charAt(0);
        } else if (words.length == 2) {
            String w1 = words[0];
            String w2 = words[1];
            prefix = "" + (w1.length() > 0 ? w1.charAt(0) : "") + 
                          (w1.length() > 1 ? w1.charAt(1) : "") + 
                          (w2.length() > 0 ? w2.charAt(0) : "");
        } else {
            String w1 = words[0];
            if (w1.length() >= 3) {
                prefix = w1.substring(0, 3);
            } else {
                prefix = w1;
            }
        }
        
        while (prefix.length() < 3) prefix += "X";
        prefix = prefix.toUpperCase();
        
        int randomNum = (int) (Math.random() * 900) + 100; // 100 to 999
        return prefix + "-" + randomNum;
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinCourse(@RequestBody CourseJoinRequest request) {
        try {
            Optional<MataKuliah> mkOpt = mataKuliahRepository.findByKodeKelas(request.getKodeKelas());
            if (mkOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Kode Kelas tidak ditemukan");
            }

            Optional<com.dialajar.lms.model.User> mhsOpt = userRepository.findById(request.getMahasiswaId());
            if (mhsOpt.isEmpty() || !(mhsOpt.get() instanceof Mahasiswa)) {
                return ResponseEntity.badRequest().body("Mahasiswa tidak ditemukan");
            }

            MataKuliah mk = mkOpt.get();
            Mahasiswa mhs = (Mahasiswa) mhsOpt.get();

            if (mk.getMahasiswas().contains(mhs)) {
                return ResponseEntity.badRequest().body("Anda sudah terdaftar di kelas ini");
            }

            mk.getMahasiswas().add(mhs);
            mataKuliahRepository.save(mk);
            return ResponseEntity.ok(Map.of("message", "Berhasil bergabung ke kelas"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{courseId}/students")
    public ResponseEntity<?> getCourseStudents(@PathVariable Long courseId) {
        return mataKuliahRepository.findById(courseId)
                .map(mk -> {
                    List<Map<String, Object>> students = new ArrayList<>();
                    for (Mahasiswa m : mk.getMahasiswas()) {
                        Map<String, Object> smap = new HashMap<>();
                        smap.put("id", m.getId());
                        smap.put("nama", m.getNama());
                        smap.put("nomorInduk", m.getNomorInduk());
                        students.add(smap);
                    }
                    return ResponseEntity.ok(students);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}