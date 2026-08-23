package com.example.demo.controller;

import com.example.demo.model.CattleProblem;
import com.example.demo.service.CattleProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class CattleProblemController {

    @Autowired
    private CattleProblemService problemService;

    @PostMapping
    public ResponseEntity<CattleProblem> reportProblem(@RequestBody CattleProblem problem) {
        CattleProblem created = problemService.addProblem(problem);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<CattleProblem>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CattleProblem> updateProblem(@PathVariable String id, @RequestBody CattleProblem updates) {
        try {
            CattleProblem updated = problemService.updateProblem(id, updates);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<CattleProblem>> getProblemsByFarmer(@PathVariable String farmerId) {
        return ResponseEntity.ok(problemService.getProblemsByFarmer(farmerId));
    }

    @GetMapping("/veterinarian")
    public ResponseEntity<List<CattleProblem>> getProblemsForVeterinarian() {
        return ResponseEntity.ok(problemService.getProblemsForVeterinarian());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable String id) {
        problemService.deleteProblem(id);
        return ResponseEntity.noContent().build();
    }
}
