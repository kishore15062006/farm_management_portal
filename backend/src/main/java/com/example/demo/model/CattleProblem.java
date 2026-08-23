package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "cattle_problems")
public class CattleProblem {
    @Id
    private String id;
    private String cattleId;
    private String cattleTag;
    private String problem;
    private String symptoms;
    private String severity; // "low", "medium", "high", "critical"
    private String reportedDate;
    private String status; // "pending", "under_review", "prescribed", "resolved"
    private String farmerId;
    private String farmerName;
    private String farmName;
    private String veterinarianId;
    private Prescription prescription;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Prescription {
        private String id;
        private String medication;
        private String dosage;
        private String duration;
        private String instructions;
        private int withdrawalPeriod;
        private String prescribedDate;
        private String additionalNotes;
    }
}
