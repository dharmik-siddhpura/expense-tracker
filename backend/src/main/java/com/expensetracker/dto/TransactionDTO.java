package com.expensetracker.dto;

import com.expensetracker.model.Transaction.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionDTO {
    @NotBlank  private String          title;
    @NotNull @Positive private BigDecimal amount;
    @NotNull   private TransactionType type;
    @NotBlank  private String          category;
    @NotNull   private LocalDate       txnDate;
               private String          notes;

    public String getTitle()           { return title; }
    public BigDecimal getAmount()      { return amount; }
    public TransactionType getType()   { return type; }
    public String getCategory()        { return category; }
    public LocalDate getTxnDate()      { return txnDate; }
    public String getNotes()           { return notes; }

    public void setTitle(String t)           { this.title = t; }
    public void setAmount(BigDecimal a)      { this.amount = a; }
    public void setType(TransactionType t)   { this.type = t; }
    public void setCategory(String c)        { this.category = c; }
    public void setTxnDate(LocalDate d)      { this.txnDate = d; }
    public void setNotes(String n)           { this.notes = n; }
}
