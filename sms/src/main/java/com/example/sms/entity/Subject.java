package com.yourname.sms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "subjects")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subjectCode; // e.g., CS401
    private String subjectName; // e.g., Database Management
    private int semester;
    private int credits;

    // Links the subject to a Faculty member
    private String assignedFacultyEmail; 
}