package com.expensetracker.service;

import com.expensetracker.dto.BudgetDTO;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.*;
import com.expensetracker.model.Transaction.TransactionType;
import com.expensetracker.repository.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class BudgetService {

    private final BudgetRepository      budgetRepo;
    private final TransactionRepository txRepo;

    public BudgetService(BudgetRepository budgetRepo, TransactionRepository txRepo) {
        this.budgetRepo = budgetRepo;
        this.txRepo = txRepo;
    }

    public List<Map<String, Object>> getBudgets(Long userId) {
        int month = LocalDate.now().getMonthValue();
        int year  = LocalDate.now().getYear();
        List<Budget> budgets = budgetRepo.findByUserIdAndMonthAndYear(userId, month, year);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Budget b : budgets) {
            List<Object[]> catRows = txRepo.sumByCategory(userId, month, year);
            BigDecimal catSpent = catRows.stream()
                    .filter(r -> b.getCategory().equals(r[0]))
                    .map(r -> (BigDecimal) r[1])
                    .findFirst().orElse(BigDecimal.ZERO);
            double pct = b.getBudgetLimit().compareTo(BigDecimal.ZERO) > 0
                    ? catSpent.divide(b.getBudgetLimit(), 4, java.math.RoundingMode.HALF_UP)
                              .multiply(BigDecimal.valueOf(100)).doubleValue()
                    : 0.0;
            result.add(Map.of("id", b.getId(), "category", b.getCategory(),
                    "budgetLimit", b.getBudgetLimit(), "spent", catSpent,
                    "percentage", Math.round(pct * 10.0) / 10.0,
                    "month", b.getMonth(), "year", b.getYear()));
        }
        return result;
    }

    public Budget setBudget(User user, BudgetDTO dto) {
        var existing = budgetRepo.findByUserIdAndCategoryAndMonthAndYear(
                user.getId(), dto.getCategory(), dto.getMonth(), dto.getYear());
        Budget budget = existing.orElse(new Budget());
        budget.setUser(user); budget.setCategory(dto.getCategory());
        budget.setBudgetLimit(dto.getBudgetLimit());
        budget.setMonth(dto.getMonth()); budget.setYear(dto.getYear());
        return budgetRepo.save(budget);
    }

    public Budget update(Long id, Long userId, BudgetDTO dto) {
        Budget b = budgetRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        if (!b.getUser().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        b.setBudgetLimit(dto.getBudgetLimit());
        return budgetRepo.save(b);
    }
}
