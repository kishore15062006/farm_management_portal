package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }
        
        // Hash password
        user.setPassword(PasswordUtils.hashPassword(user.getPassword()));
        
        // Generate an ID if not present
        if (user.getId() == null || user.getId().isEmpty()) {
            user.setId(UUID.randomUUID().toString());
        }
        
        return userRepository.save(user);
    }

    public User login(String email, String password, String role) {
        User user = userRepository.findByEmailAndRole(email, role)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials or role mismatch"));
        
        if (!PasswordUtils.verifyPassword(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials or role mismatch");
        }
        
        return user;
    }
}
