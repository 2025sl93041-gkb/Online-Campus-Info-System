package com.onlinecampusinfo.service;

import com.onlinecampusinfo.dto.request.QueryRequest;
import com.onlinecampusinfo.model.College;
import com.onlinecampusinfo.model.CounsellorAssignment;
import com.onlinecampusinfo.model.CounsellorPerformance;
import com.onlinecampusinfo.model.Query;
import com.onlinecampusinfo.model.User;
import com.onlinecampusinfo.model.enums.QueryStatus;
import com.onlinecampusinfo.model.enums.UserRole;
import com.onlinecampusinfo.repository.CollegeRepository;
import com.onlinecampusinfo.repository.CounsellorAssignmentRepository;
import com.onlinecampusinfo.repository.CounsellorPerformanceRepository;
import com.onlinecampusinfo.repository.QueryRepository;
import com.onlinecampusinfo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QueryService {

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CounsellorAssignmentRepository assignmentRepository;

    @Autowired
    private CounsellorPerformanceRepository performanceRepository;

    @Transactional
    public Query raiseQuery(QueryRequest request, User student) {
        Query query = Query.builder()
                .student(student)
                .subject(request.getSubject())
                .message(request.getMessage())
                .status(QueryStatus.OPEN)
                .build();

        College college = null;
        if (request.getCollegeId() != null) {
            college = collegeRepository.findById(request.getCollegeId())
                    .orElseThrow(() -> new RuntimeException("College not found"));
            query.setCollege(college);
        }

        // Smart Assignment: Prioritize counsellors assigned to the specific college
        User assignedCounsellor = null;

        if (college != null) {
            // Get counsellors assigned to this college
            List<CounsellorAssignment> collegeAssignments = assignmentRepository.findByCollegeId(college.getId());
            if (!collegeAssignments.isEmpty()) {
                // Pick the assigned counsellor with least active queries
                long minQueries = Long.MAX_VALUE;
                for (CounsellorAssignment ca : collegeAssignments) {
                    User c = ca.getCounsellor();
                    long count = queryRepository.countByCounsellorId(c.getId());
                    if (count < minQueries) {
                        minQueries = count;
                        assignedCounsellor = c;
                    }
                }
            }
        }

        // Fallback: If no college specified or no counsellor assigned to that college,
        // assign to any available counsellor (legacy behavior)
        if (assignedCounsellor == null) {
            List<User> counsellors = userRepository.findByRole(UserRole.COUNSELLOR);
            if (!counsellors.isEmpty()) {
                long minQueries = Long.MAX_VALUE;
                for (User c : counsellors) {
                    long count = queryRepository.countByCounsellorId(c.getId());
                    if (count < minQueries) {
                        minQueries = count;
                        assignedCounsellor = c;
                    }
                }
            }
        }

        query.setCounsellor(assignedCounsellor);
        return queryRepository.save(query);
    }

    public List<Query> getMyQueries(Long studentId) {
        return queryRepository.findByStudentId(studentId);
    }

    public List<Query> getAssignedQueries(Long counsellorId) {
        return queryRepository.findByCounsellorId(counsellorId);
    }

    public Query getQueryById(Long id) {
        return queryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Query not found"));
    }

    @Transactional
    public Query respondToQuery(Long id, String response, User counsellor) {
        Query query = getQueryById(id);
        if (query.getCounsellor() == null || !query.getCounsellor().getId().equals(counsellor.getId())) {
            throw new RuntimeException("You are not assigned to this query");
        }

        // Verify counsellor is assigned to the college (if college exists)
        if (query.getCollege() != null) {
            boolean isAssignedToCollege = assignmentRepository.existsByCounsellorIdAndCollegeId(
                    counsellor.getId(), query.getCollege().getId());
            // Allow respond if counsellor is assigned to this college OR if no assignments exist for the college (backward compatibility)
            List<CounsellorAssignment> collegeAssignments = assignmentRepository.findByCollegeId(query.getCollege().getId());
            if (!isAssignedToCollege && !collegeAssignments.isEmpty()) {
                throw new RuntimeException("You are not assigned to this college and cannot respond to this query");
            }
        }

        query.setResponse(response);
        query.setStatus(QueryStatus.RESOLVED);
        query.setRespondedAt(LocalDateTime.now());
        Query saved = queryRepository.save(query);

        // Log to historical performance record (immutable)
        CounsellorPerformance log = CounsellorPerformance.builder()
                .counsellor(counsellor)
                .queryId(saved.getId())
                .studentId(saved.getStudent().getId())
                .collegeId(saved.getCollege() != null ? saved.getCollege().getId() : null)
                .querySubject(saved.getSubject())
                .actionType("RESOLVED")
                .build();
        performanceRepository.save(log);

        return saved;
    }

    @Transactional
    public Query closeQuery(Long id, User student) {
        Query query = getQueryById(id);
        if (!query.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("You can only close your own queries");
        }
        query.setStatus(QueryStatus.CLOSED);
        return queryRepository.save(query);
    }

    @Transactional
    public void deleteQuery(Long id) {
        // Note: Performance log records are NOT deleted - they remain for historical reporting
        queryRepository.deleteById(id);
    }
}