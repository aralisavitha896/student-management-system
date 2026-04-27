package com.example.sms.controller;

import com.example.sms.entity.Enrollment;
import com.example.sms.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService service;

    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return service.getAllEnrollments();
    }

    @PostMapping
    public ResponseEntity<?> enrollStudent(@RequestBody Enrollment enrollment) {
        try {
            return ResponseEntity.ok(service.enrollStudent(enrollment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unenrollStudent(@PathVariable Long id) {
        service.unenrollStudent(id);
        return ResponseEntity.noContent().build();
    }
}