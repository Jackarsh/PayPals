package com.paypals.controller;

import com.paypals.model.Expense;
import com.paypals.model.ExpenseShare;
import com.paypals.model.User;
import com.paypals.repository.ExpenseRepository;
import com.paypals.repository.ExpenseShareRepository;
import com.paypals.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final ExpenseShareRepository expenseShareRepository;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseRepository expenseRepository,
            ExpenseShareRepository expenseShareRepository,
            UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.expenseShareRepository = expenseShareRepository;
        this.userRepository = userRepository;
    }

    // Create expense with shares
    @PostMapping
    public ResponseEntity<?> addExpense(@RequestBody ExpenseRequest req) {
        if (req.getGroupId() == null || req.getPaidByUserId() == null || req.getAmount() <= 0) {
            return ResponseEntity.badRequest().body("Invalid expense payload");
        }

        Expense expense = new Expense();
        expense.setGroupId(req.getGroupId());
        expense.setPaidByUserId(req.getPaidByUserId());
        expense.setAmount(req.getAmount());
        expense.setDescription(req.getDescription());
        expense.setCreatedAt(LocalDateTime.now());
        expense.setEqualSplit(false);
        Expense saved = expenseRepository.save(expense);

        // save shares
        if (req.getShares() != null) {
            for (ExpenseRequest.ShareItem s : req.getShares()) {
                ExpenseShare share = new ExpenseShare();
                share.setExpenseId(saved.getId());
                share.setUserId(s.getUserId());
                share.setShareAmount(s.getAmount());
                expenseShareRepository.save(share);
            }
        }

        // return enriched expense info
        Map<String, Object> resp = new HashMap<>();
        resp.put("expense", saved);
        List<Map<String, Object>> shareList = new ArrayList<>();
        expenseShareRepository.findByExpenseId(saved.getId()).forEach(sh -> {
            Map<String, Object> m = new HashMap<>();
            m.put("userId", sh.getUserId());
            m.put("amount", sh.getShareAmount());
            userRepository.findById(sh.getUserId()).ifPresent(u -> m.put("userName", u.getName()));
            shareList.add(m);
        });
        resp.put("shares", shareList);

        return ResponseEntity.ok(resp);
    }

    // Return enriched list (each expense + shares + payer name)
    @GetMapping
    public List<Map<String, Object>> all() {
        List<Expense> expenses = expenseRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Expense e : expenses) {
            Map<String, Object> x = new HashMap<>();
            x.put("id", e.getId());
            x.put("groupId", e.getGroupId());
            x.put("paidByUserId", e.getPaidByUserId());
            x.put("amount", e.getAmount());
            x.put("description", e.getDescription());
            x.put("createdAt", e.getCreatedAt());

            userRepository.findById(e.getPaidByUserId()).ifPresent(u -> x.put("paidByUserName", u.getName()));

            List<Map<String, Object>> shares = new ArrayList<>();
            expenseShareRepository.findByExpenseId(e.getId()).forEach(sh -> {
                Map<String, Object> sm = new HashMap<>();
                sm.put("userId", sh.getUserId());
                sm.put("amount", sh.getShareAmount());
                userRepository.findById(sh.getUserId()).ifPresent(u -> sm.put("userName", u.getName()));
                shares.add(sm);
            });
            x.put("shares", shares);
            result.add(x);
        }
        return result;
    }

    // expenses by group (enriched)
    @GetMapping("/group/{groupId}")
    public List<Map<String, Object>> byGroup(@PathVariable Long groupId) {
        List<Map<String, Object>> result = new ArrayList<>();
        List<Expense> list = expenseRepository.findByGroupId(groupId);
        for (Expense e : list) {
            Map<String, Object> x = new HashMap<>();
            x.put("id", e.getId());
            x.put("groupId", e.getGroupId());
            x.put("paidByUserId", e.getPaidByUserId());
            x.put("amount", e.getAmount());
            x.put("description", e.getDescription());
            x.put("createdAt", e.getCreatedAt());
            userRepository.findById(e.getPaidByUserId()).ifPresent(u -> x.put("paidByUserName", u.getName()));

            List<Map<String, Object>> shares = new ArrayList<>();
            expenseShareRepository.findByExpenseId(e.getId()).forEach(sh -> {
                Map<String, Object> sm = new HashMap<>();
                sm.put("userId", sh.getUserId());
                sm.put("amount", sh.getShareAmount());
                userRepository.findById(sh.getUserId()).ifPresent(u -> sm.put("userName", u.getName()));
                shares.add(sm);
            });
            x.put("shares", shares);
            result.add(x);
        }
        return result;
    }

}
