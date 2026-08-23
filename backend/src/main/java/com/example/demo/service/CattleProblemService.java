package com.example.demo.service;

import com.example.demo.model.CattleProblem;
import com.example.demo.repository.CattleProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class CattleProblemService {

    @Autowired
    private CattleProblemRepository problemRepository;

    public CattleProblem addProblem(CattleProblem problem) {
        if (problem.getId() == null || problem.getId().isEmpty()) {
            problem.setId("problem_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        }
        if (problem.getCattleId() == null || problem.getCattleId().isEmpty()) {
            problem.setCattleId("cattle_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        }
        if (problem.getStatus() == null || problem.getStatus().isEmpty()) {
            problem.setStatus("pending");
        }
        return problemRepository.save(problem);
    }

    public CattleProblem updateProblem(String id, CattleProblem updates) {
        CattleProblem existing = problemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found with id: " + id));

        if (updates.getStatus() != null) {
            existing.setStatus(updates.getStatus());
        }
        if (updates.getVeterinarianId() != null) {
            existing.setVeterinarianId(updates.getVeterinarianId());
        }
        if (updates.getPrescription() != null) {
            existing.setPrescription(updates.getPrescription());
        }

        return problemRepository.save(existing);
    }

    public List<CattleProblem> getAllProblems() {
        return problemRepository.findAll();
    }

    public List<CattleProblem> getProblemsByFarmer(String farmerId) {
        return problemRepository.findByFarmerId(farmerId);
    }

    public List<CattleProblem> getProblemsForVeterinarian() {
        return problemRepository.findByStatusIn(Arrays.asList("pending", "under_review", "prescribed"));
    }

    public void deleteProblem(String id) {
        problemRepository.deleteById(id);
    }
}
