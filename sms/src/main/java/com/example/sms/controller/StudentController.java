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

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RestController
@RequestMapping("/api/students")
public class StudentController {
    
    @Autowired
    private StudentService service;

    // --- ADD THE LOGIN METHOD HERE (Before your other endpoints) ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        System.out.println("Login Attempt: Email=" + email + " Password=" + password);

        // 1. Hardcoded Admin Check
        if ("admin@sms.com".equals(email) && "admin123".equals(password)) {
            return ResponseEntity.ok(Map.of(
                "role", "ADMIN", 
                "name", "System Admin"
            ));
        }

        // 2. Database Student Check
        List<Student> allStudents = service.getAllStudents();
        Optional<Student> student = allStudents.stream()
                .filter(s -> s.getEmail().equals(email) && s.getPassword() != null && s.getPassword().equals(password))
                .findFirst();

        if (student.isPresent()) {
            Student s = student.get();
            return ResponseEntity.ok(Map.of(
                "role", "STUDENT", 
                "id", s.getId(),
                "name", s.getName()
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
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
    // 1. Endpoint for Students to update their own profile (limited fields)
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Student studentDetails) {
        try {
            Student updated = service.updateStudentProfile(id, studentDetails);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 2. Endpoint to handle password changes
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