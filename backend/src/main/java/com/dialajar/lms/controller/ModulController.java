package com.dialajar.lms.controller;

import com.dialajar.lms.model.MataKuliah;
import com.dialajar.lms.model.ModulAjar;
import com.dialajar.lms.model.VideoAjar;
import com.dialajar.lms.repository.MataKuliahRepository;
import com.dialajar.lms.repository.ModulAjarRepository;
import com.dialajar.lms.repository.VideoAjarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

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

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    // ─── Upload PDF/DOCX file ────────────────────────────────────────────
    @PostMapping("/upload")
    public ResponseEntity<?> uploadModul(
            @RequestParam("file") MultipartFile file,
            @RequestParam("judul") String judul,
            @RequestParam("courseId") Long courseId) {

        Optional<MataKuliah> mk = mataKuliahRepository.findById(courseId);
        if (mk.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mata kuliah tidak ditemukan"));
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir, "modul");
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Save file to disk
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Determine file type from extension
            String tipe = extension.replace(".", "").toUpperCase();
            if (tipe.isEmpty()) tipe = "PDF";

            // Save to database — store the relative path for serving
            String fileUrl = "/api/modules/files/" + uniqueFilename;
            ModulAjar modul = new ModulAjar(judul, tipe, fileUrl, mk.get());
            modulAjarRepository.save(modul);

            Map<String, Object> response = new HashMap<>();
            response.put("id", modul.getId());
            response.put("judul", modul.getJudul());
            response.put("tipe", modul.getTipe());
            response.put("fileUrl", fileUrl);
            response.put("message", "File berhasil diupload");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Gagal menyimpan file: " + e.getMessage()));
        }
    }

    // ─── Serve uploaded files ────────────────────────────────────────────
    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, "modul").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Determine content type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ─── Create PDF modul with URL (legacy/link-based) ───────────────────
    @PostMapping("/pdf")
    public ResponseEntity<?> createModul(@RequestBody Map<String, String> request) {
        Long courseId = Long.parseLong(request.get("courseId"));
        Optional<MataKuliah> mk = mataKuliahRepository.findById(courseId);
        if (mk.isEmpty()) return ResponseEntity.badRequest().body("Mata kuliah tidak ditemukan");

        ModulAjar modul = new ModulAjar(request.get("judul"), "PDF", request.get("filePath"), mk.get());
        modulAjarRepository.save(modul);
        return ResponseEntity.ok(modul);
    }

    // ─── Create video with YouTube/external link ─────────────────────────
    @PostMapping("/video")
    public ResponseEntity<?> createVideo(@RequestBody Map<String, String> request) {
        Long courseId = Long.parseLong(request.get("courseId"));
        Optional<MataKuliah> mk = mataKuliahRepository.findById(courseId);
        if (mk.isEmpty()) return ResponseEntity.badRequest().body("Mata kuliah tidak ditemukan");

        VideoAjar video = new VideoAjar(request.get("judul"), request.get("linkVideo"), mk.get());
        videoAjarRepository.save(video);
        return ResponseEntity.ok(video);
    }

    // ─── Delete modul ────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteModul(@PathVariable Long id) {
        Optional<ModulAjar> modul = modulAjarRepository.findById(id);
        if (modul.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Delete file from disk if it's an uploaded file
        String filePath = modul.get().getFilePath();
        if (filePath != null && filePath.startsWith("/api/modules/files/")) {
            String filename = filePath.replace("/api/modules/files/", "");
            try {
                Path path = Paths.get(uploadDir, "modul").resolve(filename);
                Files.deleteIfExists(path);
            } catch (IOException ignored) {
            }
        }

        modulAjarRepository.delete(modul.get());
        return ResponseEntity.ok(Map.of("message", "Modul berhasil dihapus"));
    }

    // ─── Delete video ────────────────────────────────────────────────────
    @DeleteMapping("/video/{id}")
    public ResponseEntity<?> deleteVideo(@PathVariable Long id) {
        Optional<VideoAjar> video = videoAjarRepository.findById(id);
        if (video.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        videoAjarRepository.delete(video.get());
        return ResponseEntity.ok(Map.of("message", "Video berhasil dihapus"));
    }
}
