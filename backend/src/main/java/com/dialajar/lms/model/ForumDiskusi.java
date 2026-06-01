package com.dialajar.lms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "forum_diskusi")
public class ForumDiskusi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String judul;

    @Column(name = "isi_forum", nullable = false, columnDefinition = "TEXT")
    private String isiForum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pembuat_id", nullable = false)
    @JsonIgnore
    private User pembuat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mata_kuliah_id", nullable = false)
    @JsonIgnore
    private MataKuliah mataKuliah;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public ForumDiskusi() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getJudul() { return judul; }
    public void setJudul(String judul) { this.judul = judul; }
    public String getIsiForum() { return isiForum; }
    public void setIsiForum(String isiForum) { this.isiForum = isiForum; }
    public User getPembuat() { return pembuat; }
    public void setPembuat(User pembuat) { this.pembuat = pembuat; }
    public MataKuliah getMataKuliah() { return mataKuliah; }
    public void setMataKuliah(MataKuliah mataKuliah) { this.mataKuliah = mataKuliah; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
