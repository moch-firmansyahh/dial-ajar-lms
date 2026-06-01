package com.dialajar.lms.repository;

import com.dialajar.lms.model.ModulAjar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModulAjarRepository extends JpaRepository<ModulAjar, Long> {
    List<ModulAjar> findByMataKuliahId(Long mataKuliahId);
}
