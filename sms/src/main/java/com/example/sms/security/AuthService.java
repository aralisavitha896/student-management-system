package com.example.sms.security;

import com.example.sms.entity.Faculty;
import com.example.sms.entity.RefreshToken;
import com.example.sms.entity.Student;
import com.example.sms.repository.FacultyRepository;
import com.example.sms.repository.RefreshTokenRepository;
import com.example.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, Object> login(String email, String password) {
        // 1. Admin check (hardcoded for now as per original logic)
        if ("admin@sms.com".equalsIgnoreCase(email) && "admin123".equals(password)) {
            return createTokenResponse(email, "ADMIN", "System Admin", null);
        }

        // 2. Student check
        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isPresent()) {
            Student s = studentOpt.get();
            // Checking plain text if it matches, but recommending BCrypt
            if (password.equals(s.getPassword()) || (s.getPassword() != null && passwordEncoder.matches(password, s.getPassword()))) {
                return createTokenResponse(s.getEmail(), s.getRole() != null ? s.getRole() : "STUDENT", s.getName(), s.getId());
            }
        }

        // 3. Faculty check
        Optional<Faculty> facultyOpt = facultyRepository.findByEmail(email);
        if (facultyOpt.isPresent()) {
            Faculty f = facultyOpt.get();
            if (password.equals(f.getPassword()) || (f.getPassword() != null && passwordEncoder.matches(password, f.getPassword()))) {
                return createTokenResponse(f.getEmail(), f.getRole() != null ? f.getRole() : "FACULTY", f.getName(), f.getId());
            }
        }

        throw new RuntimeException("Invalid email or password");
    }

    private Map<String, Object> createTokenResponse(String email, String role, String name, Long id) {
        String accessToken = jwtUtil.generateAccessToken(email, role);
        String refreshToken = createRefreshToken(email).getToken();

        return Map.of(
            "accessToken", accessToken,
            "refreshToken", refreshToken,
            "role", role,
            "name", name,
            "id", id != null ? id : 0,
            "email", email
        );
    }

    public RefreshToken createRefreshToken(String email) {
        refreshTokenRepository.deleteByUserEmail(email); // Clear old tokens

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserEmail(email);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(604800000)); // 7 days

        return refreshTokenRepository.save(refreshToken);
    }

    public Map<String, String> refreshAccessToken(String refreshTokenRequest) {
        return refreshTokenRepository.findByToken(refreshTokenRequest)
                .map(this::verifyExpiration)
                .map(token -> {
                    // We need the role. For simplicity, we check student then faculty
                    String role = "STUDENT";
                    Optional<Student> s = studentRepository.findByEmail(token.getUserEmail());
                    if (s.isPresent()) role = s.get().getRole();
                    else {
                        Optional<Faculty> f = facultyRepository.findByEmail(token.getUserEmail());
                        if (f.isPresent()) role = f.get().getRole();
                        else if (token.getUserEmail().equals("admin@sms.com")) role = "ADMIN";
                    }

                    String accessToken = jwtUtil.generateAccessToken(token.getUserEmail(), role);
                    return Map.of("accessToken", accessToken, "refreshToken", token.getToken());
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public void logout(String email) {
        refreshTokenRepository.deleteByUserEmail(email);
    }
}
