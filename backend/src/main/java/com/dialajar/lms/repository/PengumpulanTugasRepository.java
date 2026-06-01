package com.dialajar.lms.repository;

import com.dialajar.lms.model.PengumpulanTugas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PengumpulanTugasRepository extends JpaRepository<PengumpulanTugas, Long> {
    List<PengumpulanTugas> findByTugasId(Long tugasId);
    List<PengumpulanTugas> findByMahasiswaId(Long mahasiswaId);
}
