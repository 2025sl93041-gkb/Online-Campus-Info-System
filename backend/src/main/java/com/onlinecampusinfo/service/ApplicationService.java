package com.onlinecampusinfo.service;

import com.onlinecampusinfo.dto.request.ApplicationRequest;
import com.onlinecampusinfo.model.Application;
import com.onlinecampusinfo.model.College;
import com.onlinecampusinfo.model.Course;
import com.onlinecampusinfo.model.User;
import com.onlinecampusinfo.model.enums.ApplicationStatus;
import com.onlinecampusinfo.repository.ApplicationRepository;
import com.onlinecampusinfo.repository.CollegeRepository;
import com.onlinecampusinfo.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Transactional
    public Application submitApplication(ApplicationRequest request, User student) {
        College college = collegeRepository.findById(request.getCollegeId())
                .orElseThrow(() -> new RuntimeException("College not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Application application = Application.builder()
                .student(student)
                .college(college)
                .course(course)
                .studentName(request.getStudentName())
                .studentEmail(request.getStudentEmail())
                .studentPhone(request.getStudentPhone())
                .qualification(request.getQualification())
                .percentage(request.getPercentage())
                .address(request.getAddress())
                .statementOfPurpose(request.getStatementOfPurpose())
                .status(ApplicationStatus.PENDING)
                .build();

        return applicationRepository.save(application);
    }

    public List<Application> getMyApplications(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public List<Application> getApplicationsByCollege(Long collegeId) {
        return applicationRepository.findByCollegeId(collegeId);
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @Transactional
    public Application updateApplicationStatus(Long id, ApplicationStatus status, User admin) {
        Application application = getApplicationById(id);
        if (!application.getCollege().getAdmin().getId().equals(admin.getId())) {
            throw new RuntimeException("You are not authorized to update this application");
        }
        application.setStatus(status);
        return applicationRepository.save(application);
    }
}