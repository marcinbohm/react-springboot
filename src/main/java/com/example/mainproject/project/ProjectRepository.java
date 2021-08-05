package com.example.mainproject.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("" +
            "SELECT CASE WHEN COUNT(p) > 0 THEN " +
            "TRUE ELSE FALSE END " +
            "FROM Project p " +
            "WHERE p.projectNo = ?1"
    )
    Boolean selectExistsProject(String email);

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Project " +
            "SET name = ?2, " +
            "projectNo = ?3, " +
            "projectCode = ?4 " +
            "WHERE id = ?1")
    void updateProject(Long id, String name, String projectNo, String projectCode);
}
