package com.example.demo.service;

import com.example.demo.model.Treatment;
import com.example.demo.repository.TreatmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TreatmentService {

    @Autowired
    private TreatmentRepository treatmentRepository;

    public Treatment addTreatment(Treatment treatment) {
        if (treatment.getId() == null || treatment.getId().isEmpty()) {
            treatment.setId("TREAT-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
        }
        if (treatment.getStatus() == null || treatment.getStatus().isEmpty()) {
            treatment.setStatus("pending");
        }
        return treatmentRepository.save(treatment);
    }

    public Treatment updateTreatment(String id, Treatment updates) {
        Treatment existing = treatmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Treatment not found with id: " + id));

        if (updates.getStatus() != null) {
            existing.setStatus(updates.getStatus());
        }
        if (updates.getVeterinarianId() != null) {
            existing.setVeterinarianId(updates.getVeterinarianId());
        }
        if (updates.getVeterinarianName() != null) {
            existing.setVeterinarianName(updates.getVeterinarianName());
        }
        if (updates.getApprovedDate() != null) {
            existing.setApprovedDate(updates.getApprovedDate());
        }
        if (updates.getRejectionReason() != null) {
            existing.setRejectionReason(updates.getRejectionReason());
        }

        return treatmentRepository.save(existing);
    }

    public List<Treatment> getAllTreatments() {
        return treatmentRepository.findAll();
    }

    public List<Treatment> getTreatmentsByFarmer(String farmerId) {
        return treatmentRepository.findByFarmerId(farmerId);
    }

    public List<Treatment> getPendingTreatments() {
        return treatmentRepository.findByStatus("pending");
    }

    public List<Treatment> getApprovedTreatments(String farmerId) {
        return treatmentRepository.findByFarmerIdAndStatus(farmerId, "approved");
    }

    public void deleteTreatment(String id) {
        treatmentRepository.deleteById(id);
    }
}
