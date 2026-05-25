package com.onlinecampusinfo.controller;

import com.onlinecampusinfo.model.College;
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

    @GetMapping("/counsellor-performance")
    public ResponseEntity<List<Map<String, Object>>> getCounsellorPerformance() {
        List<User> counsellors = userRepository.findByRole(UserRole.COUNSELLOR);
        List<Map<String, Object>> report = counsellors.stream().map(counsellor -> {
            Map<String, Object> item = new HashMap<>();
            item.put("counsellorId", counsellor.getId());
            item.put("counsellorName", counsellor.getName());
            Double avgRating = feedbackRepository.getAverageRatingByCounsellorId(counsellor.getId());
            item.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
            item.put("totalFeedbacks", feedbackRepository.countByCounsellorId(counsellor.getId()));
            item.put("totalQueries", queryRepository.countByCounsellorId(counsellor.getId()));
            return item;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(report);
    }

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
        stats.put("resolvedQueries", queryRepository.countByStatus(com.onlinecampusinfo.model.enums.QueryStatus.RESOLVED));
        return ResponseEntity.ok(stats);
    }
}