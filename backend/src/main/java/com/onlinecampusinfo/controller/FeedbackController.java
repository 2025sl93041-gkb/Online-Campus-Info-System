package com.onlinecampusinfo.controller;

import com.onlinecampusinfo.dto.request.FeedbackRequest;
import com.onlinecampusinfo.model.Feedback;
import com.onlinecampusinfo.model.User;
import com.onlinecampusinfo.service.AuthService;
import com.onlinecampusinfo.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        User student = authService.getCurrentUser();
        Feedback feedback = feedbackService.submitFeedback(request, student);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapFeedbackToResponse(feedback));
    }

    @GetMapping("/college/{collegeId}")
    public ResponseEntity<List<Map<String, Object>>> getCollegeFeedbacks(@PathVariable Long collegeId) {
        List<Feedback> feedbacks = feedbackService.getCollegeFeedbacks(collegeId);
        return ResponseEntity.ok(feedbacks.stream().map(this::mapFeedbackToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/counsellor/{counsellorId}")
    public ResponseEntity<List<Map<String, Object>>> getCounsellorFeedbacks(@PathVariable Long counsellorId) {
        List<Feedback> feedbacks = feedbackService.getCounsellorFeedbacks(counsellorId);
        return ResponseEntity.ok(feedbacks.stream().map(this::mapFeedbackToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Map<String, Object>>> getMyFeedbacks() {
        User student = authService.getCurrentUser();
        List<Feedback> feedbacks = feedbackService.getMyFeedbacks(student.getId());
        return ResponseEntity.ok(feedbacks.stream().map(this::mapFeedbackToResponse).collect(Collectors.toList()));
    }

    private Map<String, Object> mapFeedbackToResponse(Feedback feedback) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", feedback.getId());
        map.put("studentId", feedback.getStudent().getId());
        map.put("studentName", feedback.getStudent().getName());
        map.put("type", feedback.getType());
        map.put("rating", feedback.getRating());
        map.put("comment", feedback.getComment());
        map.put("createdAt", feedback.getCreatedAt());

        if (feedback.getCollege() != null) {
            map.put("collegeId", feedback.getCollege().getId());
            map.put("collegeName", feedback.getCollege().getName());
        }
        if (feedback.getCounsellor() != null) {
            map.put("counsellorId", feedback.getCounsellor().getId());
            map.put("counsellorName", feedback.getCounsellor().getName());
        }
        return map;
    }
}