package com.example.sms.repository;

import com.example.sms.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    java.util.List<Enrollment> findBySubjectIdIn(java.util.List<Long> subjectIds);
    java.util.List<Enrollment> findByStudentId(Long studentId);
}