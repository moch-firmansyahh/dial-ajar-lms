package com.dialajar.lms.repository;

import com.dialajar.lms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByNomorInduk(String nomorInduk);
    Optional<User> findByEmail(String email);
    boolean existsByNomorInduk(String nomorInduk);
    boolean existsByEmail(String email);
}
