package com.paypals.controller;

import com.paypals.model.User;
import com.paypals.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository repo;

    public UserController(UserRepository repo) { this.repo = repo; }

    @GetMapping
    public List<User> getAll() { return repo.findAll(); }

    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        if (user.getEmail() == null || user.getName() == null) return ResponseEntity.badRequest().build();
        // naive duplication check
        if (repo.findByEmail(user.getEmail()).isPresent()) return ResponseEntity.status(409).build();
        return ResponseEntity.ok(repo.save(user));
    }
}
