package com.onlinecampusinfo.service;

import com.onlinecampusinfo.dto.request.CollegeRequest;
import com.onlinecampusinfo.dto.request.CourseRequest;
import com.onlinecampusinfo.dto.request.FacilityRequest;
import com.onlinecampusinfo.model.*;
import com.onlinecampusinfo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CollegeService {

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    // College CRUD
    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    public College getCollegeById(Long id) {
        return collegeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("College not found with id: " + id));
    }

    public List<College> searchColleges(String query) {
        return collegeRepository.searchColleges(query);
    }

    public List<College> getCollegesByAdmin(Long adminId) {
        return collegeRepository.findByAdminId(adminId);
    }

    @Transactional
    public College createCollege(CollegeRequest request, User admin) {
        College college = College.builder()
                .name(request.getName())
                .description(request.getDescription())
                .location(request.getLocation())
                .city(request.getCity())
                .state(request.getState())
                .establishedYear(request.getEstablishedYear())
                .strength(request.getStrength())
                .website(request.getWebsite())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .admin(admin)
                .build();
        return collegeRepository.save(college);
    }

    @Transactional
    public College updateCollege(Long id, CollegeRequest request, User admin) {
        College college = getCollegeById(id);
        if (!college.getAdmin().getId().equals(admin.getId())) {
            throw new RuntimeException("You are not authorized to update this college");
        }
        college.setName(request.getName());
        college.setDescription(request.getDescription());
        college.setLocation(request.getLocation());
        college.setCity(request.getCity());
        college.setState(request.getState());
        college.setEstablishedYear(request.getEstablishedYear());
        college.setStrength(request.getStrength());
        college.setWebsite(request.getWebsite());
        college.setContactEmail(request.getContactEmail());
        college.setContactPhone(request.getContactPhone());
        return collegeRepository.save(college);
    }

    @Transactional
    public void deleteCollege(Long id, User admin) {
        College college = getCollegeById(id);
        if (!college.getAdmin().getId().equals(admin.getId())) {
            throw new RuntimeException("You are not authorized to delete this college");
        }
        collegeRepository.delete(college);
    }

    // Course operations
    public List<Course> getCoursesByCollege(Long collegeId) {
        return courseRepository.findByCollegeId(collegeId);
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    @Transactional
    public Course addCourse(Long collegeId, CourseRequest request, User admin) {
        College college = getCollegeById(collegeId);
        if (!college.getAdmin().getId().equals(admin.getId())) {
            throw new RuntimeException("You are not authorized to add courses to this college");
        }
        Course course = Course.builder()
                .college(college)
                .name(request.getName())
                .department(request.getDepartment())
                .duration(request.getDuration())
                .degreeType(request.getDegreeType())
                .eligibilityCriteria(request.getEligibilityCriteria())
                .totalSeats(request.getTotalSeats())
                .fee(request.getFee())
                .description(request.getDescription())
                .build();
        return courseRepository.save(course);
    }

    @Transactional
    public Course updateCourse(Long courseId, CourseRequest request, User admin) {
        Course course = getCourseById(courseId);
        if (!course.getCollege().getAdmin().getId().equals(admin.getId())) {
            throw new RuntimeException("You are not authorized to update this course");
        }
        course.setName(request.getName());
        course.setDepartment(request.getDepartment());
        course.setDuration(request.getDuration());
        course.setDegreeType(request.getDegreeType());
        course.setEligibilityCriteria(request.getEligibilityCriteria());
        course.setTotalSeats(request.getTotalSeats());
        course.setFee(request.getFee());
        course.setDescription(request.getDescription());
        return courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(Long courseId, User admin) {
        Course course = getCourseById(courseId);
        if (!course.getCollege().getAdmin().getId().equals(admin.getId())) {
            throw new RuntimeException("You are not authorized to delete this course");
        }
        courseRepository.delete(course);
    }

    // Facility operations
    public List<Facility> getFacilitiesByCollege(Long collegeId) {
        return facilityRepository.findByCollegeId(collegeId);
    }

    @Transactional
    public Facility addFacility(Long collegeId, FacilityRequest request, User admin) {
        College college = getCollegeById(collegeId);
        if (!college.getAdmin().getId().equals(admin.getId())) {
            throw new RuntimeException("You are not authorized to add facilities to this college");
        }
        Facility facility = Facility.builder()
                .college(college)
                .type(request.getType())
                .name(request.getName())
                .description(request.getDescription())
                .capacity(request.getCapacity())
                .details(request.getDetails())
                .build();
        return facilityRepository.save(facility);
    }

    @Transactional
    public void deleteFacility(Long facilityId, User admin) {
        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Facility not found"));
        if (!facility.getCollege().getAdmin().getId().equals(admin.getId())) {
            throw new RuntimeException("You are not authorized to delete this facility");
        }
        facilityRepository.delete(facility);
    }

    // Helper
    public Double getAverageRating(Long collegeId) {
        Double avg = feedbackRepository.getAverageRatingByCollegeId(collegeId);
        return avg != null ? avg : 0.0;
    }

    public long getFeedbackCount(Long collegeId) {
        return feedbackRepository.countByCollegeId(collegeId);
    }
}