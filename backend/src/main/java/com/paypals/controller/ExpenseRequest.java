package com.paypals.controller;

import java.util.List;

public class ExpenseRequest {
    private Long groupId;
    private Long paidByUserId;
    private double amount;
    private String description;
    private List<ShareItem> shares;

    public static class ShareItem {
        private Long userId;
        private double amount;

        public ShareItem() {
        }

        public ShareItem(Long userId, double amount) {
            this.userId = userId;
            this.amount = amount;
        }

        public Long getUserId() {
            return userId;
        }

        public double getAmount() {
            return amount;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }
    }

    public ExpenseRequest() {
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

    public List<ShareItem> getShares() {
        return shares;
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

    public void setShares(List<ShareItem> shares) {
        this.shares = shares;
    }
}
