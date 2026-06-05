package com.onlinecampusinfo.service;

import com.onlinecampusinfo.model.College;
import com.onlinecampusinfo.model.CounsellorAssignment;
import com.onlinecampusinfo.model.User;
import com.onlinecampusinfo.model.enums.UserRole;
import com.onlinecampusinfo.repository.CollegeRepository;
import com.onlinecampusinfo.repository.CounsellorAssignmentRepository;
import com.onlinecampusinfo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CounsellorAssignmentService {

    @Autowired
    private CounsellorAssignmentRepository assignmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Value("${app.counsellor.max-colleges:3}")
    private int maxCollegesPerCounsellor;

    @Transactional
    public CounsellorAssignment assignCounsellorToCollege(Long counsellorId, Long collegeId, User assignedBy) {
        User counsellor = userRepository.findById(counsellorId)
                .orElseThrow(() -> new RuntimeException("Counsellor not found"));

        if (counsellor.getRole() != UserRole.COUNSELLOR) {
            throw new RuntimeException("User is not a counsellor");
        }

        College college = collegeRepository.findById(collegeId)
                .orElseThrow(() -> new RuntimeException("College not found"));

        // Check duplicate
        if (assignmentRepository.existsByCounsellorIdAndCollegeId(counsellorId, collegeId)) {
            throw new RuntimeException("Counsellor is already assigned to this college");
        }

        // Check maximum colleges per counsellor
        long currentAssignments = assignmentRepository.countByCounsellorId(counsellorId);
        if (currentAssignments >= maxCollegesPerCounsellor) {
            throw new RuntimeException("Counsellor has reached maximum college assignments (" + maxCollegesPerCounsellor + ")");
        }

        CounsellorAssignment assignment = CounsellorAssignment.builder()
                .counsellor(counsellor)
                .college(college)
                .assignedBy(assignedBy)
                .build();

        return assignmentRepository.save(assignment);
    }

    @Transactional
    public void unassignCounsellor(Long counsellorId, Long collegeId) {
        CounsellorAssignment assignment = assignmentRepository
                .findByCounsellorIdAndCollegeId(counsellorId, collegeId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        assignmentRepository.delete(assignment);
    }

    public List<CounsellorAssignment> getAssignmentsByCounsellor(Long counsellorId) {
        return assignmentRepository.findByCounsellorId(counsellorId);
    }

    public List<CounsellorAssignment> getAssignmentsByCollege(Long collegeId) {
        return assignmentRepository.findByCollegeId(collegeId);
    }

    public List<CounsellorAssignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public boolean isCounsellorAssignedToCollege(Long counsellorId, Long collegeId) {
        return assignmentRepository.existsByCounsellorIdAndCollegeId(counsellorId, collegeId);
    }

    public int getMaxCollegesPerCounsellor() {
        return maxCollegesPerCounsellor;
    }
}