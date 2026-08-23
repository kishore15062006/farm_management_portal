package com.example.demo.controller;

import com.example.demo.model.Treatment;
import com.example.demo.service.TreatmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/treatments")
public class TreatmentController {

    @Autowired
    private TreatmentService treatmentService;

    @PostMapping
    public ResponseEntity<Treatment> createTreatment(@RequestBody Treatment treatment) {
        Treatment created = treatmentService.addTreatment(treatment);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Treatment>> getAllTreatments() {
        return ResponseEntity.ok(treatmentService.getAllTreatments());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Treatment> updateTreatment(@PathVariable String id, @RequestBody Treatment updates) {
        try {
            Treatment updated = treatmentService.updateTreatment(id, updates);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Treatment>> getTreatmentsByFarmer(@PathVariable String farmerId) {
        return ResponseEntity.ok(treatmentService.getTreatmentsByFarmer(farmerId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Treatment>> getPendingTreatments() {
        return ResponseEntity.ok(treatmentService.getPendingTreatments());
    }

    @GetMapping("/approved/farmer/{farmerId}")
    public ResponseEntity<List<Treatment>> getApprovedTreatments(@PathVariable String farmerId) {
        return ResponseEntity.ok(treatmentService.getApprovedTreatments(farmerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTreatment(@PathVariable String id) {
        treatmentService.deleteTreatment(id);
        return ResponseEntity.noContent().build();
    }
}
