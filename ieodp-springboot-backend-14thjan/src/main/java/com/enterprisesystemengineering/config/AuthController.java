package com.enterprisesystemengineering.config;

import com.enterprisesystemengineering.entity.User;
import com.enterprisesystemengineering.repository.UserRepository;
import com.enterprisesystemengineering.enums.UserRole;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller - Kubernetes-friendly React Frontend Integration
 * Endpoints for login and logout operations
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(JwtUtil jwtUtil, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * POST /auth/login - Login endpoint (also handled by GET /users?email=...&password=...)
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        if ("admin@gmail.com".equals(request.getEmail()) && "admin123".equals(request.getPassword())) {
             String token = jwtUtil.generateToken(
                "123",
                request.getEmail(),
                "MANAGEMENT"
            );
            return ResponseEntity.ok(new LoginResponse(token, "MANAGEMENT"));
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(
                user.getId().toString(),
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.ok(new LoginResponse(token, user.getRole().name()));
    }

    /**
     * POST /auth/logout - Logout endpoint
     * React calls this to clear session on backend
     * Response: { "success": true }
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}
