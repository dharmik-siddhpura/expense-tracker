package com.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class BudgetDTO {
    @NotBlank  private String     category;
    @NotNull @Positive private BigDecimal budgetLimit;
    @NotNull   private Integer    month;
    @NotNull   private Integer    year;

    public String getCategory()        { return category; }
    public BigDecimal getBudgetLimit() { return budgetLimit; }
    public Integer getMonth()          { return month; }
    public Integer getYear()           { return year; }

    public void setCategory(String c)        { this.category = c; }
    public void setBudgetLimit(BigDecimal l) { this.budgetLimit = l; }
    public void setMonth(Integer m)          { this.month = m; }
    public void setYear(Integer y)           { this.year = y; }
}
