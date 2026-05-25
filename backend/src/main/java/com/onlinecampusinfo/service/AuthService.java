package com.onlinecampusinfo.service;

import com.onlinecampusinfo.dto.request.LoginRequest;
import com.onlinecampusinfo.dto.request.RegisterRequest;
import com.onlinecampusinfo.dto.response.AuthResponse;
import com.onlinecampusinfo.model.User;
import com.onlinecampusinfo.repository.UserRepository;
import com.onlinecampusinfo.security.CustomUserDetails;
import com.onlinecampusinfo.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .userId(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .role(userDetails.getRole())
                .build();
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .phone(registerRequest.getPhone())
                .build();

        User savedUser = userRepository.save(user);

        String jwt = jwtTokenProvider.generateTokenFromEmail(
                savedUser.getEmail(),
                savedUser.getId(),
                savedUser.getRole().name()
        );

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .userId(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}