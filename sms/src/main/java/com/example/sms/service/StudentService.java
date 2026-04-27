package com.example.sms.service;

import com.example.sms.entity.Student;
import com.example.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repo;

    public Optional<Student> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public Student addStudent(Student student) {
    if (student.getPassword() == null || student.getPassword().trim().isEmpty()) {
        student.setPassword("student123"); 
    }
    return repo.save(student);
}

    public List<Student> getAllStudents() {
        return repo.findAll();
    }

    public Student getStudentById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = repo.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));

        student.setName(studentDetails.getName());
        student.setRollNumber(studentDetails.getRollNumber());
        student.setEmail(studentDetails.getEmail());
        student.setPhoneNumber(studentDetails.getPhoneNumber());
        student.setDepartment(studentDetails.getDepartment());
        student.setAcademicYear(studentDetails.getAcademicYear());
        student.setAddress(studentDetails.getAddress());

        return repo.save(student);
    }

    public void deleteStudent(Long id) {
        repo.deleteById(id);
    }

    // 1. Limited Profile Update (For Students)
    public Student updateStudentProfile(Long id, Student profileUpdate) {
        Student student = repo.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Students can only change their contact details, not their Roll No or Dept
        student.setPhoneNumber(profileUpdate.getPhoneNumber());
        student.setAddress(profileUpdate.getAddress());
        student.setEmail(profileUpdate.getEmail());
        
        return repo.save(student);
    }

    // 2. Password Change Logic
    public void changePassword(Long id, String oldPassword, String newPassword) {
        Student student = repo.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Check if the old password provided matches what's in the DB
        if (student.getPassword().equals(oldPassword)) {
            student.setPassword(newPassword);
            repo.save(student);
        } else {
            throw new RuntimeException("Old password is incorrect!");
        }
    }
}