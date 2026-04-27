package com.example.sms.controller;

import com.example.sms.entity.Student;
import com.example.sms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService service;

    @Autowired
    private com.example.sms.security.AuthService authService;

    @PostMapping("/login") 
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) { 
        try {
            String email = credentials.get("email") != null ? credentials.get("email").trim() : ""; 
            String password = credentials.get("password");
            
            Map<String, Object> response = authService.login(email, password);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping 
    public Student addStudent(@RequestBody Student student) { 
        return service.addStudent(student); 
    }

    @GetMapping 
    public List<Student> getAllStudents() { 
        return service.getAllStudents(); 
    }

    @GetMapping("/{id}") 
    public Student getStudentById(@PathVariable Long id) { 
        return service.getStudentById(id); 
    }

    @PutMapping("/{id}") 
    public Student updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) { 
        return service.updateStudent(id, studentDetails); 
    }

    @DeleteMapping("/{id}") 
    public void deleteStudent(@PathVariable Long id) { 
        service.deleteStudent(id); 
    }

    @GetMapping("/stats/count") 
    public ResponseEntity<?> getStudentCount() { 
        List<Student> students = service.getAllStudents(); 
        return ResponseEntity.ok(Map.of("total", students.size())); 
    }

    @PutMapping("/{id}/profile") 
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Student studentDetails) { 
        try { 
            Student updated = service.updateStudentProfile(id, studentDetails); 
            return ResponseEntity.ok(updated); 
        } catch (Exception e) { 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()); 
        } 
    }

    @PostMapping("/{id}/change-password") 
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwords) { 
        try { 
            String oldPassword = passwords.get("oldPassword"); 
            String newPassword = passwords.get("newPassword"); 
            service.changePassword(id, oldPassword, newPassword); 
            return ResponseEntity.ok(Map.of("message", "Password changed successfully!")); 
        } catch (Exception e) { 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()); 
        } 
    }
}