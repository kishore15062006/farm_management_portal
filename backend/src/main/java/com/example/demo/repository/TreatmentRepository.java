package com.example.demo.repository;

import com.example.demo.model.Treatment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TreatmentRepository extends MongoRepository<Treatment, String> {
    List<Treatment> findByFarmerId(String farmerId);
    List<Treatment> findByStatus(String status);
    List<Treatment> findByFarmerIdAndStatus(String farmerId, String status);
}
