package com.expensetracker;

import com.expensetracker.model.Transaction;
import com.expensetracker.model.Transaction.TransactionType;
import com.expensetracker.model.User;
import com.expensetracker.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.security.Security;
import java.time.LocalDate;

@SpringBootApplication
public class ExpenseTrackerApplication {

    public static void main(String[] args) {
        // SQL Server on this machine only supports TLS 1.0; Java 25 disables it by default
        Security.setProperty("jdk.tls.disabledAlgorithms",
                "SSLv3, RC4, DES, MD5withRSA, 3DES_EDE_CBC, anon, NULL");
        SpringApplication.run(ExpenseTrackerApplication.class, args);
    }

    @Bean
    CommandLineRunner seeder(UserRepository userRepo,
                             TransactionRepository txRepo,
                             PasswordEncoder encoder) {
        return args -> {
            if (userRepo.existsByEmail("demo@expense.com")) return;

            // Create demo user
            User user = new User();
            user.setName("Dharmik Siddhpura");
            user.setEmail("demo@expense.com");
            user.setPassword(encoder.encode("demo1234"));
            user.setCurrency("INR");
            userRepo.save(user);

            // Seed 20 sample transactions
            Object[][] data = {
                {"Salary",            new BigDecimal("45000"), TransactionType.INCOME,  "Salary",        -1},
                {"Freelance Project", new BigDecimal("12000"), TransactionType.INCOME,  "Freelance",     -5},
                {"Grocery Shopping",  new BigDecimal("2800"),  TransactionType.EXPENSE, "Food",          -2},
                {"Restaurant Dinner", new BigDecimal("1200"),  TransactionType.EXPENSE, "Food",          -4},
                {"Uber Ride",         new BigDecimal("350"),   TransactionType.EXPENSE, "Transport",     -1},
                {"Monthly Bus Pass",  new BigDecimal("800"),   TransactionType.EXPENSE, "Transport",     -3},
                {"Netflix",           new BigDecimal("649"),   TransactionType.EXPENSE, "Entertainment", -5},
                {"Movie Tickets",     new BigDecimal("500"),   TransactionType.EXPENSE, "Entertainment", -7},
                {"Amazon Shopping",   new BigDecimal("3200"),  TransactionType.EXPENSE, "Shopping",      -6},
                {"Electricity Bill",  new BigDecimal("1500"),  TransactionType.EXPENSE, "Bills",         -8},
                {"Internet Bill",     new BigDecimal("999"),   TransactionType.EXPENSE, "Bills",         -8},
                {"Doctor Visit",      new BigDecimal("600"),   TransactionType.EXPENSE, "Health",       -10},
                {"Pharmacy",          new BigDecimal("450"),   TransactionType.EXPENSE, "Health",        -9},
                {"Online Course",     new BigDecimal("2999"),  TransactionType.EXPENSE, "Education",    -12},
                {"Books",             new BigDecimal("750"),   TransactionType.EXPENSE, "Education",    -14},
                {"Part-time Income",  new BigDecimal("8000"),  TransactionType.INCOME,  "Freelance",    -15},
                {"Zomato Order",      new BigDecimal("550"),   TransactionType.EXPENSE, "Food",         -11},
                {"Clothing",          new BigDecimal("1800"),  TransactionType.EXPENSE, "Shopping",     -16},
                {"Gym Membership",    new BigDecimal("1200"),  TransactionType.EXPENSE, "Health",       -20},
                {"Other Income",      new BigDecimal("5000"),  TransactionType.INCOME,  "Other",        -18},
            };

            for (Object[] row : data) {
                Transaction t = new Transaction();
                t.setUser(user);
                t.setTitle((String) row[0]);
                t.setAmount((BigDecimal) row[1]);
                t.setType((TransactionType) row[2]);
                t.setCategory((String) row[3]);
                t.setTxnDate(LocalDate.now().plusDays((int) row[4]));
                txRepo.save(t);
            }
            System.out.println("✅ Demo user seeded — email: demo@expense.com | password: demo1234");
        };
    }
}
