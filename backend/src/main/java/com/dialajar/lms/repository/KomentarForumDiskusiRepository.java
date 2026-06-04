package com.dialajar.lms.repository;

import com.dialajar.lms.model.KomentarForumDiskusi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KomentarForumDiskusiRepository extends JpaRepository<KomentarForumDiskusi, Long> {
    List<KomentarForumDiskusi> findByForumDiskusiId(Long forumId);
    Long countByForumDiskusiId(Long forumId);
}
