package com.example.sms.controller;

import com.example.sms.entity.Enrollment;
import com.example.sms.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository repository;

    @PostMapping
    public Enrollment enrollStudent(@RequestBody Enrollment enrollment) {
        // This saves the studentId and subjectId link to the database
        return repository.save(enrollment);
    }
}