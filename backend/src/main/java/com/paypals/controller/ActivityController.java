package com.paypals.controller;

import com.paypals.model.Activity;
import com.paypals.repository.ActivityRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    private final ActivityRepository repo;

    public ActivityController(ActivityRepository repo) {
        this.repo = repo;
    }

    // CREATE activity
    @PostMapping
    public Activity create(@RequestBody Map<String, String> body) {
        Activity a = new Activity();
        a.setGroupId(Long.parseLong(body.get("groupId")));
        a.setText(body.get("text"));
        a.setCreatedAt(LocalDateTime.now());
        return repo.save(a);
    }

    // GET all activity entries for a group
    @GetMapping("/{groupId}")
    public List<Activity> getByGroup(@PathVariable Long groupId) {
        return repo.findByGroupIdOrderByCreatedAtDesc(groupId);
    }
}
