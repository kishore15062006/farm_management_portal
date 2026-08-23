package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String type; // "problem_reported", "prescription_given", "withdrawal_alert", "compliance_alert"
    private String title;
    private String message;
    private String timestamp;
    private boolean read;
    private String priority; // "low", "medium", "high", "critical"
    private String farmerId;
    private String veterinarianId;
    private String problemId;
    private String treatmentId;
    private String dueDate;
    private String cattleTag;
    private String medication;
    private String withdrawalEndDate;
    private Map<String, Object> relatedData;
}
