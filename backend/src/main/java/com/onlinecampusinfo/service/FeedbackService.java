package com.onlinecampusinfo.service;

import com.onlinecampusinfo.dto.request.FeedbackRequest;
import com.onlinecampusinfo.model.College;
import com.onlinecampusinfo.model.Feedback;
import com.onlinecampusinfo.model.User;
import com.onlinecampusinfo.model.enums.FeedbackType;
import com.onlinecampusinfo.repository.CollegeRepository;
import com.onlinecampusinfo.repository.FeedbackRepository;
import com.onlinecampusinfo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Feedback submitFeedback(FeedbackRequest request, User student) {
        Feedback feedback = Feedback.builder()
                .student(student)
                .type(request.getType())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        if (request.getType() == FeedbackType.COLLEGE && request.getCollegeId() != null) {
            College college = collegeRepository.findById(request.getCollegeId())
                    .orElseThrow(() -> new RuntimeException("College not found"));
            feedback.setCollege(college);
        }

        if (request.getType() == FeedbackType.COUNSELLOR && request.getCounsellorId() != null) {
            User counsellor = userRepository.findById(request.getCounsellorId())
                    .orElseThrow(() -> new RuntimeException("Counsellor not found"));
            feedback.setCounsellor(counsellor);
        }

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getCollegeFeedbacks(Long collegeId) {
        return feedbackRepository.findByCollegeId(collegeId);
    }

    public List<Feedback> getCounsellorFeedbacks(Long counsellorId) {
        return feedbackRepository.findByCounsellorId(counsellorId);
    }

    public List<Feedback> getMyFeedbacks(Long studentId) {
        return feedbackRepository.findByStudentId(studentId);
    }
}