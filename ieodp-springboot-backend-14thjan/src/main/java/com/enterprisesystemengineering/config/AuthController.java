package com.enterprisesystemengineering.config;

import com.enterprisesystemengineering.entity.User;
import com.enterprisesystemengineering.repository.UserRepository;
import com.enterprisesystemengineering.enums.UserRole;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(JwtUtil jwtUtil,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * POST /api/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        // Hardcoded admin (demo)
        if ("admin@gmail.com".equals(request.getEmail())
                && "admin123".equals(request.getPassword())) {

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
     * POST /api/register
     */
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {

        // basic safety
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // default role
        user.setRole(UserRole.USER);

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    /**
     * POST /api/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}
