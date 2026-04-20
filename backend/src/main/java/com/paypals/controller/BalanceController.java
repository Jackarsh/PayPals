package com.paypals.controller;

import com.paypals.model.User;
import com.paypals.service.BalanceService;
import com.paypals.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/balances")
public class BalanceController {

    private final BalanceService balanceService;
    private final UserRepository userRepository;

    public BalanceController(BalanceService balanceService, UserRepository userRepository) {
        this.balanceService = balanceService;
        this.userRepository = userRepository;
    }

    // ---------------------------------------------------------------
    // 1️⃣ SUMMARY ENDPOINT
    // ---------------------------------------------------------------
    @GetMapping("/group/{groupId}/summary")
    public Map<String, Double> getSummary(@PathVariable Long groupId) {

        Map<Long, Double> balances = balanceService.computeGroupBalances(groupId);
        Map<String, Double> result = new LinkedHashMap<>();

        for (Map.Entry<Long, Double> e : balances.entrySet()) {
            Long uid = e.getKey();
            double val = e.getValue();
            String name = userRepository.findById(uid)
                    .map(User::getName)
                    .orElse("User " + uid);

            result.put(name, val);
        }

        return result;
    }

    // ---------------------------------------------------------------
    // 2️⃣ DETAILED HUMAN-READABLE ENDPOINT
    // ---------------------------------------------------------------
    @GetMapping("/group/{groupId}/detailed")
    public List<String> getDetailedBalances(@PathVariable Long groupId) {

        Map<Long, Double> balances = balanceService.computeGroupBalances(groupId);
        List<String> result = new ArrayList<>();

        Map<Long, String> names = new HashMap<>();
        for (Long uid : balances.keySet()) {
            userRepository.findById(uid).ifPresent(u -> names.put(uid, u.getName()));
        }

        List<Map.Entry<Long, Double>> positives = new ArrayList<>();
        List<Map.Entry<Long, Double>> negatives = new ArrayList<>();

        for (var e : balances.entrySet()) {
            if (e.getValue() > 0)
                positives.add(e);
            else if (e.getValue() < 0)
                negatives.add(e);
        }

        int i = 0, j = 0;

        while (i < negatives.size() && j < positives.size()) {

            var owe = negatives.get(i);
            var owed = positives.get(j);

            double amountOwes = -owe.getValue();
            double amountOwed = owed.getValue();

            double settled = Math.min(amountOwes, amountOwed);

            String debtorName = names.getOrDefault(owe.getKey(), "User " + owe.getKey());
            String creditorName = names.getOrDefault(owed.getKey(), "User " + owed.getKey());

            result.add(
                    debtorName + " owes ₹" + String.format("%.2f", settled)
                            + " to " + creditorName);

            owe.setValue(-(amountOwes - settled));
            owed.setValue(amountOwed - settled);

            if (owe.getValue() == 0)
                i++;
            if (owed.getValue() == 0)
                j++;
        }

        return result;
    }

    // ---------------------------------------------------------------
    // 3️⃣ OPTIMIZED MINIMAL TRANSACTIONS ENDPOINT (NEW)
    // ---------------------------------------------------------------
    @GetMapping("/group/{groupId}/optimized")
    public List<String> getOptimizedBalances(@PathVariable Long groupId) {

        Map<Long, Double> balances = balanceService.computeGroupBalances(groupId);

        // Split into positives and negatives
        List<Map.Entry<Long, Double>> creditors = new ArrayList<>();
        List<Map.Entry<Long, Double>> debtors = new ArrayList<>();

        for (var e : balances.entrySet()) {
            if (e.getValue() > 0)
                creditors.add(e);
            else if (e.getValue() < 0)
                debtors.add(e);
        }

        // Sort for optimal settlement
        creditors.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));
        debtors.sort((a, b) -> Double.compare(a.getValue(), b.getValue())); // more negative first

        Map<Long, String> names = new HashMap<>();
        for (Long uid : balances.keySet()) {
            userRepository.findById(uid).ifPresent(u -> names.put(uid, u.getName()));
        }

        List<String> result = new ArrayList<>();

        int i = 0, j = 0;

        while (i < debtors.size() && j < creditors.size()) {

            var deb = debtors.get(i);
            var cre = creditors.get(j);

            double debit = -deb.getValue();
            double credit = cre.getValue();

            double settled = Math.min(debit, credit);

            String debtorName = names.getOrDefault(deb.getKey(), "User " + deb.getKey());
            String creditorName = names.getOrDefault(cre.getKey(), "User " + cre.getKey());

            result.add(debtorName + " pays " + creditorName +
                    " ₹" + String.format("%.2f", settled));

            // Update remaining balance
            deb.setValue(-(debit - settled));
            cre.setValue(credit - settled);

            if (deb.getValue() == 0)
                i++;
            if (cre.getValue() == 0)
                j++;
        }

        return result;
    }
}
