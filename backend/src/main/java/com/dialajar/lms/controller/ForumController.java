package com.dialajar.lms.controller;

import com.dialajar.lms.model.*;
import com.dialajar.lms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/forum")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ForumController {

    @Autowired
    private ForumDiskusiRepository forumRepository;

    @Autowired
    private KomentarForumDiskusiRepository komentarRepository;

    @Autowired
    private MataKuliahRepository mataKuliahRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getForumsByCourse(@PathVariable Long courseId) {
        List<ForumDiskusi> forums = forumRepository.findByMataKuliahId(courseId);
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        
        for (ForumDiskusi f : forums) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", f.getId());
            map.put("judul", f.getJudul());
            map.put("isiForum", f.getIsiForum());
            
            Map<String, Object> pembuatMap = new HashMap<>();
            pembuatMap.put("id", f.getPembuat().getId());
            pembuatMap.put("nama", f.getPembuat().getNama());
            pembuatMap.put("role", f.getPembuat().getRole());
            map.put("pembuat", pembuatMap);
            
            map.put("createdAt", f.getCreatedAt());
            
            Long count = komentarRepository.countByForumDiskusiId(f.getId());
            map.put("repliesCount", count);
            
            result.add(map);
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{forumId}")
    public ResponseEntity<?> getForumDetails(@PathVariable Long forumId) {
        Optional<ForumDiskusi> forumOpt = forumRepository.findById(forumId);
        if (forumOpt.isEmpty()) return ResponseEntity.notFound().build();

        ForumDiskusi f = forumOpt.get();
        Map<String, Object> forumMap = new HashMap<>();
        forumMap.put("id", f.getId());
        forumMap.put("judul", f.getJudul());
        forumMap.put("isiForum", f.getIsiForum());
        forumMap.put("createdAt", f.getCreatedAt());
        
        Map<String, Object> pembuatMap = new HashMap<>();
        pembuatMap.put("id", f.getPembuat().getId());
        pembuatMap.put("nama", f.getPembuat().getNama());
        pembuatMap.put("role", f.getPembuat().getRole());
        forumMap.put("pembuat", pembuatMap);

        List<KomentarForumDiskusi> comments = komentarRepository.findByForumDiskusiId(forumId);
        List<Map<String, Object>> commentsList = new java.util.ArrayList<>();
        for (KomentarForumDiskusi k : comments) {
            Map<String, Object> kMap = new HashMap<>();
            kMap.put("id", k.getId());
            kMap.put("isi", k.getIsi());
            kMap.put("createdAt", k.getCreatedAt());
            
            Map<String, Object> penulisMap = new HashMap<>();
            penulisMap.put("id", k.getPenulis().getId());
            penulisMap.put("nama", k.getPenulis().getNama());
            penulisMap.put("role", k.getPenulis().getRole());
            kMap.put("penulis", penulisMap);
            
            commentsList.add(kMap);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("forum", forumMap);
        response.put("comments", commentsList);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createForum(@RequestBody Map<String, String> request) {
        Long courseId = Long.parseLong(request.get("courseId"));
        Long userId = Long.parseLong(request.get("userId"));

        Optional<MataKuliah> mk = mataKuliahRepository.findById(courseId);
        Optional<User> user = userRepository.findById(userId);

        if (mk.isEmpty() || user.isEmpty()) return ResponseEntity.badRequest().body("Mata kuliah atau user tidak ditemukan");

        ForumDiskusi forum = new ForumDiskusi();
        forum.setJudul(request.get("judul"));
        forum.setIsiForum(request.get("isiForum"));
        forum.setMataKuliah(mk.get());
        forum.setPembuat(user.get());

        forumRepository.save(forum);
        
        Map<String, Object> map = new HashMap<>();
        map.put("id", forum.getId());
        map.put("judul", forum.getJudul());
        map.put("isiForum", forum.getIsiForum());
        map.put("createdAt", forum.getCreatedAt());
        
        Map<String, Object> p = new HashMap<>();
        p.put("id", user.get().getId());
        p.put("nama", user.get().getNama());
        p.put("role", user.get().getRole());
        map.put("pembuat", p);
        map.put("repliesCount", 0);

        return ResponseEntity.ok(map);
    }

    @PostMapping("/comment")
    public ResponseEntity<?> createComment(@RequestBody Map<String, String> request) {
        Long forumId = Long.parseLong(request.get("forumId"));
        Long userId = Long.parseLong(request.get("userId"));

        Optional<ForumDiskusi> forum = forumRepository.findById(forumId);
        Optional<User> user = userRepository.findById(userId);

        if (forum.isEmpty() || user.isEmpty()) return ResponseEntity.badRequest().body("Forum atau user tidak ditemukan");

        KomentarForumDiskusi komentar = new KomentarForumDiskusi();
        komentar.setIsi(request.get("isi"));
        komentar.setForumDiskusi(forum.get());
        komentar.setPenulis(user.get());

        komentarRepository.save(komentar);
        
        Map<String, Object> kMap = new HashMap<>();
        kMap.put("id", komentar.getId());
        kMap.put("isi", komentar.getIsi());
        kMap.put("createdAt", komentar.getCreatedAt());
        
        Map<String, Object> p = new HashMap<>();
        p.put("id", user.get().getId());
        p.put("nama", user.get().getNama());
        p.put("role", user.get().getRole());
        kMap.put("penulis", p);

        return ResponseEntity.ok(kMap);
    }
}
