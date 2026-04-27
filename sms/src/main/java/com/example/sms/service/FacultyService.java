package com.example.sms.service;

import com.example.sms.entity.Faculty;
import com.example.sms.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository repo;

    public List<Faculty> getAllFaculty() {
        return repo.findAll();
    }

    public Optional<Faculty> getFacultyById(Long id) {
        return repo.findById(id);
    }

    public Faculty addFaculty(Faculty faculty) {
        if (faculty.getRole() == null || faculty.getRole().isEmpty()) {
            faculty.setRole("FACULTY");
        }
        if (faculty.getPassword() == null || faculty.getPassword().isEmpty()) {
            faculty.setPassword("faculty123");
        }
        return repo.save(faculty);
    }

    public Faculty updateFaculty(Long id, Faculty details) {
        Faculty f = repo.findById(id).orElseThrow(() -> new RuntimeException("Faculty not found"));
        f.setName(details.getName());
        f.setEmail(details.getEmail());
        f.setPhoneNumber(details.getPhoneNumber());
        f.setDepartment(details.getDepartment());
        // We don't update password here unless explicitly asked
        return repo.save(f);
    }

    public void deleteFaculty(Long id) {
        repo.deleteById(id);
    }
}
