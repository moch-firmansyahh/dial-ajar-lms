package com.dialajar.lms.controller;

import com.dialajar.lms.model.Notifikasi;
import com.dialajar.lms.repository.NotifikasiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifikasi")
@CrossOrigin(origins = "*")
public class NotifikasiController {

    @Autowired
    private NotifikasiRepository notifikasiRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notifikasi>> getNotifikasi(@PathVariable Long userId) {
        return ResponseEntity.ok(notifikasiRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Optional<Notifikasi> notifOpt = notifikasiRepository.findById(id);
        if (notifOpt.isPresent()) {
            Notifikasi notif = notifOpt.get();
            notif.setReadStatus(true);
            notifikasiRepository.save(notif);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
