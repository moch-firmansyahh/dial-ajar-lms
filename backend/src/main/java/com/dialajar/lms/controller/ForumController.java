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
    private KomentarForumRepository komentarRepository;

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
            map.put("pembuat", f.getPembuat());
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

        List<KomentarForum> comments = komentarRepository.findByForumDiskusiId(forumId);

        Map<String, Object> response = new HashMap<>();
        response.put("forum", forumOpt.get());
        response.put("comments", comments);

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
        return ResponseEntity.ok(forum);
    }

    @PostMapping("/comment")
    public ResponseEntity<?> createComment(@RequestBody Map<String, String> request) {
        Long forumId = Long.parseLong(request.get("forumId"));
        Long userId = Long.parseLong(request.get("userId"));

        Optional<ForumDiskusi> forum = forumRepository.findById(forumId);
        Optional<User> user = userRepository.findById(userId);

        if (forum.isEmpty() || user.isEmpty()) return ResponseEntity.badRequest().body("Forum atau user tidak ditemukan");

        KomentarForum komentar = new KomentarForum();
        komentar.setIsi(request.get("isi"));
        komentar.setForumDiskusi(forum.get());
        komentar.setPenulis(user.get());

        komentarRepository.save(komentar);
        return ResponseEntity.ok(komentar);
    }
}
