package com.dialajar.lms.repository;

import com.dialajar.lms.model.Tugas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TugasRepository extends JpaRepository<Tugas, Long> {
    List<Tugas> findByMataKuliahId(Long mataKuliahId);
}
