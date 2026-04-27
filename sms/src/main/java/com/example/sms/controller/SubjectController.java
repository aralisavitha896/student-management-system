package com.example.sms.controller;

import com.example.sms.entity.Subject;
import com.example.sms.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List; // This fixes the 'cannot find symbol: class List'

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired 
    private SubjectRepository repository;

    @GetMapping
    public List<Subject> getAll() { 
        return repository.findAll(); 
    }

    @PostMapping
    public Subject add(@RequestBody Subject subject) { 
        return repository.save(subject); 
    }

    @PutMapping("/{subjectId}/assign-faculty/{facultyId}")
    public org.springframework.http.ResponseEntity<?> assignFaculty(@PathVariable Long subjectId, @PathVariable Long facultyId) {
        java.util.Optional<Subject> subjectOpt = repository.findById(subjectId);
        if (!subjectOpt.isPresent()) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).body("Subject not found");
        }
        Subject subject = subjectOpt.get();
        subject.setFacultyId(facultyId);
        repository.save(subject);
        return org.springframework.http.ResponseEntity.ok(subject);
    }
}