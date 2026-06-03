package com.dialajar.lms.controller;

import com.dialajar.lms.dto.KuisRequest;
import com.dialajar.lms.dto.SoalRequest;
import com.dialajar.lms.model.Kuis;
import com.dialajar.lms.model.MataKuliah;
import com.dialajar.lms.model.Soal;
import com.dialajar.lms.repository.KuisRepository;
import com.dialajar.lms.repository.MataKuliahRepository;
import com.dialajar.lms.repository.SoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/kuis")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class KuisController {

    @Autowired
    private KuisRepository kuisRepository;

    @Autowired
    private SoalRepository soalRepository;

    @Autowired
    private MataKuliahRepository mataKuliahRepository;

    @PostMapping
    public ResponseEntity<?> createKuis(@RequestBody KuisRequest request) {
        Optional<MataKuliah> mk = mataKuliahRepository.findById(request.getCourseId());
        if (mk.isEmpty()) return ResponseEntity.badRequest().body("Mata kuliah tidak ditemukan");

        Kuis kuis = new Kuis(
                request.getJudul(),
                request.getDeskripsi(),
                LocalDateTime.parse(request.getDeadline()),
                request.getDurasiMenit(),
                mk.get()
        );
        kuisRepository.save(kuis);

        if (request.getSoalList() != null) {
            for (SoalRequest soalReq : request.getSoalList()) {
                Soal soal = new Soal();
                soal.setKuis(kuis);
                soal.setPertanyaan(soalReq.getPertanyaan());
                soal.setPilihanA(soalReq.getPilihanA());
                soal.setPilihanB(soalReq.getPilihanB());
                soal.setPilihanC(soalReq.getPilihanC());
                soal.setPilihanD(soalReq.getPilihanD());
                soal.setKunciJawaban(soalReq.getKunciJawaban() != null ? soalReq.getKunciJawaban() : "-");
                soal.setSkor(soalReq.getSkor() != null ? soalReq.getSkor() : 10.0);
                soal.setTipe(soalReq.getTipe() != null ? soalReq.getTipe() : "PILIHAN_GANDA");
                
                soalRepository.save(soal);
            }
        }

        return ResponseEntity.ok(kuis);
    }

    @GetMapping("/{kuisId}")
    public ResponseEntity<?> getKuisById(@PathVariable Long kuisId) {
        Optional<Kuis> kuis = kuisRepository.findById(kuisId);
        if (kuis.isPresent()) {
            return ResponseEntity.ok(kuis.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{kuisId}/soal")
    public ResponseEntity<?> getSoalByKuis(@PathVariable Long kuisId) {
        java.util.List<Soal> soalList = soalRepository.findByKuisId(kuisId);
        return ResponseEntity.ok(soalList);
    }

    @GetMapping("/submissions/{kuisId}")
    public ResponseEntity<?> getSubmissions(@PathVariable Long kuisId) {
        java.util.List<com.dialajar.lms.model.PengumpulanTugas> submissions = 
            org.springframework.web.context.support.WebApplicationContextUtils
            .getRequiredWebApplicationContext(
                ((org.springframework.web.context.request.ServletRequestAttributes) 
                org.springframework.web.context.request.RequestContextHolder.getRequestAttributes())
                .getRequest().getServletContext()
            ).getBean(com.dialajar.lms.repository.PengumpulanTugasRepository.class)
            .findByKuisId(kuisId);

        java.util.List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        for (com.dialajar.lms.model.PengumpulanTugas sub : submissions) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", sub.getId());
            
            java.util.Map<String, Object> tugasMap = new java.util.HashMap<>();
            tugasMap.put("id", sub.getKuis().getId());
            map.put("tugas", tugasMap);
            
            java.util.Map<String, Object> mhsMap = new java.util.HashMap<>();
            mhsMap.put("nim", sub.getMahasiswa().getNim());
            mhsMap.put("nama", sub.getMahasiswa().getNama());
            map.put("mahasiswa", mhsMap);
            
            map.put("fileJawaban", sub.getFileJawaban());
            map.put("status", sub.getStatus());
            map.put("nilai", sub.getNilai());
            map.put("dikumpulkan", sub.getDikumpulkan());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }
}
