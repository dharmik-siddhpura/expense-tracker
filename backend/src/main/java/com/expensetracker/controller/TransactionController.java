package com.expensetracker.controller;

import com.expensetracker.dto.*;
import com.expensetracker.model.Transaction.TransactionType;
import com.expensetracker.service.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService service;
    private final AuthService        authService;

    public TransactionController(TransactionService service, AuthService authService) {
        this.service = service; this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> list(@AuthenticationPrincipal UserDetails ud,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        var user = authService.getCurrentUser(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(service.getFiltered(user.getId(), type, month, year)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> add(@AuthenticationPrincipal UserDetails ud,
            @Valid @RequestBody TransactionDTO dto) {
        var user = authService.getCurrentUser(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(service.add(user, dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> update(@AuthenticationPrincipal UserDetails ud,
            @PathVariable Long id, @Valid @RequestBody TransactionDTO dto) {
        var user = authService.getCurrentUser(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, user.getId(), dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> delete(@AuthenticationPrincipal UserDetails ud, @PathVariable Long id) {
        var user = authService.getCurrentUser(ud.getUsername());
        service.delete(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Deleted", null));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<?>> summary(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok(service.getSummary(authService.getCurrentUser(ud.getUsername()).getId())));
    }

    @GetMapping("/by-category")
    public ResponseEntity<ApiResponse<?>> byCategory(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok(service.getByCategory(authService.getCurrentUser(ud.getUsername()).getId())));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<?>> recent(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok(service.getRecent(authService.getCurrentUser(ud.getUsername()).getId())));
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv(@AuthenticationPrincipal UserDetails ud) {
        String csv = service.exportCsv(authService.getCurrentUser(ud.getUsername()).getId());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.getBytes());
    }
}
