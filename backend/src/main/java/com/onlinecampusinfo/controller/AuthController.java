package com.onlinecampusinfo.controller;

import com.onlinecampusinfo.dto.request.LoginRequest;
import com.onlinecampusinfo.dto.request.RegisterRequest;
import com.onlinecampusinfo.dto.response.AuthResponse;
import com.onlinecampusinfo.dto.response.MessageResponse;
import com.onlinecampusinfo.model.User;
import com.onlinecampusinfo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse response = authService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Invalid email or password"));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            User user = authService.getCurrentUser();
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("name", user.getName());
            profile.put("email", user.getEmail());
            profile.put("role", user.getRole());
            profile.put("phone", user.getPhone());
            profile.put("createdAt", user.getCreatedAt());
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Unable to fetch profile"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Online Campus Info System");
        return ResponseEntity.ok(response);
    }
}