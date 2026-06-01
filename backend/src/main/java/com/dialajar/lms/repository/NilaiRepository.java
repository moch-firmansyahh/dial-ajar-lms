package com.dialajar.lms.repository;

import com.dialajar.lms.model.Nilai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NilaiRepository extends JpaRepository<Nilai, Long> {
    List<Nilai> findByMahasiswaId(Long mahasiswaId);
    List<Nilai> findByMataKuliahId(Long mataKuliahId);
}
