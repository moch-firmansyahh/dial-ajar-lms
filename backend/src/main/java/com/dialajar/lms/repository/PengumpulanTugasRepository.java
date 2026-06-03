package com.dialajar.lms.repository;

import com.dialajar.lms.model.PengumpulanTugas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PengumpulanTugasRepository extends JpaRepository<PengumpulanTugas, Long> {
    List<PengumpulanTugas> findByTugasId(Long tugasId);
    List<PengumpulanTugas> findByKuisId(Long kuisId);
    List<PengumpulanTugas> findByMahasiswaId(Long mahasiswaId);
    Optional<PengumpulanTugas> findByTugasIdAndMahasiswaId(Long tugasId, Long mahasiswaId);
    Optional<PengumpulanTugas> findByKuisIdAndMahasiswaId(Long kuisId, Long mahasiswaId);
}
