package com.enterprisesystemengineering.controller;

import com.enterprisesystemengineering.dto.LoginResponseDto;
import com.enterprisesystemengineering.dto.RegisterUserDto;
import com.enterprisesystemengineering.entity.User;
import com.enterprisesystemengineering.repository.UserRepository;
import com.enterprisesystemengineering.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://43.205.133.117:3000"})
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // Login endpoint - matches frontend expectation
    @GetMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElse(null);

            if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password");
            }

            String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().toString());
            LoginResponseDto response = new LoginResponseDto(user, token);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterUserDto registerDto) {
        try {
            if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Email already registered");
            }

            if (userRepository.findByUsername(registerDto.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Username already taken");
            }

            User user = new User();
            user.setFirstName(registerDto.getFirstName());
            user.setLastName(registerDto.getLastName());
            user.setUsername(registerDto.getUsername());
            user.setEmail(registerDto.getEmail());
            user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
            user.setMobileNumber(registerDto.getMobileNumber());
            user.setGender(registerDto.getGender());
            user.setDepartment(registerDto.getDepartment());

            User savedUser = userRepository.save(user);
            String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole().toString());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new LoginResponseDto(savedUser, token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    // Get all users - ADMIN only
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch users: " + e.getMessage());
        }
    }

    // Logout endpoint
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Logged out successfully");
    }
}