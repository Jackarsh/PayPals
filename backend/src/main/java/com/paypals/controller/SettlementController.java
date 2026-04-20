package com.paypals.controller;

import com.paypals.model.Expense;
import com.paypals.model.ExpenseShare;
import com.paypals.repository.ExpenseRepository;
import com.paypals.repository.ExpenseShareRepository;
import com.paypals.repository.UserRepository;
import com.paypals.repository.GroupRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/settle")
public class SettlementController {

    private final ExpenseRepository expenseRepo;
    private final ExpenseShareRepository shareRepo;
    private final UserRepository userRepo;
    private final GroupRepository groupRepo;

    public SettlementController(
            ExpenseRepository expenseRepo,
            ExpenseShareRepository shareRepo,
            UserRepository userRepo,
            GroupRepository groupRepo) {
        this.expenseRepo = expenseRepo;
        this.shareRepo = shareRepo;
        this.userRepo = userRepo;
        this.groupRepo = groupRepo;
    }

    @PostMapping
    public Map<String, String> settleUp(@RequestBody Map<String, String> body) {

        Long groupId = Long.parseLong(body.get("groupId"));
        Long payer = Long.parseLong(body.get("payer"));
        Long receiver = Long.parseLong(body.get("receiver"));
        double amount = Double.parseDouble(body.get("amount"));

        Expense e = new Expense();
        e.setGroupId(groupId);
        e.setPaidByUserId(payer);
        e.setAmount(amount);
        e.setDescription("Settlement: " + body.get("payerName") +
                " paid " + body.get("receiverName"));
        e.setCreatedAt(LocalDateTime.now());
        expenseRepo.save(e);

        ExpenseShare share = new ExpenseShare();
        share.setExpenseId(e.getId());
        share.setUserId(receiver);
        share.setShareAmount(amount);
        shareRepo.save(share);

        return Map.of("status", "success", "message", "Settlement saved");
    }
}
