package com.onlinecampusinfo.controller;

import com.onlinecampusinfo.dto.request.ApplicationRequest;
import com.onlinecampusinfo.dto.response.MessageResponse;
import com.onlinecampusinfo.model.Application;
import com.onlinecampusinfo.model.User;
import com.onlinecampusinfo.model.enums.ApplicationStatus;
import com.onlinecampusinfo.service.ApplicationService;
import com.onlinecampusinfo.service.AuthService;
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
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitApplication(@Valid @RequestBody ApplicationRequest request) {
        User student = authService.getCurrentUser();
        Application application = applicationService.submitApplication(request, student);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapApplicationToResponse(application));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Map<String, Object>>> getMyApplications() {
        User student = authService.getCurrentUser();
        List<Application> applications = applicationService.getMyApplications(student.getId());
        List<Map<String, Object>> response = applications.stream()
                .map(this::mapApplicationToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/college/{collegeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getApplicationsByCollege(@PathVariable Long collegeId) {
        List<Application> applications = applicationService.getApplicationsByCollege(collegeId);
        List<Map<String, Object>> response = applications.stream()
                .map(this::mapApplicationToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getApplicationById(@PathVariable Long id) {
        Application application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(mapApplicationToResponse(application));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User admin = authService.getCurrentUser();
        String statusStr = body.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Status is required"));
        }
        ApplicationStatus status;
        try {
            status = ApplicationStatus.valueOf(statusStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid status value"));
        }
        Application application = applicationService.updateApplicationStatus(id, status, admin);
        return ResponseEntity.ok(mapApplicationToResponse(application));
    }

    private Map<String, Object> mapApplicationToResponse(Application app) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", app.getId());
        map.put("studentId", app.getStudent().getId());
        map.put("collegeId", app.getCollege().getId());
        map.put("collegeName", app.getCollege().getName());
        map.put("courseId", app.getCourse().getId());
        map.put("courseName", app.getCourse().getName());
        map.put("studentName", app.getStudentName());
        map.put("studentEmail", app.getStudentEmail());
        map.put("studentPhone", app.getStudentPhone());
        map.put("qualification", app.getQualification());
        map.put("percentage", app.getPercentage());
        map.put("address", app.getAddress());
        map.put("statementOfPurpose", app.getStatementOfPurpose());
        map.put("status", app.getStatus());
        map.put("appliedAt", app.getAppliedAt());
        map.put("updatedAt", app.getUpdatedAt());
        return map;
    }
}