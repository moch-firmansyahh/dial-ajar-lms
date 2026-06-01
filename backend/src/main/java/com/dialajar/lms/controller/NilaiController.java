package com.dialajar.lms.controller;

import com.dialajar.lms.model.Nilai;
import com.dialajar.lms.repository.NilaiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nilai")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class NilaiController {

    @Autowired
    private NilaiRepository nilaiRepository;

    @GetMapping("/mahasiswa/{mahasiswaId}")
    public ResponseEntity<?> getNilaiMahasiswa(@PathVariable Long mahasiswaId) {
        List<Nilai> nilaiList = nilaiRepository.findByMahasiswaId(mahasiswaId);
        List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        for (Nilai n : nilaiList) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", n.getId());
            map.put("mataKuliahNama", n.getMataKuliah() != null ? n.getMataKuliah().getNama() : "Unknown");
            map.put("nilaiTugas", n.getNilaiTugas());
            map.put("nilaiKuis", n.getNilaiKuis());
            map.put("nilaiAkhir", n.getNilaiAkhir());
            map.put("updatedAt", n.getUpdatedAt());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }
}
