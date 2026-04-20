package com.paypals.service;

import com.paypals.model.Expense;
import com.paypals.model.Group;
import com.paypals.model.ExpenseShare;
import com.paypals.repository.ExpenseRepository;
import com.paypals.repository.ExpenseShareRepository;
import com.paypals.repository.GroupRepository;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BalanceService {

    private final GroupRepository groupRepository;
    private final ExpenseRepository expenseRepository;
    private final ExpenseShareRepository expenseShareRepository;

    public BalanceService(GroupRepository groupRepository,
            ExpenseRepository expenseRepository,
            ExpenseShareRepository expenseShareRepository) {
        this.groupRepository = groupRepository;
        this.expenseRepository = expenseRepository;
        this.expenseShareRepository = expenseShareRepository;
    }

    // returns map userId -> balance (positive means others owe them; negative means
    // they owe)
    public Map<Long, Double> computeGroupBalances(Long groupId) {
        Optional<Group> opt = groupRepository.findById(groupId);
        if (opt.isEmpty())
            return Collections.emptyMap();
        Group group = opt.get();
        List<Long> members = group.getMemberIds();
        if (members == null || members.isEmpty())
            return Collections.emptyMap();

        Map<Long, Double> balance = new HashMap<>();
        for (Long m : members)
            balance.put(m, 0.0);

        List<Expense> expenses = expenseRepository.findByGroupId(groupId);
        for (Expense e : expenses) {
            Long payer = e.getPaidByUserId();
            List<ExpenseShare> shares = expenseShareRepository.findByExpenseId(e.getId());

            // if no shares stored: fallback to equal split among all members
            if (shares == null || shares.isEmpty()) {
                double share = e.getAmount() / members.size();
                balance.put(payer, balance.getOrDefault(payer, 0.0) + (e.getAmount() - share));
                for (Long m : members) {
                    if (!m.equals(payer)) {
                        balance.put(m, balance.getOrDefault(m, 0.0) - share);
                    }
                }
            } else {
                // use shares array: each share.userId owes shareAmount to payer
                for (ExpenseShare s : shares) {
                    Long user = s.getUserId();
                    double amt = s.getShareAmount();
                    if (user.equals(payer)) {
                        // if payer included as a share, the payer's balance increases by (amt - their
                        // share)
                        // assume share means they consumed that amount too, but generally payer's net
                        // change is handled by total shares
                        balance.put(payer, balance.getOrDefault(payer, 0.0) + amt);
                    } else {
                        // others owe amt -> decrease their balance, increase payer's
                        balance.put(user, balance.getOrDefault(user, 0.0) - amt);
                        balance.put(payer, balance.getOrDefault(payer, 0.0) + amt);
                    }
                }
            }
        }
        return balance;
    }

    public List<Map<String, Object>> listGroupsWithBalances() {
        return groupRepository.findAll().stream().map(g -> {
            Map<String, Object> map = new HashMap<>();
            map.put("group", g);
            map.put("balances", computeGroupBalances(g.getId()));
            return map;
        }).collect(Collectors.toList());
    }
}
