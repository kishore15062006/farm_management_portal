package com.example.demo.repository;

import com.example.demo.model.CattleProblem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CattleProblemRepository extends MongoRepository<CattleProblem, String> {
    List<CattleProblem> findByFarmerId(String farmerId);
    List<CattleProblem> findByStatusIn(List<String> statuses);
}
