package com.onlinecampusinfo.controller;

import com.onlinecampusinfo.model.College;
import com.onlinecampusinfo.model.Feedback;
import com.onlinecampusinfo.model.User;
import com.onlinecampusinfo.model.enums.UserRole;
import com.onlinecampusinfo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CounsellorPerformanceRepository performanceRepository;

    // ==================== College Comparison (visible to all roles) ====================
    @GetMapping("/college-comparison")
    public ResponseEntity<List<Map<String, Object>>> getCollegeComparison() {
        List<College> colleges = collegeRepository.findAll();
        List<Map<String, Object>> report = colleges.stream().map(college -> {
            Map<String, Object> item = new HashMap<>();
            item.put("collegeId", college.getId());
            item.put("collegeName", college.getName());
            item.put("city", college.getCity());
            Double avgRating = feedbackRepository.getAverageRatingByCollegeId(college.getId());
            item.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
            item.put("totalFeedbacks", feedbackRepository.countByCollegeId(college.getId()));
            item.put("totalApplications", applicationRepository.countByCollegeId(college.getId()));
            return item;
        }).sorted((a, b) -> Double.compare((Double) b.get("averageRating"), (Double) a.get("averageRating")))
                .collect(Collectors.toList());
        return ResponseEntity.ok(report);
    }

    // ==================== College Feedback Details (with comments) ====================
    @GetMapping("/college-feedbacks")
    public ResponseEntity<List<Map<String, Object>>> getCollegeFeedbacksDetailed() {
        List<College> colleges = collegeRepository.findAll();
        List<Map<String, Object>> report = colleges.stream().map(college -> {
            Map<String, Object> item = new HashMap<>();
            item.put("collegeId", college.getId());
            item.put("collegeName", college.getName());
            item.put("city", college.getCity());
            Double avgRating = feedbackRepository.getAverageRatingByCollegeId(college.getId());
            item.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
            
            List<Feedback> feedbacks = feedbackRepository.findByCollegeId(college.getId());
            item.put("totalFeedbacks", feedbacks.size());
            item.put("feedbacks", feedbacks.stream().map(f -> {
                Map<String, Object> fb = new HashMap<>();
                fb.put("id", f.getId());
                fb.put("rating", f.getRating());
                fb.put("comment", f.getComment());
                fb.put("studentName", f.getStudent().getName());
                fb.put("createdAt", f.getCreatedAt());
                return fb;
            }).collect(Collectors.toList()));
            return item;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(report);
    }

    // ==================== Counsellor Performance (uses HISTORICAL data) ====================
    @GetMapping("/counsellor-performance")
    public ResponseEntity<List<Map<String, Object>>> getCounsellorPerformance() {
        List<User> counsellors = userRepository.findByRole(UserRole.COUNSELLOR);
        List<Map<String, Object>> report = counsellors.stream().map(counsellor -> {
            Map<String, Object> item = new HashMap<>();
            item.put("counsellorId", counsellor.getId());
            item.put("counsellorName", counsellor.getName());
            item.put("counsellorEmail", counsellor.getEmail());
            
            Double avgRating = feedbackRepository.getAverageRatingByCounsellorId(counsellor.getId());
            item.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
            item.put("totalFeedbacks", feedbackRepository.countByCounsellorId(counsellor.getId()));
            
            // Use historical performance log for resolved count (immutable)
            long resolvedCount = performanceRepository.countByCounsellorIdAndActionType(counsellor.getId(), "RESOLVED");
            // Active queries (current)
            long activeQueries = queryRepository.countByCounsellorId(counsellor.getId());
            
            item.put("totalQueries", activeQueries); // Currently assigned active queries
            item.put("resolvedQueries", resolvedCount); // Historical resolved count (immutable)
            item.put("totalHandled", resolvedCount); // Same as resolved for backwards compat
            
            // Include feedback comments
            List<Feedback> feedbacks = feedbackRepository.findByCounsellorId(counsellor.getId());
            item.put("feedbackComments", feedbacks.stream().map(f -> {
                Map<String, Object> fb = new HashMap<>();
                fb.put("id", f.getId());
                fb.put("rating", f.getRating());
                fb.put("comment", f.getComment());
                fb.put("studentName", f.getStudent().getName());
                fb.put("createdAt", f.getCreatedAt());
                return fb;
            }).collect(Collectors.toList()));
            
            return item;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(report);
    }

    // ==================== My Performance (Counsellor self-view) ====================
    @GetMapping("/my-performance")
    public ResponseEntity<Map<String, Object>> getMyPerformance(@RequestParam Long counsellorId) {
        User counsellor = userRepository.findById(counsellorId)
                .orElseThrow(() -> new RuntimeException("Counsellor not found"));
        
        Map<String, Object> result = new HashMap<>();
        result.put("counsellorId", counsellor.getId());
        result.put("counsellorName", counsellor.getName());
        
        Double avgRating = feedbackRepository.getAverageRatingByCounsellorId(counsellor.getId());
        result.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        result.put("totalFeedbacks", feedbackRepository.countByCounsellorId(counsellor.getId()));
        
        long resolvedCount = performanceRepository.countByCounsellorIdAndActionType(counsellor.getId(), "RESOLVED");
        long activeQueries = queryRepository.countByCounsellorId(counsellor.getId());
        result.put("totalQueries", activeQueries);
        result.put("resolvedQueries", resolvedCount);
        result.put("totalHandled", resolvedCount);
        
        List<Feedback> feedbacks = feedbackRepository.findByCounsellorId(counsellor.getId());
        result.put("feedbackComments", feedbacks.stream().map(f -> {
            Map<String, Object> fb = new HashMap<>();
            fb.put("id", f.getId());
            fb.put("rating", f.getRating());
            fb.put("comment", f.getComment());
            fb.put("studentName", f.getStudent().getName());
            fb.put("createdAt", f.getCreatedAt());
            return fb;
        }).collect(Collectors.toList()));
        
        return ResponseEntity.ok(result);
    }

    // ==================== Application Stats (Admin only) ====================
    @GetMapping("/application-stats")
    public ResponseEntity<Map<String, Object>> getApplicationStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", applicationRepository.count());
        stats.put("pending", applicationRepository.countByStatus(com.onlinecampusinfo.model.enums.ApplicationStatus.PENDING));
        stats.put("underReview", applicationRepository.countByStatus(com.onlinecampusinfo.model.enums.ApplicationStatus.UNDER_REVIEW));
        stats.put("accepted", applicationRepository.countByStatus(com.onlinecampusinfo.model.enums.ApplicationStatus.ACCEPTED));
        stats.put("rejected", applicationRepository.countByStatus(com.onlinecampusinfo.model.enums.ApplicationStatus.REJECTED));
        stats.put("totalColleges", collegeRepository.count());
        stats.put("totalStudents", userRepository.findByRole(UserRole.STUDENT).size());
        stats.put("totalCounsellors", userRepository.findByRole(UserRole.COUNSELLOR).size());
        stats.put("openQueries", queryRepository.countByStatus(com.onlinecampusinfo.model.enums.QueryStatus.OPEN));
        // Use historical record for accurate resolved count
        stats.put("resolvedQueries", performanceRepository.count());
        return ResponseEntity.ok(stats);
    }
}