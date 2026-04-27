package com.expensetracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank                   private String name;
    @Email @NotBlank            private String email;
    @NotBlank @Size(min = 6)    private String password;
    private String currency = "INR";

    public String getName()     { return name; }
    public String getEmail()    { return email; }
    public String getPassword() { return password; }
    public String getCurrency() { return currency; }
    public void setName(String n)     { this.name = n; }
    public void setEmail(String e)    { this.email = e; }
    public void setPassword(String p) { this.password = p; }
    public void setCurrency(String c) { this.currency = c; }
}
