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
@Document(collection = "feed_additives")
public class FeedAdditive {
    @Id
    private String id;
    private String farmerId;
    private String farmerName;
    private String farmName;
    private String feedType;
    private String drug;
    private String batchNumber;
    private String quantity;
    private String unit;
    private String concentration;
    private String supplier;
    private String startDate;
    private String endDate;
    private String withdrawalDate;
    private String animalGroup;
    private Integer totalAnimals;
    private String status; // "active", "pending", "completed"
    private String purpose;
    private String notes;
}
