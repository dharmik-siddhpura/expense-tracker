package com.expensetracker.service;

import com.expensetracker.dto.*;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil         jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered");
        var user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setCurrency(req.getCurrency() != null ? req.getCurrency() : "INR");
        userRepository.save(user);
        return Map.of("token", jwtUtil.generateToken(user.getEmail()), "user", safeUser(user));
    }

    public Map<String, Object> login(LoginRequest req) {
        var user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");
        return Map.of("token", jwtUtil.generateToken(user.getEmail()), "user", safeUser(user));
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String email, String name, String currency) {
        var user = getCurrentUser(email);
        user.setName(name);
        user.setCurrency(currency);
        return userRepository.save(user);
    }

    private Map<String, Object> safeUser(User u) {
        return Map.of("id", u.getId(), "name", u.getName(),
                      "email", u.getEmail(), "currency", u.getCurrency());
    }
}
