package com.example.demo.repository;

import com.example.demo.model.FeedAdditive;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FeedAdditiveRepository extends MongoRepository<FeedAdditive, String> {
    List<FeedAdditive> findByFarmerId(String farmerId);
}
