package com.expensetracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@Entity
@Table(name = "budgets",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","category","month","year"}))
public class Budget {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String category;

    @NotNull @Positive
    @Column(name = "budget_limit", nullable = false, precision = 12, scale = 2)
    private BigDecimal budgetLimit;

    @NotNull @Column(nullable = false) private Integer month;
    @NotNull @Column(nullable = false) private Integer year;

    public Budget() {}

    public Long getId()              { return id; }
    public User getUser()            { return user; }
    public String getCategory()      { return category; }
    public BigDecimal getBudgetLimit(){ return budgetLimit; }
    public Integer getMonth()        { return month; }
    public Integer getYear()         { return year; }

    public void setId(Long id)                 { this.id = id; }
    public void setUser(User user)             { this.user = user; }
    public void setCategory(String c)          { this.category = c; }
    public void setBudgetLimit(BigDecimal l)   { this.budgetLimit = l; }
    public void setMonth(Integer m)            { this.month = m; }
    public void setYear(Integer y)             { this.year = y; }
}
