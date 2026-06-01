package com.dialajar.lms.repository;

import com.dialajar.lms.model.Soal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoalRepository extends JpaRepository<Soal, Long> {
    List<Soal> findByKuisId(Long kuisId);
}
