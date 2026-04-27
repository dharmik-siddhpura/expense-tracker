package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final AuthService   authService;

    public ReportController(ReportService reportService, AuthService authService) {
        this.reportService = reportService; this.authService = authService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<?>> monthly(@AuthenticationPrincipal UserDetails ud,
            @RequestParam(defaultValue = "0") int year) {
        var user = authService.getCurrentUser(ud.getUsername());
        if (year == 0) year = LocalDate.now().getYear();
        return ResponseEntity.ok(ApiResponse.ok(reportService.getMonthlyReport(user.getId(), year)));
    }
}
