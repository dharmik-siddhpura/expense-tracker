package com.expensetracker.service;

import com.expensetracker.dto.TransactionDTO;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Transaction;
import com.expensetracker.model.Transaction.TransactionType;
import com.expensetracker.model.User;
import com.expensetracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class TransactionService {

    private final TransactionRepository repo;

    public TransactionService(TransactionRepository repo) { this.repo = repo; }

    public List<Transaction> getFiltered(Long userId, TransactionType type, Integer month, Integer year) {
        return repo.findFiltered(userId, type, month, year);
    }

    public Transaction add(User user, TransactionDTO dto) {
        var t = new Transaction();
        t.setUser(user); t.setTitle(dto.getTitle()); t.setAmount(dto.getAmount());
        t.setType(dto.getType()); t.setCategory(dto.getCategory());
        t.setTxnDate(dto.getTxnDate()); t.setNotes(dto.getNotes());
        return repo.save(t);
    }

    public Transaction update(Long id, Long userId, TransactionDTO dto) {
        var t = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        if (!t.getUser().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        t.setTitle(dto.getTitle()); t.setAmount(dto.getAmount());
        t.setType(dto.getType()); t.setCategory(dto.getCategory());
        t.setTxnDate(dto.getTxnDate()); t.setNotes(dto.getNotes());
        return repo.save(t);
    }

    public void delete(Long id, Long userId) {
        var t = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        if (!t.getUser().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        repo.delete(t);
    }

    public Map<String, Object> getSummary(Long userId) {
        int month = LocalDate.now().getMonthValue();
        int year  = LocalDate.now().getYear();
        BigDecimal income  = repo.sumByTypeAndMonth(userId, TransactionType.INCOME,  month, year);
        BigDecimal expense = repo.sumByTypeAndMonth(userId, TransactionType.EXPENSE, month, year);
        BigDecimal balance = income.subtract(expense);
        double savings = income.compareTo(BigDecimal.ZERO) > 0
                ? balance.divide(income, 4, java.math.RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue()
                : 0.0;
        return Map.of("totalIncome", income, "totalExpense", expense,
                      "balance", balance, "savingsPercent", Math.round(savings * 10.0) / 10.0);
    }

    public List<Map<String, Object>> getByCategory(Long userId) {
        int month = LocalDate.now().getMonthValue();
        int year  = LocalDate.now().getYear();
        List<Object[]> rows = repo.sumByCategory(userId, month, year);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] r : rows) result.add(Map.of("category", r[0], "total", r[1]));
        return result;
    }

    public List<Transaction> getRecent(Long userId) {
        return repo.findTop5ByUserIdOrderByTxnDateDesc(userId);
    }

    public String exportCsv(Long userId) {
        List<Transaction> list = repo.findByUserIdOrderByTxnDateDesc(userId);
        StringBuilder sb = new StringBuilder("Title,Amount,Type,Category,Date,Notes\n");
        for (Transaction t : list) {
            sb.append(String.format("\"%s\",%s,%s,%s,%s,\"%s\"\n",
                    t.getTitle(), t.getAmount(), t.getType(),
                    t.getCategory(), t.getTxnDate(), t.getNotes() != null ? t.getNotes() : ""));
        }
        return sb.toString();
    }
}
