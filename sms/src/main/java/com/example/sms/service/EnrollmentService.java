package com.example.sms.service;

import com.example.sms.entity.Enrollment;
import com.example.sms.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository repo;

    public List<Enrollment> getAllEnrollments() {
        return repo.findAll();
    }

    public Enrollment enrollStudent(Enrollment enrollment) {
        // Check if student is already enrolled in this subject
        Optional<Enrollment> existing = repo.findAll().stream()
            .filter(e -> e.getStudentId().equals(enrollment.getStudentId()) && 
                         e.getSubjectId().equals(enrollment.getSubjectId()))
            .findFirst();
            
        if (existing.isPresent()) {
            throw new RuntimeException("Student is already enrolled in this subject!");
        }
        
        return repo.save(enrollment);
    }

    public void unenrollStudent(Long id) {
        repo.deleteById(id);
    }
}
