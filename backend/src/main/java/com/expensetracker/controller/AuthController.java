package com.expensetracker.controller;

import com.expensetracker.dto.*;
import com.expensetracker.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String,Object>>> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(authService.register(req)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String,Object>>> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(authService.login(req)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Object>> me(@AuthenticationPrincipal UserDetails ud) {
        var user = authService.getCurrentUser(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(
            Map.of("id", user.getId(), "name", user.getName(),
                   "email", user.getEmail(), "currency", user.getCurrency(),
                   "createdAt", user.getCreatedAt())));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Object>> update(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody Map<String, String> body) {
        var user = authService.updateProfile(ud.getUsername(), body.get("name"), body.get("currency"));
        return ResponseEntity.ok(ApiResponse.ok("Profile updated",
            Map.of("name", user.getName(), "currency", user.getCurrency())));
    }
}
