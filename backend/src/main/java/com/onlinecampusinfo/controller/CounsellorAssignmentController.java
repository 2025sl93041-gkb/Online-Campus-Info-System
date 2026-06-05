package com.onlinecampusinfo.controller;

import com.onlinecampusinfo.dto.response.MessageResponse;
import com.onlinecampusinfo.model.CounsellorAssignment;
import com.onlinecampusinfo.model.User;
import com.onlinecampusinfo.model.enums.UserRole;
import com.onlinecampusinfo.repository.UserRepository;
import com.onlinecampusinfo.service.AuthService;
import com.onlinecampusinfo.service.CounsellorAssignmentService;
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
@RequestMapping("/api/counsellor-assignments")
public class CounsellorAssignmentController {

    @Autowired
    private CounsellorAssignmentService assignmentService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    // Get all counsellors with their assignments (Admin)
    @GetMapping("/counsellors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllCounsellorsWithAssignments() {
        List<User> counsellors = userRepository.findByRole(UserRole.COUNSELLOR);
        List<Map<String, Object>> response = counsellors.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("name", c.getName());
            map.put("email", c.getEmail());
            List<CounsellorAssignment> assignments = assignmentService.getAssignmentsByCounsellor(c.getId());
            map.put("assignedColleges", assignments.stream().map(a -> {
                Map<String, Object> col = new HashMap<>();
                col.put("assignmentId", a.getId());
                col.put("collegeId", a.getCollege().getId());
                col.put("collegeName", a.getCollege().getName());
                col.put("assignedAt", a.getAssignedAt());
                return col;
            }).collect(Collectors.toList()));
            map.put("totalAssignments", assignments.size());
            map.put("maxAllowed", assignmentService.getMaxCollegesPerCounsellor());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Assign counsellor to college (Admin)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignCounsellor(@RequestBody Map<String, Long> request) {
        try {
            Long counsellorId = request.get("counsellorId");
            Long collegeId = request.get("collegeId");

            if (counsellorId == null || collegeId == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("counsellorId and collegeId are required"));
            }

            User admin = authService.getCurrentUser();
            CounsellorAssignment assignment = assignmentService.assignCounsellorToCollege(counsellorId, collegeId, admin);

            Map<String, Object> response = new HashMap<>();
            response.put("id", assignment.getId());
            response.put("counsellorId", assignment.getCounsellor().getId());
            response.put("counsellorName", assignment.getCounsellor().getName());
            response.put("collegeId", assignment.getCollege().getId());
            response.put("collegeName", assignment.getCollege().getName());
            response.put("assignedAt", assignment.getAssignedAt());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // Unassign counsellor from college (Admin)
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> unassignCounsellor(@RequestParam Long counsellorId, @RequestParam Long collegeId) {
        try {
            assignmentService.unassignCounsellor(counsellorId, collegeId);
            return ResponseEntity.ok(new MessageResponse("Counsellor unassigned successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // Get assignments for current counsellor (Counsellor)
    @GetMapping("/my")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<List<Map<String, Object>>> getMyAssignments() {
        User counsellor = authService.getCurrentUser();
        List<CounsellorAssignment> assignments = assignmentService.getAssignmentsByCounsellor(counsellor.getId());
        List<Map<String, Object>> response = assignments.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("collegeId", a.getCollege().getId());
            map.put("collegeName", a.getCollege().getName());
            map.put("assignedAt", a.getAssignedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Get counsellors assigned to a college (used by students raising queries)
    @GetMapping("/by-college/{collegeId}")
    public ResponseEntity<List<Map<String, Object>>> getCounsellorsByCollege(@PathVariable Long collegeId) {
        List<CounsellorAssignment> assignments = assignmentService.getAssignmentsByCollege(collegeId);
        List<Map<String, Object>> response = assignments.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("counsellorId", a.getCounsellor().getId());
            map.put("counsellorName", a.getCounsellor().getName());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}