package com.dialajar.lms.controller;

import com.dialajar.lms.model.MataKuliah;
import com.dialajar.lms.model.ModulAjar;
import com.dialajar.lms.model.VideoAjar;
import com.dialajar.lms.repository.MataKuliahRepository;
import com.dialajar.lms.repository.ModulAjarRepository;
import com.dialajar.lms.repository.VideoAjarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ModulController {

    @Autowired
    private ModulAjarRepository modulAjarRepository;

    @Autowired
    private VideoAjarRepository videoAjarRepository;

    @Autowired
    private MataKuliahRepository mataKuliahRepository;

    @PostMapping("/pdf")
    public ResponseEntity<?> createModul(@RequestBody Map<String, String> request) {
        Long courseId = Long.parseLong(request.get("courseId"));
        Optional<MataKuliah> mk = mataKuliahRepository.findById(courseId);
        if (mk.isEmpty()) return ResponseEntity.badRequest().body("Mata kuliah tidak ditemukan");

        ModulAjar modul = new ModulAjar(request.get("judul"), "PDF", request.get("filePath"), mk.get());
        modulAjarRepository.save(modul);
        return ResponseEntity.ok(modul);
    }

    @PostMapping("/video")
    public ResponseEntity<?> createVideo(@RequestBody Map<String, String> request) {
        Long courseId = Long.parseLong(request.get("courseId"));
        Optional<MataKuliah> mk = mataKuliahRepository.findById(courseId);
        if (mk.isEmpty()) return ResponseEntity.badRequest().body("Mata kuliah tidak ditemukan");

        VideoAjar video = new VideoAjar(request.get("judul"), request.get("linkVideo"), mk.get());
        videoAjarRepository.save(video);
        return ResponseEntity.ok(video);
    }
}
