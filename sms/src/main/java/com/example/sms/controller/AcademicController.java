package com.example.sms.controller;

import com.example.sms.entity.Enrollment;
import com.example.sms.entity.Faculty;
import com.example.sms.entity.Student;
import com.example.sms.entity.Subject;
import com.example.sms.repository.EnrollmentRepository;
import com.example.sms.repository.FacultyRepository;
import com.example.sms.repository.StudentRepository;
import com.example.sms.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/academic")
public class AcademicController {

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/faculty/{email}")
    public ResponseEntity<?> getFacultyStudents(@PathVariable String email) {
        Optional<Faculty> facultyOpt = facultyRepository.findByEmail(email);
        if (!facultyOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Faculty not found");
        }

        Faculty faculty = facultyOpt.get();
        List<Subject> subjects = subjectRepository.findByFacultyId(faculty.getId());
        List<Long> subjectIds = subjects.stream().map(Subject::getId).collect(Collectors.toList());

        if (subjectIds.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        List<Enrollment> enrollments = enrollmentRepository.findBySubjectIdIn(subjectIds);
        
        List<Map<String, Object>> response = new ArrayList<>();
        for (Enrollment e : enrollments) {
            Map<String, Object> map = new HashMap<>();
            map.put("enrollmentId", e.getId());
            map.put("studentId", e.getStudentId());
            map.put("subjectId", e.getSubjectId());
            map.put("totalClasses", e.getTotalClasses());
            map.put("attendedClasses", e.getAttendedClasses());
            map.put("internalMarks", e.getInternalMarks());
            map.put("semesterMarks", e.getSemesterMarks());
            map.put("grade", e.getGrade());

            Optional<Student> sOpt = studentRepository.findById(e.getStudentId());
            if (sOpt.isPresent()) {
                map.put("studentName", sOpt.get().getName());
                map.put("studentRollNumber", sOpt.get().getRollNumber());
            }

            Optional<Subject> subOpt = subjectRepository.findById(e.getSubjectId());
            if (subOpt.isPresent()) {
                map.put("subjectName", subOpt.get().getSubjectName());
                map.put("subjectCode", subOpt.get().getSubjectCode());
            }

            response.add(map);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/update-performance")
    public ResponseEntity<?> updatePerformance(@RequestBody Map<String, Object> payload) {
        try {
            Long enrollmentId = Long.valueOf(payload.get("enrollmentId").toString());
            int attendedClasses = Integer.parseInt(payload.get("attendedClasses").toString());
            double internalMarks = Double.parseDouble(payload.get("internalMarks").toString());
            double semesterMarks = Double.parseDouble(payload.get("semesterMarks").toString());

            Optional<Enrollment> eOpt = enrollmentRepository.findById(enrollmentId);
            if (!eOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Enrollment not found");
            }

            Enrollment e = eOpt.get();

            // Server-side validation
            if (attendedClasses < 0 || attendedClasses > e.getTotalClasses()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Attended classes must be between 0 and " + e.getTotalClasses());
            }
            if (internalMarks < 0 || internalMarks > 30) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Internal marks must be between 0 and 30");
            }
            if (semesterMarks < 0 || semesterMarks > 70) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Semester marks must be between 0 and 70");
            }

            e.setAttendedClasses(attendedClasses);
            e.setInternalMarks(internalMarks);
            e.setSemesterMarks(semesterMarks);
            
            double total = internalMarks + semesterMarks;
            if (total >= 90) e.setGrade("O");
            else if (total >= 80) e.setGrade("A+");
            else if (total >= 70) e.setGrade("A");
            else if (total >= 60) e.setGrade("B+");
            else if (total >= 50) e.setGrade("B");
            else e.setGrade("F");

            enrollmentRepository.save(e);
            return ResponseEntity.ok(Map.of("message", "Performance updated successfully!"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating performance: " + ex.getMessage());
        }
    }

    @GetMapping("/student/{studentId}/enrollments")
    public ResponseEntity<?> getStudentEnrollments(@PathVariable Long studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        
        List<Map<String, Object>> response = new ArrayList<>();
        for (Enrollment e : enrollments) {
            Map<String, Object> map = new HashMap<>();
            map.put("enrollmentId", e.getId());
            map.put("studentId", e.getStudentId());
            map.put("subjectId", e.getSubjectId());
            map.put("totalClasses", e.getTotalClasses());
            map.put("attendedClasses", e.getAttendedClasses());
            map.put("internalMarks", e.getInternalMarks());
            map.put("semesterMarks", e.getSemesterMarks());
            map.put("grade", e.getGrade());
            
            double attendancePercentage = 0.0;
            if (e.getTotalClasses() > 0) {
                attendancePercentage = ((double) e.getAttendedClasses() / e.getTotalClasses()) * 100;
            }
            map.put("attendancePercentage", attendancePercentage);

            Optional<Subject> subOpt = subjectRepository.findById(e.getSubjectId());
            if (subOpt.isPresent()) {
                map.put("subjectName", subOpt.get().getSubjectName());
                map.put("subjectCode", subOpt.get().getSubjectCode());
                map.put("credits", subOpt.get().getCredits());
                map.put("semester", subOpt.get().getSemester());
            }

            response.add(map);
        }

        return ResponseEntity.ok(response);
    }
}
