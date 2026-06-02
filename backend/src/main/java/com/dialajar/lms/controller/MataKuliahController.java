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

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class MataKuliahController {

    @Autowired
    private MataKuliahRepository mataKuliahRepository;

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
}