package com.example.demo.controller;

import com.example.demo.model.FeedAdditive;
import com.example.demo.service.FeedAdditiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/feed-additives")
public class FeedAdditiveController {

    @Autowired
    private FeedAdditiveService service;

    @PostMapping
    public ResponseEntity<FeedAdditive> addFeedAdditive(@RequestBody FeedAdditive feedAdditive) {
        FeedAdditive created = service.addFeedAdditive(feedAdditive);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<FeedAdditive>> getAllFeedAdditives() {
        return ResponseEntity.ok(service.getAllFeedAdditives());
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<FeedAdditive>> getFeedAdditivesByFarmer(@PathVariable String farmerId) {
        return ResponseEntity.ok(service.getFeedAdditivesByFarmer(farmerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedAdditive> updateFeedAdditive(@PathVariable String id, @RequestBody FeedAdditive updates) {
        try {
            FeedAdditive updated = service.updateFeedAdditive(id, updates);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedAdditive(@PathVariable String id) {
        service.deleteFeedAdditive(id);
        return ResponseEntity.noContent().build();
    }
}
