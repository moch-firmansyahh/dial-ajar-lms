package com.dialajar.lms.controller;

import com.dialajar.lms.model.User;
import com.dialajar.lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(null); // hide password
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    public static class ProfileUpdateRequest {
        private String nama;
        private String nomorInduk;
        private String email;
        private String password;
        
        public String getNama() { return nama; }
        public void setNama(String nama) { this.nama = nama; }
        public String getNomorInduk() { return nomorInduk; }
        public void setNomorInduk(String nomorInduk) { this.nomorInduk = nomorInduk; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @RequestBody ProfileUpdateRequest request) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Update fields
            if (request.getNama() != null) user.setNama(request.getNama());
            if (request.getNomorInduk() != null) user.setNomorInduk(request.getNomorInduk());
            if (request.getEmail() != null) user.setEmail(request.getEmail());
            
            // Validate and encode new password if provided
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                String pw = request.getPassword();
                if (pw.length() < 6 || !pw.matches(".*[A-Z].*") || !pw.matches(".*[a-z].*") || !pw.matches(".*[^a-zA-Z0-9].*")) {
                    return ResponseEntity.badRequest().body("Password tidak memenuhi syarat keamanan.");
                }
                user.setPassword(passwordEncoder.encode(pw));
            }
            
            userRepository.save(user);
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{userId}/upload")
    public ResponseEntity<?> uploadProfilePicture(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
            
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File kosong");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            return ResponseEntity.badRequest().body("Format file tidak valid");
        }
        
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf(".");
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        }

        if (!extension.equals(".jpg") && !extension.equals(".jpeg") && !extension.equals(".png")) {
            return ResponseEntity.badRequest().body("Hanya format JPG dan PNG yang diperbolehkan.");
        }

        try {
            Path uploadPath = Paths.get(uploadDir, "profiles");
            Files.createDirectories(uploadPath);

            String uniqueFilename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/api/profile/files/" + uniqueFilename;
            
            User user = userOpt.get();
            user.setProfilePicture(fileUrl);
            userRepository.save(user);
            
            return ResponseEntity.ok().body("{\"url\":\"" + fileUrl + "\"}");
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Gagal menyimpan file: " + e.getMessage());
        }
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> serveProfilePicture(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, "profiles").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

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
}
