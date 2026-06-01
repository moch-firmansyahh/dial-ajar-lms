package com.dialajar.lms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "komentar_forum")
public class KomentarForum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forum_id", nullable = false)
    @JsonIgnore
    private ForumDiskusi forumDiskusi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "penulis_id", nullable = false)
    @JsonIgnore
    private User penulis;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String isi;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public KomentarForum() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ForumDiskusi getForumDiskusi() { return forumDiskusi; }
    public void setForumDiskusi(ForumDiskusi forumDiskusi) { this.forumDiskusi = forumDiskusi; }
    public User getPenulis() { return penulis; }
    public void setPenulis(User penulis) { this.penulis = penulis; }
    public String getIsi() { return isi; }
    public void setIsi(String isi) { this.isi = isi; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
