package com.onlinecampusinfo.controller;

import com.onlinecampusinfo.dto.request.CollegeRequest;
import com.onlinecampusinfo.dto.request.CourseRequest;
import com.onlinecampusinfo.dto.request.FacilityRequest;
import com.onlinecampusinfo.dto.response.MessageResponse;
import com.onlinecampusinfo.model.*;
import com.onlinecampusinfo.service.AuthService;
import com.onlinecampusinfo.service.CollegeService;
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
@RequestMapping("/api")
public class CollegeController {

    @Autowired
    private CollegeService collegeService;

    @Autowired
    private AuthService authService;

    // ==================== College Endpoints ====================

    @GetMapping("/colleges")
    public ResponseEntity<List<Map<String, Object>>> getAllColleges() {
        List<College> colleges = collegeService.getAllColleges();
        List<Map<String, Object>> response = colleges.stream()
                .map(this::mapCollegeToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/colleges/{id}")
    public ResponseEntity<Map<String, Object>> getCollegeById(@PathVariable Long id) {
        College college = collegeService.getCollegeById(id);
        Map<String, Object> response = mapCollegeDetailToResponse(college);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/colleges/search")
    public ResponseEntity<List<Map<String, Object>>> searchColleges(@RequestParam String q) {
        List<College> colleges = collegeService.searchColleges(q);
        List<Map<String, Object>> response = colleges.stream()
                .map(this::mapCollegeToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/colleges/my")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getMyColleges() {
        User admin = authService.getCurrentUser();
        List<College> colleges = collegeService.getCollegesByAdmin(admin.getId());
        List<Map<String, Object>> response = colleges.stream()
                .map(this::mapCollegeToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/colleges")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCollege(@Valid @RequestBody CollegeRequest request) {
        User admin = authService.getCurrentUser();
        College college = collegeService.createCollege(request, admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapCollegeToResponse(college));
    }

    @PutMapping("/colleges/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCollege(@PathVariable Long id, @Valid @RequestBody CollegeRequest request) {
        User admin = authService.getCurrentUser();
        College college = collegeService.updateCollege(id, request, admin);
        return ResponseEntity.ok(mapCollegeToResponse(college));
    }

    @DeleteMapping("/colleges/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCollege(@PathVariable Long id) {
        User admin = authService.getCurrentUser();
        collegeService.deleteCollege(id, admin);
        return ResponseEntity.ok(new MessageResponse("College deleted successfully"));
    }

    // ==================== Course Endpoints ====================

    @GetMapping("/colleges/{collegeId}/courses")
    public ResponseEntity<List<Map<String, Object>>> getCourses(@PathVariable Long collegeId) {
        List<Course> courses = collegeService.getCoursesByCollege(collegeId);
        List<Map<String, Object>> response = courses.stream()
                .map(this::mapCourseToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<Map<String, Object>> getCourseById(@PathVariable Long id) {
        Course course = collegeService.getCourseById(id);
        return ResponseEntity.ok(mapCourseToResponse(course));
    }

    @PostMapping("/colleges/{collegeId}/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addCourse(@PathVariable Long collegeId, @Valid @RequestBody CourseRequest request) {
        User admin = authService.getCurrentUser();
        Course course = collegeService.addCourse(collegeId, request, admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapCourseToResponse(course));
    }

    @PutMapping("/courses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        User admin = authService.getCurrentUser();
        Course course = collegeService.updateCourse(id, request, admin);
        return ResponseEntity.ok(mapCourseToResponse(course));
    }

    @DeleteMapping("/courses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        User admin = authService.getCurrentUser();
        collegeService.deleteCourse(id, admin);
        return ResponseEntity.ok(new MessageResponse("Course deleted successfully"));
    }

    // ==================== Facility Endpoints ====================

    @GetMapping("/colleges/{collegeId}/facilities")
    public ResponseEntity<List<Map<String, Object>>> getFacilities(@PathVariable Long collegeId) {
        List<Facility> facilities = collegeService.getFacilitiesByCollege(collegeId);
        List<Map<String, Object>> response = facilities.stream()
                .map(this::mapFacilityToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/colleges/{collegeId}/facilities")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addFacility(@PathVariable Long collegeId, @Valid @RequestBody FacilityRequest request) {
        User admin = authService.getCurrentUser();
        Facility facility = collegeService.addFacility(collegeId, request, admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapFacilityToResponse(facility));
    }

    @DeleteMapping("/facilities/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFacility(@PathVariable Long id) {
        User admin = authService.getCurrentUser();
        collegeService.deleteFacility(id, admin);
        return ResponseEntity.ok(new MessageResponse("Facility deleted successfully"));
    }

    // ==================== Mappers ====================

    private Map<String, Object> mapCollegeToResponse(College college) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", college.getId());
        map.put("name", college.getName());
        map.put("description", college.getDescription());
        map.put("location", college.getLocation());
        map.put("city", college.getCity());
        map.put("state", college.getState());
        map.put("establishedYear", college.getEstablishedYear());
        map.put("strength", college.getStrength());
        map.put("website", college.getWebsite());
        map.put("contactEmail", college.getContactEmail());
        map.put("contactPhone", college.getContactPhone());
        map.put("averageRating", collegeService.getAverageRating(college.getId()));
        map.put("totalFeedbacks", collegeService.getFeedbackCount(college.getId()));
        map.put("createdAt", college.getCreatedAt());
        return map;
    }

    private Map<String, Object> mapCollegeDetailToResponse(College college) {
        Map<String, Object> map = mapCollegeToResponse(college);
        map.put("courses", college.getCourses().stream()
                .map(this::mapCourseToResponse)
                .collect(Collectors.toList()));
        map.put("facilities", college.getFacilities().stream()
                .map(this::mapFacilityToResponse)
                .collect(Collectors.toList()));
        return map;
    }

    private Map<String, Object> mapCourseToResponse(Course course) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", course.getId());
        map.put("collegeId", course.getCollege().getId());
        map.put("name", course.getName());
        map.put("department", course.getDepartment());
        map.put("duration", course.getDuration());
        map.put("degreeType", course.getDegreeType());
        map.put("eligibilityCriteria", course.getEligibilityCriteria());
        map.put("totalSeats", course.getTotalSeats());
        map.put("fee", course.getFee());
        map.put("description", course.getDescription());
        return map;
    }

    private Map<String, Object> mapFacilityToResponse(Facility facility) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", facility.getId());
        map.put("collegeId", facility.getCollege().getId());
        map.put("type", facility.getType());
        map.put("name", facility.getName());
        map.put("description", facility.getDescription());
        map.put("capacity", facility.getCapacity());
        map.put("details", facility.getDetails());
        return map;
    }
}