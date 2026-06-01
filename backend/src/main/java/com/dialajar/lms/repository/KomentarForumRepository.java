package com.dialajar.lms.repository;

import com.dialajar.lms.model.KomentarForum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KomentarForumRepository extends JpaRepository<KomentarForum, Long> {
    List<KomentarForum> findByForumDiskusiId(Long forumId);
    Long countByForumDiskusiId(Long forumId);
}
