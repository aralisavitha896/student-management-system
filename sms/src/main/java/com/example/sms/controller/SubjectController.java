package com.example.sms.controller;

import com.example.sms.entity.Subject;
import com.example.sms.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List; // This fixes the 'cannot find symbol: class List'

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "http://localhost:3000")
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
}