package com.dialajar.lms.repository;

import com.dialajar.lms.model.MataKuliah;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MataKuliahRepository extends JpaRepository<MataKuliah, Long> {
    List<MataKuliah> findByDosenId(Long dosenId);
    List<MataKuliah> findByMahasiswas_Id(Long mahasiswaId);
    MataKuliah findByKodeKelas(String kodeKelas);
}
