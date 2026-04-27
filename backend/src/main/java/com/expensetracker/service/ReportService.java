package com.expensetracker.service;

import com.expensetracker.model.Transaction.TransactionType;
import com.expensetracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
public class ReportService {

    private final TransactionRepository repo;

    public ReportService(TransactionRepository repo) { this.repo = repo; }

    public Map<String, Object> getMonthlyReport(Long userId, int year) {
        List<Object[]> incomeRows  = repo.monthlyTotals(userId, TransactionType.INCOME,  year);
        List<Object[]> expenseRows = repo.monthlyTotals(userId, TransactionType.EXPENSE, year);

        BigDecimal[] income  = new BigDecimal[12];
        BigDecimal[] expense = new BigDecimal[12];
        Arrays.fill(income,  BigDecimal.ZERO);
        Arrays.fill(expense, BigDecimal.ZERO);

        for (Object[] r : incomeRows)  income[(int)  r[0] - 1] = (BigDecimal) r[1];
        for (Object[] r : expenseRows) expense[(int) r[0] - 1] = (BigDecimal) r[1];

        String[] months = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        List<Map<String, Object>> data = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            data.add(Map.of("month", months[i], "income", income[i], "expense", expense[i]));
        }
        return Map.of("year", year, "data", data);
    }
}
