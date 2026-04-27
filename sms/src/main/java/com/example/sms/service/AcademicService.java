package com.example.sms.service;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AcademicService {

    // 1. Calculate Attendance Percentage
    public double calculateAttendance(int attendedClasses, int totalClasses) {
        if (totalClasses <= 0) return 0.0;
        return ((double) attendedClasses / totalClasses) * 100;
    }

    // 2. Calculate CGPA from a list of marks/grades
    public double calculateCGPA(List<Double> grades) {
        if (grades.isEmpty()) return 0.0;
        double sum = 0;
        for (Double grade : grades) {
            sum += grade;
        }
        return sum / grades.size();
    }

    // 3. Logic for Grade mapping
    public String getGradeLetter(double marks) {
        if (marks >= 90) return "O (Outstanding)";
        if (marks >= 80) return "A+";
        if (marks >= 70) return "A";
        if (marks >= 60) return "B";
        return "F (Fail)";
    }
}