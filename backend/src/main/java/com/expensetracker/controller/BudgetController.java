package com.expensetracker.controller;

import com.expensetracker.dto.*;
import com.expensetracker.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;
    private final AuthService   authService;

    public BudgetController(BudgetService budgetService, AuthService authService) {
        this.budgetService = budgetService; this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> list(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok(budgetService.getBudgets(authService.getCurrentUser(ud.getUsername()).getId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> set(@AuthenticationPrincipal UserDetails ud, @Valid @RequestBody BudgetDTO dto) {
        var user = authService.getCurrentUser(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(budgetService.setBudget(user, dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> update(@AuthenticationPrincipal UserDetails ud,
            @PathVariable Long id, @Valid @RequestBody BudgetDTO dto) {
        var user = authService.getCurrentUser(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(budgetService.update(id, user.getId(), dto)));
    }
}
