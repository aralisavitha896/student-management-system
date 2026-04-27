package com.example.sms.repository;

import com.example.sms.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    java.util.List<Subject> findByFacultyId(Long facultyId);
}