package com.example.mainproject.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("" +
            "SELECT CASE WHEN COUNT(s) > 0 THEN " +
            "TRUE ELSE FALSE END " +
            "FROM Student s " +
            "WHERE s.email = ?1"
    )
    Boolean selectExistsEmail(String email);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Student " +
            "SET name = ?2, " +
                "email = ?3, " +
                "gender = ?4 " +
            "WHERE id = ?1")
    void updateStudent(Long id, String name, String email, Gender gender);
}
