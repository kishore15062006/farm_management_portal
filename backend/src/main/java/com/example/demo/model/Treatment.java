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
@Document(collection = "treatments")
public class Treatment {
    @Id
    private String id;
    private String animalId;
    private String animalType;
    private String drug;
    private String dosage;
    private String route;
    private String frequency;
    private String duration;
    private String reason;
    private String vetPrescription;
    private String batchNumber;
    private String startDate;
    private String withdrawalDate;
    private String status; // "pending", "approved", "rejected"
    private String farmerId;
    private String farmerName;
    private String farmName;
    private String veterinarianId;
    private String veterinarianName;
    private String approvedDate;
    private String rejectionReason;
    private String submittedDate;
}
