package com.dialajar.lms.repository;

import com.dialajar.lms.model.Kuis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KuisRepository extends JpaRepository<Kuis, Long> {
    List<Kuis> findByMataKuliahId(Long mataKuliahId);
}
