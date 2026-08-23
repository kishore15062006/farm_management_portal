package com.example.demo.service;

import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification addNotification(Notification notification) {
        if (notification.getId() == null || notification.getId().isEmpty()) {
            notification.setId("NOTIF-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
        }
        if (notification.getTimestamp() == null || notification.getTimestamp().isEmpty()) {
            notification.setTimestamp(java.time.LocalDateTime.now().toString());
        }
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getNotificationsByUser(String userId, String role) {
        List<Notification> all = notificationRepository.findAll();
        if ("farmer".equals(role)) {
            return all.stream()
                    .filter(n -> userId.equals(n.getFarmerId()))
                    .collect(Collectors.toList());
        } else if ("veterinarian".equals(role)) {
            return all.stream()
                    .filter(n -> userId.equals(n.getVeterinarianId()) ||
                            (("problem_reported".equals(n.getType()) || "treatment_pending".equals(n.getType())) && n.getVeterinarianId() == null))
                    .collect(Collectors.toList());
        } else if ("regulator".equals(role)) {
            return all.stream()
                    .filter(n -> "compliance_alert".equals(n.getType()) ||
                            "withdrawal_alert".equals(n.getType()) ||
                            "problem_reported".equals(n.getType()))
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    public Notification markAsRead(String id) {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + id));
        existing.setRead(true);
        return notificationRepository.save(existing);
    }

    public void markAllAsReadForUser(String userId, String role) {
        List<Notification> userNotifications = getNotificationsByUser(userId, role);
        for (Notification n : userNotifications) {
            if (!n.isRead()) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        }
    }

    public void clearNotifications() {
        notificationRepository.deleteAll();
    }
}
