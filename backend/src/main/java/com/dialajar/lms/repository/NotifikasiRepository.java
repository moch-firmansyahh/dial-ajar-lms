package com.dialajar.lms.repository;

import com.dialajar.lms.model.Notifikasi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotifikasiRepository extends JpaRepository<Notifikasi, Long> {
    List<Notifikasi> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notifikasi> findByUserIdAndReadStatusFalse(Long userId);
}
