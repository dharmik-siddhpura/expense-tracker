package com.expensetracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String title;

    @NotNull @Positive
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String category;

    @NotNull
    @Column(name = "txn_date", nullable = false)
    private LocalDate txnDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TransactionType { INCOME, EXPENSE }

    public Transaction() {}

    public Long getId()                  { return id; }
    public User getUser()                { return user; }
    public String getTitle()             { return title; }
    public BigDecimal getAmount()        { return amount; }
    public TransactionType getType()     { return type; }
    public String getCategory()          { return category; }
    public LocalDate getTxnDate()        { return txnDate; }
    public String getNotes()             { return notes; }
    public LocalDateTime getCreatedAt()  { return createdAt; }

    public void setId(Long id)                     { this.id = id; }
    public void setUser(User user)                 { this.user = user; }
    public void setTitle(String title)             { this.title = title; }
    public void setAmount(BigDecimal amount)       { this.amount = amount; }
    public void setType(TransactionType type)      { this.type = type; }
    public void setCategory(String category)       { this.category = category; }
    public void setTxnDate(LocalDate txnDate)      { this.txnDate = txnDate; }
    public void setNotes(String notes)             { this.notes = notes; }
    public void setCreatedAt(LocalDateTime t)      { this.createdAt = t; }
}
