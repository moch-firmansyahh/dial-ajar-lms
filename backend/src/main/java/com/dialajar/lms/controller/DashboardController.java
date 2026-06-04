package com.dialajar.lms.controller;

import com.dialajar.lms.model.MataKuliah;
import com.dialajar.lms.model.Tugas;
import com.dialajar.lms.model.Kuis;
import com.dialajar.lms.repository.MataKuliahRepository;
import com.dialajar.lms.repository.TugasRepository;
import com.dialajar.lms.repository.KuisRepository;
import com.dialajar.lms.repository.PengumpulanTugasRepository;
import com.dialajar.lms.model.PengumpulanTugas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private MataKuliahRepository mataKuliahRepository;

    @Autowired
    private TugasRepository tugasRepository;

    @Autowired
    private KuisRepository kuisRepository;

    @Autowired
    private PengumpulanTugasRepository pengumpulanTugasRepository;

    @GetMapping("/dosen/{userId}")
    public ResponseEntity<?> getDashboardStatsDosen(@PathVariable Long userId) {
        List<MataKuliah> courses = mataKuliahRepository.findByDosenId(userId);
        
        int kelasAktif = courses.size();
        Set<Long> uniqueMahasiswaIds = new HashSet<>();
        int tugasPerluDinilai = 0;
        int kuisAktif = 0;
        
        for (MataKuliah mk : courses) {
            mk.getMahasiswas().forEach(m -> uniqueMahasiswaIds.add(m.getId()));
            
            // Hitung kuis yang belum lewat deadline
            List<Kuis> kuisList = kuisRepository.findByMataKuliahId(mk.getId());
            for (Kuis k : kuisList) {
                if (k.getDeadline() != null && k.getDeadline().isAfter(LocalDateTime.now())) {
                    kuisAktif++;
                }
            }
            
            // Hitung tugas yang sudah dikumpul tapi belum dinilai
            List<Tugas> tugasList = tugasRepository.findByMataKuliahId(mk.getId());
            for (Tugas t : tugasList) {
                List<PengumpulanTugas> pengumpulan = pengumpulanTugasRepository.findByTugasId(t.getId());
                for (PengumpulanTugas p : pengumpulan) {
                    if ("SUDAH_KUMPUL".equals(p.getStatus())) {
                        tugasPerluDinilai++;
                    }
                }
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("kelasAktif", kelasAktif);
        response.put("totalMahasiswa", uniqueMahasiswaIds.size());
        response.put("tugasPerluDinilai", tugasPerluDinilai);
        response.put("kuisAktif", kuisAktif);
        
        return ResponseEntity.ok(response);
    }
    @GetMapping("/mahasiswa/{userId}")
    public ResponseEntity<?> getDashboardStats(@PathVariable Long userId) {
        List<MataKuliah> courses = mataKuliahRepository.findByMahasiswas_Id(userId);
        
        int mataKuliahCount = courses.size();
        int tugasMendatang = 0;
        int kuisMendatang = 0;
        
        List<Map<String, Object>> deadlines = new ArrayList<>();
        
        for (MataKuliah mk : courses) {
            // Count and aggregate Tugas
            List<Tugas> tugasList = tugasRepository.findByMataKuliahId(mk.getId());
            for (Tugas t : tugasList) {
                if (t.getDeadline() != null && t.getDeadline().isAfter(LocalDateTime.now())) {
                    tugasMendatang++;
                    Map<String, Object> deadline = new HashMap<>();
                    deadline.put("id", t.getId());
                    deadline.put("courseId", mk.getId());
                    deadline.put("type", "tugas");
                    deadline.put("title", t.getJudul());
                    deadline.put("matkul", mk.getKodeKelas() + " - " + mk.getNama());
                    deadline.put("time", t.getDeadline().toString()); // frontend can format this
                    deadline.put("urgency", getUrgency(t.getDeadline()));
                    deadlines.add(deadline);
                }
            }
            
            // Count and aggregate Kuis
            List<Kuis> kuisList = kuisRepository.findByMataKuliahId(mk.getId());
            for (Kuis k : kuisList) {
                if (k.getDeadline() != null && k.getDeadline().isAfter(LocalDateTime.now())) {
                    kuisMendatang++;
                    Map<String, Object> deadline = new HashMap<>();
                    deadline.put("id", k.getId() + 1000); // offset id for unique key in UI
                    deadline.put("courseId", mk.getId());
                    deadline.put("type", "kuis");
                    deadline.put("title", k.getJudul());
                    deadline.put("matkul", mk.getKodeKelas() + " - " + mk.getNama());
                    deadline.put("time", k.getDeadline().toString());
                    deadline.put("urgency", getUrgency(k.getDeadline()));
                    deadlines.add(deadline);
                }
            }
        }
        
        

        Map<String, Object> response = new HashMap<>();
        response.put("mataKuliah", mataKuliahCount);
        response.put("tugasMendatang", tugasMendatang);
        response.put("kuisMendatang", kuisMendatang);
        response.put("deadlines", deadlines);
        
        return ResponseEntity.ok(response);
    }
    
    private String getUrgency(LocalDateTime deadline) {
        LocalDateTime now = LocalDateTime.now();
        if (deadline.isBefore(now.plusDays(1))) return "bahaya";
        if (deadline.isBefore(now.plusDays(3))) return "peringatan";
        return "normal";
    }
}
