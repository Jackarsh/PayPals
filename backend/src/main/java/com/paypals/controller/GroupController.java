package com.paypals.controller;

import com.paypals.model.Group;
import com.paypals.repository.GroupRepository;
import com.paypals.service.BalanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/groups")
public class GroupController {
    private final GroupRepository repo;
    private final BalanceService balanceService;

    public GroupController(GroupRepository repo, BalanceService balanceService) {
        this.repo = repo;
        this.balanceService = balanceService;
    }

    @GetMapping
    public List<Group> allGroups() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getGroup(@PathVariable Long id) {
        Optional<Group> g = repo.findById(id);
        if (g.isEmpty())
            return ResponseEntity.notFound().build();
        Map<String, Object> resp = new HashMap<>();
        resp.put("group", g.get());
        resp.put("balances", balanceService.computeGroupBalances(id));
        return ResponseEntity.ok(resp);
    }

    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody Group group) {
        if (group.getName() == null || group.getMemberIds() == null || group.getMemberIds().isEmpty())
            return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(repo.save(group));
    }
}
