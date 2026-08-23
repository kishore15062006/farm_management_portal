package com.example.demo.service;

import com.example.demo.model.FeedAdditive;
import com.example.demo.repository.FeedAdditiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class FeedAdditiveService {

    @Autowired
    private FeedAdditiveRepository repository;

    public FeedAdditive addFeedAdditive(FeedAdditive feedAdditive) {
        if (feedAdditive.getId() == null || feedAdditive.getId().isEmpty()) {
            feedAdditive.setId("feed_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        }
        if (feedAdditive.getStatus() == null || feedAdditive.getStatus().isEmpty()) {
            feedAdditive.setStatus("pending");
        }
        return repository.save(feedAdditive);
    }

    public FeedAdditive updateFeedAdditive(String id, FeedAdditive updates) {
        FeedAdditive existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Feed additive not found with id: " + id));

        if (updates.getStatus() != null) {
            existing.setStatus(updates.getStatus());
        }
        return repository.save(existing);
    }

    public List<FeedAdditive> getAllFeedAdditives() {
        return repository.findAll();
    }

    public List<FeedAdditive> getFeedAdditivesByFarmer(String farmerId) {
        return repository.findByFarmerId(farmerId);
    }

    public void deleteFeedAdditive(String id) {
        repository.deleteById(id);
    }
}
