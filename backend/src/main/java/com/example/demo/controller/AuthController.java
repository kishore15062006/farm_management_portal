package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.service.UserService;
import com.example.demo.service.TreatmentService;
import com.example.demo.model.Treatment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private TreatmentService treatmentService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = userService.register(user);
            String token = jwtTokenProvider.generateToken(
                    registeredUser.getEmail(), 
                    registeredUser.getId(), 
                    registeredUser.getRole()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", registeredUser);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User loggedInUser = userService.login(
                    loginRequest.getEmail(), 
                    loginRequest.getPassword(), 
                    loginRequest.getRole()
            );
            String token = jwtTokenProvider.generateToken(
                    loggedInUser.getEmail(), 
                    loggedInUser.getId(), 
                    loggedInUser.getRole()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", loggedInUser);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        double complianceRate = 98.0;
        try {
            List<Treatment> treatments = treatmentService.getAllTreatments();
            if (treatments != null && !treatments.isEmpty()) {
                long approvedCount = treatments.stream()
                        .filter(t -> "approved".equalsIgnoreCase(t.getStatus()))
                        .count();
                complianceRate = ((double) approvedCount / treatments.size()) * 100.0;
                complianceRate = Math.round(complianceRate * 10.0) / 10.0;
            }
        } catch (Exception e) {
            // fallback to default rate
        }
        Map<String, Object> response = new HashMap<>();
        response.put("complianceRate", complianceRate);
        return ResponseEntity.ok(response);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
        private String role;
    }
}
