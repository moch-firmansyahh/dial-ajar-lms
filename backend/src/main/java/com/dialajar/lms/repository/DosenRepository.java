package com.dialajar.lms.repository;

import com.dialajar.lms.model.Dosen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DosenRepository extends JpaRepository<Dosen, Long> {
    Optional<Dosen> findByNip(String nip);
}
