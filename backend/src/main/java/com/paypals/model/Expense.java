package com.paypals.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long groupId;
    private Long paidByUserId;
    private double amount;
    private String description;
    private LocalDateTime createdAt;
    private boolean equalSplit = true;

    public Expense() {
    }

    public Expense(Long id, Long groupId, Long paidByUserId, double amount, String description, LocalDateTime createdAt,
            boolean equalSplit) {
        this.id = id;
        this.groupId = groupId;
        this.paidByUserId = paidByUserId;
        this.amount = amount;
        this.description = description;
        this.createdAt = createdAt;
        this.equalSplit = equalSplit;
    }

    // GETTERS
    public Long getId() {
        return id;
    }

    public Long getGroupId() {
        return groupId;
    }

    public Long getPaidByUserId() {
        return paidByUserId;
    }

    public double getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public boolean isEqualSplit() {
        return equalSplit;
    }

    // SETTERS
    public void setId(Long id) {
        this.id = id;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public void setPaidByUserId(Long paidByUserId) {
        this.paidByUserId = paidByUserId;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setEqualSplit(boolean equalSplit) {
        this.equalSplit = equalSplit;
    }
}
