package com.expensetracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;

    @Email @NotBlank
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Column(length = 10)
    private String currency = "INR";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public Long getId()                    { return id; }
    public String getName()                { return name; }
    public String getEmail()               { return email; }
    public String getPassword()            { return password; }
    public String getCurrency()            { return currency; }
    public LocalDateTime getCreatedAt()    { return createdAt; }

    public void setId(Long id)             { this.id = id; }
    public void setName(String name)       { this.name = name; }
    public void setEmail(String email)     { this.email = email; }
    public void setPassword(String pw)     { this.password = pw; }
    public void setCurrency(String c)      { this.currency = c; }
    public void setCreatedAt(LocalDateTime t) { this.createdAt = t; }
}
