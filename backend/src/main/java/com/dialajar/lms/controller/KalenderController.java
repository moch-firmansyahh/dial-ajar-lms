package com.dialajar.lms.controller;

import com.dialajar.lms.model.MataKuliah;
import com.dialajar.lms.model.Tugas;
import com.dialajar.lms.model.Kuis;
import com.dialajar.lms.repository.MataKuliahRepository;
import com.dialajar.lms.repository.TugasRepository;
import com.dialajar.lms.repository.KuisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/kalender")
@CrossOrigin(origins = "*")
public class KalenderController {

    @Autowired
    private MataKuliahRepository mataKuliahRepository;

    @Autowired
    private TugasRepository tugasRepository;

    @Autowired
    private KuisRepository kuisRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getKalenderEvents(@PathVariable Long userId, @RequestParam String role) {
        List<MataKuliah> courses;
        if ("DOSEN".equalsIgnoreCase(role)) {
            courses = mataKuliahRepository.findByDosenId(userId);
        } else {
            courses = mataKuliahRepository.findByMahasiswas_Id(userId);
        }

        List<Map<String, Object>> events = new ArrayList<>();

        for (MataKuliah mk : courses) {
            // Tugas
            List<Tugas> tugasList = tugasRepository.findByMataKuliahId(mk.getId());
            for (Tugas t : tugasList) {
                if (t.getDeadline() != null) {
                    Map<String, Object> event = new HashMap<>();
                    event.put("day", t.getDeadline().getDayOfMonth());
                    event.put("month", t.getDeadline().getMonthValue() - 1); // 0-indexed for JS
                    event.put("year", t.getDeadline().getYear());
                    event.put("title", t.getJudul() + " (" + mk.getKodeKelas() + ")");
                    event.put("type", "tugas"); // maps to kalender CSS
                    event.put("tag", "Tugas");
                    events.add(event);
                }
            }

            // Kuis
            List<Kuis> kuisList = kuisRepository.findByMataKuliahId(mk.getId());
            for (Kuis k : kuisList) {
                if (k.getDeadline() != null) {
                    Map<String, Object> event = new HashMap<>();
                    event.put("day", k.getDeadline().getDayOfMonth());
                    event.put("month", k.getDeadline().getMonthValue() - 1);
                    event.put("year", k.getDeadline().getYear());
                    event.put("title", k.getJudul() + " (" + mk.getKodeKelas() + ")");
                    event.put("type", "kuis"); // maps to kalender CSS
                    event.put("tag", "Kuis");
                    events.add(event);
                }
            }
        }

        return ResponseEntity.ok(events);
    }
}
