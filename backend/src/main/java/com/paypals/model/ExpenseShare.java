package com.paypals.model;

import jakarta.persistence.*;

@Entity
@Table(name = "expense_shares")
public class ExpenseShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long expenseId;
    private Long userId;
    private double shareAmount;

    public ExpenseShare() {
    }

    public ExpenseShare(Long expenseId, Long userId, double shareAmount) {
        this.expenseId = expenseId;
        this.userId = userId;
        this.shareAmount = shareAmount;
    }

    public Long getId() {
        return id;
    }

    public Long getExpenseId() {
        return expenseId;
    }

    public Long getUserId() {
        return userId;
    }

    public double getShareAmount() {
        return shareAmount;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setExpenseId(Long expenseId) {
        this.expenseId = expenseId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setShareAmount(double shareAmount) {
        this.shareAmount = shareAmount;
    }
}
